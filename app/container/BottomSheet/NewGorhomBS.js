import React, {
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';

import { BackHandler, Keyboard, Platform, StyleSheet, View } from 'react-native';

import GorhomBottomSheet, {
    BottomSheetFlatList,
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetView,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import Block from '../components/Block';
import { Context } from '../../config/LanguageProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardEvents } from 'react-native-keyboard-controller';

const NewGorhomBS = ({
    onOpen,
    onScroll,
    keyboardShouldPersistTaps,
    onMomentumScrollEnd,

    modalHeight = undefined,

    withOverlay = true,
    overlayStyle = undefined,
    modalStyle = undefined,
    rootStyle = undefined,
    closeOnOverlayTap = true,

    flatListProps = undefined,
    android_keyboardInputMode = "adjustResize",
    alwaysOpen = false,
    isBottomSafeArea = false,
    refRBSheet,
    snapPoint = 0,

    children,
    adjustHeight = true,
    disableScroll = true,

    footer = undefined,
    header = undefined,

    onClosed = () => {
    },

    panGestureEnabled = true,
    hasTextInput = false,
}) => {
    const {
        value: {
            themeColor: { colors },
        },
    } = useContext(Context);

    const internalRef = useRef(null);
    const safeArea = useSafeAreaInsets();

    const [hasMounted, setHasMounted] = useState(alwaysOpen);
    const [isOpen, setIsOpen] = useState(false);
    // Backdrop lifetime: true from the moment an open is requested until the
    // close animation settles at index -1. gorhom's BottomSheetBackdrop is a
    // full-screen view whose pointerEvents starts as 'auto' and is flipped to
    // 'none' via an animated reaction + runOnJS — if that callback is dropped
    // (remount races, interrupted close animations) the invisible backdrop
    // keeps swallowing every touch on screen. Unmounting it entirely while
    // the sheet is closed makes that failure mode impossible.
    const [backdropActive, setBackdropActive] = useState(alwaysOpen);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const hasMountedRef = useRef(alwaysOpen);
    const prevIndexRef = useRef(alwaysOpen ? 0 : -1);
    const pendingActionRef = useRef(null);
    const isOpenRef = useRef(false);
    const onClosedRef = useRef(onClosed);
    onClosedRef.current = onClosed;

    const hasFixedSnapPoints = !adjustHeight && !alwaysOpen;

    // Dynamic sizing derives snap points from the measured content height, and
    // content only mounts on the first open — an expand() that runs before the
    // first layout lands is silently dropped by gorhom (the sheet just never
    // appears). Gate the first expand on the content's onLayout instead.
    const contentLayoutRef = useRef(alwaysOpen);
    const pendingOpenRef = useRef(null);

    const flushPendingOpen = useCallback(() => {
        const action = pendingOpenRef.current;
        if (!action) {
            return;
        }
        pendingOpenRef.current = null;
        requestAnimationFrame(() => action());
    }, []);

    const handleContentLayout = useCallback(
        event => {
            if (contentLayoutRef.current) {
                return;
            }
            if (event?.nativeEvent?.layout?.height > 0) {
                contentLayoutRef.current = true;
                flushPendingOpen();
            }
        },
        [flushPendingOpen],
    );

    const openSheet = useCallback(() => {
        setBackdropActive(true);
        // With fixed snap points, open to the first (initial) point like
        // Modalize did; expand() would jump straight to the top point.
        if (hasFixedSnapPoints) {
            internalRef.current?.snapToIndex?.(0);
            return;
        }

        if (contentLayoutRef.current || flatListProps) {
            internalRef.current?.expand?.();
            return;
        }

        pendingOpenRef.current = () => internalRef.current?.expand?.();
        // Safety net: content that never reports a layout (or reports height
        // 0) must not leave the sheet permanently unopenable.
        setTimeout(() => {
            const action = pendingOpenRef.current;
            if (action) {
                pendingOpenRef.current = null;
                action();
            }
        }, 300);
    }, [hasFixedSnapPoints, flatListProps]);

    const runOrDefer = useCallback(action => {
        if (hasMountedRef.current) {
            action();
            return;
        }

        pendingActionRef.current = action;
        hasMountedRef.current = true;
        setHasMounted(true);
    }, []);

    // Runs after the commit that mounts the sheet content, so the deferred
    // open/snap no longer races the re-render triggered by setHasMounted.
    useEffect(() => {
        if (!hasMounted || !pendingActionRef.current) {
            return;
        }

        const action = pendingActionRef.current;
        pendingActionRef.current = null;

        setTimeout(() => {
            action();
        }, 100);
    }, [hasMounted]);

    useImperativeHandle(refRBSheet, () => ({
        open: () => {
            runOrDefer(openSheet);
        },

        close: () => {
            // Cancel a deferred first open so an open()→close() sequence in
            // the same tick can't resurrect the sheet after close ran.
            pendingActionRef.current = null;
            pendingOpenRef.current = null;
            internalRef.current?.close?.();
        },

        snapTo: index => {
            runOrDefer(() => {
                setBackdropActive(true);
                internalRef.current?.snapToIndex?.(index);
            });
        },
    }));

    // Modalize closed the sheet on Android hardware back; gorhom does not.
    useEffect(() => {
        if (Platform.OS !== 'android' || !isOpen) {
            return;
        }

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (alwaysOpen) {
                    internalRef.current?.snapToIndex?.(0);
                } else {
                    internalRef.current?.close?.();
                }
                return true;
            },
        );

        return () => subscription.remove();
    }, [isOpen, alwaysOpen]);

    // Unmounting the owning screen while the sheet is open skips gorhom's
    // close lifecycle entirely: the keyboard the sheet opened stays visible
    // and onClosed never fires, leaving owners that track open state stuck.
    // Run the close side effects manually on unmount.
    useEffect(() => {
        return () => {
            if (isOpenRef.current) {
                Keyboard.dismiss();
                onClosedRef.current?.();
            }
        };
    }, []);

    // KeyboardProvider (react-native-keyboard-controller) forces the Android
    // window into edge-to-edge mode, which turns the manifest's adjustResize
    // into a no-op: the window never resizes when the keyboard opens, and
    // gorhom itself stays passive in adjustResize mode — so inputs end up
    // hidden behind the keyboard. Compensate by padding the content with the
    // keyboard height; dynamic sizing then grows the sheet to keep inputs
    // visible. Sheets that opt into adjustPan are repositioned by gorhom
    // itself, so they are excluded to avoid compensating twice.
    useEffect(() => {
        if (
            Platform.OS !== 'android' ||
            android_keyboardInputMode !== 'adjustResize'
        ) {
            return;
        }

        // alwaysOpen sheets sit at their first snap point with isOpen still
        // false, but their inputs need the same compensation.
        if (!isOpen && !alwaysOpen) {
            setKeyboardHeight(0);
            return;
        }

        const showSubscription = KeyboardEvents.addListener(
            'keyboardWillShow',
            event => setKeyboardHeight(event.height),
        );
        const hideSubscription = KeyboardEvents.addListener(
            'keyboardWillHide',
            () => setKeyboardHeight(0),
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [isOpen, alwaysOpen, android_keyboardInputMode]);

    const snapPoints = useMemo(() => {
        if (adjustHeight) {
            return undefined;
        }

        if (alwaysOpen && snapPoint > 0) {
            return [snapPoint, modalHeight ?? '90%'];
        }

        if (alwaysOpen) {
            return [modalHeight ?? '50%'];
        }

        if (modalHeight) {
            return [modalHeight];
        }

        if (snapPoint > 0) {
            return [snapPoint, '90%'];
        }

        return ['90%'];
    }, [alwaysOpen, snapPoint, modalHeight, adjustHeight]);

    const initialIndex = alwaysOpen ? 0 : -1;

    const renderBackdrop = useCallback(
        props => {
            if (!withOverlay || !backdropActive) {
                return null;
            }

            return (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={alwaysOpen ? 0 : -1}
                    appearsOnIndex={alwaysOpen ? 1 : 0}
                    style={[
                        props.style,
                        // Match the hosting container's zIndex: the backdrop
                        // is rendered as a sibling before it, so without this
                        // any screen overlay with its own zIndex would wedge
                        // between backdrop and sheet and swallow the
                        // tap-outside-to-close.
                        { backgroundColor: colors.overlay, zIndex: 9999999 },
                        overlayStyle,
                    ]}
                    pressBehavior={
                        !alwaysOpen && closeOnOverlayTap ? 'close' : 'none'
                    }
                />
            );
        },
        [
            withOverlay,
            backdropActive,
            colors.overlay,
            overlayStyle,
            alwaysOpen,
            closeOnOverlayTap,
        ],
    );

    const defaultHeader = useCallback(() => {
        return (
            <Block
                isForground={true}
                style={{
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }}>
                <View style={styles.handler} />
            </Block>
        );
    }, []);

    const renderHeader = useCallback(() => {
        if (typeof header === 'function') {
            return header();
        }

        if (header === null) {
            return null;
        }

        return header ?? defaultHeader();
    }, [header, defaultHeader]);

    // footerComponent receives animatedFooterPosition and must render
    // BottomSheetFooter — without it the footer is never pinned to the
    // bottom of the sheet nor measured for layout.
    const renderFooter = useCallback(
        props => {
            if (!footer) {
                return null;
            }

            return (
                <BottomSheetFooter {...props}>
                    {typeof footer === 'function' ? footer() : footer}
                </BottomSheetFooter>
            );
        },
        [footer],
    );

    const paddingBottom =
        Platform.OS === 'ios'
            ? 5
            : isBottomSafeArea
                ? Math.max(safeArea.bottom - 10, 0)
                : 0;

    const contentPaddingBottom = paddingBottom + keyboardHeight;

    const renderContent = () => {
        if (!hasMounted) {
            return null;
        }

        if (flatListProps) {
            return (
                <BottomSheetFlatList
                    enableFooterMarginAdjustment={!!footer}
                    {...flatListProps}
                    style={[styles.flatList, flatListProps?.style]}
                    contentContainerStyle={[
                        { paddingBottom },
                        flatListProps?.contentContainerStyle,
                        keyboardHeight > 0 && {
                            paddingBottom: contentPaddingBottom,
                        },
                    ]}
                    keyboardShouldPersistTaps={
                        keyboardShouldPersistTaps ??
                        flatListProps?.keyboardShouldPersistTaps ??
                        'handled'
                    }
                    nestedScrollEnabled
                    scrollEnabled
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                />
            );
        }

        if (disableScroll) {
            return (
                <BottomSheetView
                    enableFooterMarginAdjustment={!!footer}
                    style={[
                        styles.contentView,
                        {
                            paddingBottom: contentPaddingBottom,
                        },
                    ]}>
                    <Block
                        isForground={true}
                        onLayout={handleContentLayout}
                        style={[
                            styles.contentBlock,
                            {
                                paddingBottom,
                            },
                        ]}>
                        {children}
                    </Block>
                </BottomSheetView>
            );
        }

        return (
            <BottomSheetScrollView
                enableFooterMarginAdjustment={!!footer}
                keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'handled'}
                nestedScrollEnabled
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: contentPaddingBottom }}>
                <Block
                    isForground={true}
                    onLayout={handleContentLayout}
                    style={styles.contentBlock}>
                    {children}
                </Block>
            </BottomSheetScrollView>
        );
    };

    return (
        <GorhomBottomSheet
            ref={internalRef}
            index={initialIndex}
            snapPoints={snapPoints}
            enableDynamicSizing={adjustHeight}
            enablePanDownToClose={!alwaysOpen}
            enableContentPanningGesture={panGestureEnabled}
            enableHandlePanningGesture
            backdropComponent={renderBackdrop}
            backgroundStyle={[
                {
                    backgroundColor: colors.bgColorWhite,
                },
                modalStyle,
            ]}
            handleComponent={renderHeader}
            footerComponent={footer ? renderFooter : undefined}
            keyboardBehavior={hasTextInput ? 'interactive' : 'extend'}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode={android_keyboardInputMode}
            // The zIndex in `style` only reaches the sheet body INSIDE
            // gorhom's hosting container; the hosting container itself is what
            // competes with sibling views on the screen. Without this, any
            // sibling with an explicit zIndex (e.g. HotelSearchSelection's
            // edit-mode backdrop) stacks above the sheet and steals its
            // touches.
            containerStyle={{ zIndex: 9999999 }}
            onChange={index => {
                const openThreshold = alwaysOpen ? 1 : 0;
                const wasOpen = prevIndexRef.current >= openThreshold;
                const nowOpen = index >= openThreshold;

                prevIndexRef.current = index;
                isOpenRef.current = nowOpen;
                setIsOpen(nowOpen);
                // Keep the backdrop mounted through the whole open/close
                // animation; drop it only once fully closed (index -1).
                setBackdropActive(index !== -1);

                // Fire once per open, not on every snap/keyboard resize.
                if (nowOpen && !wasOpen) {
                    onOpen?.();
                }
            }}
            onClose={() => {
                onClosed?.();
            }}
            style={[
                {
                    zIndex: 9999999,
                },
                rootStyle,
            ]}>
            {renderContent()}
        </GorhomBottomSheet>
    );
};

export default NewGorhomBS;

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
    },

    contentView: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    contentBlock: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    scrollView: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    handler: {
        width: '15%',
        height: 4,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 15,
        backgroundColor: '#dbdbdb',
    },
});