import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TextElement from '../../../components/text/Text';
import { Color } from '../../../../common';
import Constants from '../../../../common/Constants';
import { scale } from '../../../../ScalingUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
    searchRestaurants,
    getHomeListings,
    setSearchQuery,
} from '../../../../redux/restaurant';
import { Context } from '../../../../config/LanguageProvider';
import BottomSheet from '../../../BottomSheet/NewGorhomBS';
import Block from '../../../components/Block';
import NavigationPath from '../../../../navigation/NavigationPath';
import {
    ArrowUpRight,
    Calendar,
    Users,
    Search,
} from 'lucide-react-native';
import SelectionButton from './components/SelectionButton';
import homeStyle from '../HomeContainer/homeStyle';

const defaultThemeColor = {
    layer_color: '#CCCCCC',
    verticalBgColor: '#1E1E1E',
    primaryBg: Color.headerBlue,
    headingText: Color.white,
    fieldTextColor: Color.placeholderColor,
    fieldBackground: Color.fieldBackground,
    textPrimary: Color.textPrimary,
};

const RestaurantSearchSelection = ({
    style,
    onSearch,
    onCloseEdit,
    heightOfEdit,
    fadeAnimBottom,
    isChange = false,
    onBack = undefined,
}) => {
    const {
        value: { t },
    } = useContext(Context);
    const modalizeRef = useRef();
    const refBSGuests = useRef();

    const { searchResults, loading, error, searchQuery } = useSelector(state => state.restaurant);
    const dispatch = useDispatch();
    const colors = defaultThemeColor;
    const navigation = useNavigation();

    const [restaurantName, setRestaurantName] = useState(searchQuery || '');
    const [selectedDate, setSelectedDate] = useState(
        moment(new Date()).format('DD MMM, YYYY'),
    );
    const [guestCount, setGuestCount] = useState(2);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const translateAnim = useRef(new Animated.Value(0)).current;
    const animContentFade = useRef(new Animated.Value(1)).current;
    const animEditRestaurantOp = useRef(new Animated.Value(0)).current;
    const translateFirstField = useRef(new Animated.Value(0)).current;
    const expandedHeight = useRef();
    const editFieldHeight = useRef();
    const fieldHeight = useRef();

    const animDuration = 300;

    useEffect(() => {
        dispatch(getHomeListings());
    }, [dispatch]);

    useEffect(() => {
        if (restaurantName && restaurantName.length >= 2) {
            dispatch(setSearchQuery(restaurantName));
            dispatch(searchRestaurants(restaurantName, selectedDate, guestCount));
            setShowDatePicker(false);
        } else if (restaurantName.length < 2) {
            setShowDatePicker(false);
        }
    }, [restaurantName, dispatch, selectedDate, guestCount]);

    useEffect(() => {
        if (restaurantName.length >= 2 && searchResults?.length > 0) {
            animateToOpenRestaurantList();
        }
    }, [restaurantName.length >= 2 && searchResults?.length > 0]);

    const calculateToValue = (
        expandedHeightRef,
        editFieldHeightRef,
        extraOffset = 35,
    ) => {
        return (
            -expandedHeightRef.current +
            editFieldHeightRef.current +
            extraOffset
        );
    };

    const animateToOpenRestaurantList = () => {
        if (!expandedHeight.current || !editFieldHeight.current) return;
        Animated.parallel([
            Animated.timing(translateAnim, {
                toValue: calculateToValue(expandedHeight, editFieldHeight),
                duration: animDuration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(animContentFade, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: true,
            }),
            Animated.timing(animEditRestaurantOp, {
                toValue: 1,
                duration: animDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateToCloseRestaurantList = () => {
        Animated.parallel([
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: animDuration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(animContentFade, {
                toValue: 1,
                duration: animDuration,
                useNativeDriver: true,
            }),
            Animated.timing(animEditRestaurantOp, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowDatePicker(false);
        });
    };

    const handleRestaurantSelection = (restaurant) => {
        if (onSearch) {
            onSearch(restaurant);
        } else {
            dispatch(setSearchQuery(restaurant.name));
            navigation.navigate(NavigationPath.RestaurantDetails, {
                restaurantId: restaurant.id,
                restaurantData: restaurant,
            });
        }
        animateToCloseRestaurantList();
        setRestaurantName('');
    };

    const openGuestsBottomSheet = () => {
        refBSGuests.current?.open();
    };

    const closeGuestsBottomSheet = () => {
        refBSGuests.current?.close();
    };

    const handleGuestsSelect = (count) => {
        setGuestCount(count);
        closeGuestsBottomSheet();
    };

    const renderRestaurantItem = ({ item }) => (
        <TouchableOpacity
            style={styles.restaurantItem}
            onPress={() => handleRestaurantSelection(item)}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.restaurantImage}
                resizeMode="cover"
            />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantLocation}>{item.location}</Text>
                <View style={styles.ratingRow}>
                    <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
                    <Text style={styles.reviewCount}>({item.reviewCount || '1,123'})</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderTopContent = () => (
        <Animated.View style={{ opacity: animContentFade }}>
            <View style={styles.titleRow}>
                <TouchableOpacity
                    accessibilityLabel="Go back"
                    onPress={() => (onBack ? onBack() : navigation.goBack())}
                    style={styles.backButton}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search Restaurants</Text>
            </View>
            <View key="SelectionView">
                <Animated.View
                    onLayout={event => {
                        fieldHeight.current = event.nativeEvent.layout.height;
                    }}
                    style={{ transform: [{ translateY: translateFirstField }] }}>
                    <SelectionButton
                        icon={<Search color={Color.white} size={16} />}
                        placeholder="Search Restaurant"
                        title={restaurantName}
                        onPress={() => {
                            if (restaurantName.length >= 2) {
                                dispatch(searchRestaurants(restaurantName, selectedDate, guestCount));
                            }
                        }}
                    />
                </Animated.View>
                <Animated.View style={{ transform: [{ translateY: translateFirstField }] }}>
                    <SelectionButton
                        icon={<Calendar color={Color.white} size={16} />}
                        placeholder="Select Date"
                        title={selectedDate}
                        onPress={() => setShowDatePicker(value => !value)}
                    />
                </Animated.View>
                <View style={styles.bottomFieldRow}>
                    <TouchableOpacity
                        onPress={openGuestsBottomSheet}
                        style={styles.guestsButton}>
                        <Users size={16} strokeWidth={1.7} color={Color.white} />
                        <Text style={styles.fieldText}>{guestCount} Guests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="Search"
                        onPress={() => {
                            if (restaurantName.length >= 2) {
                                dispatch(searchRestaurants(restaurantName, selectedDate, guestCount));
                            }
                        }}
                        style={styles.searchButton}>
                        <Search color={Color.headerBlue} size={19} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    const animatedStyle1 = {
        transform: [{ translateY: translateFirstField }],
    };

    return (
        <View style={[style, styles.root]}>
            <View
                onLayout={event => {
                    const { height } = event.nativeEvent.layout;
                    if (heightOfEdit) heightOfEdit(height);
                    expandedHeight.current = height;
                }}>
                <Animated.View
                    style={StyleSheet.flatten([
                        styles.topHeader,
                        {
                            backgroundColor: colors.primaryBg,
                            transform: [{ translateY: translateAnim }],
                        },
                    ])}>
                    {renderTopContent()}
                    {showDatePicker && (
                        <Animated.View
                            style={{
                                opacity: animEditRestaurantOp,
                                transform: [{ translateY: translateFirstField }],
                                marginTop: 10,
                                left: 10,
                                right: 10,
                                position: 'absolute',
                                bottom: 15,
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        const prev = moment(selectedDate, 'DD MMM, YYYY').subtract(1, 'days').format('DD MMM, YYYY');
                                        setSelectedDate(prev);
                                    }}
                                    style={[
                                        styles.inlineSearchIcon,
                                        {
                                            borderColor: colors.layer_color,
                                            backgroundColor: colors.verticalBgColor,
                                        },
                                    ]}>
                                    <ArrowUpRight color={Color.white} size={20} />
                                </TouchableOpacity>
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <SelectionButton
                                        placeholder={'Select Date'}
                                        title={selectedDate}
                                        onPress={() => {}}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        const next = moment(selectedDate, 'DD MMM, YYYY').add(1, 'days').format('DD MMM, YYYY');
                                        setSelectedDate(next);
                                    }}
                                    style={[
                                        styles.inlineSearchIcon,
                                        {
                                            borderColor: colors.layer_color,
                                            backgroundColor: colors.verticalBgColor,
                                        },
                                    ]}>
                                    <ArrowUpRight color={Color.white} size={20} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}
                </Animated.View>
            </View>
            {!showDatePicker ? (
                <View style={{ flex: 1 }} />
            ) : null}
            <View
                style={{ position: 'absolute', zIndex: -11, left: 10, right: 15 }}
                onLayout={event => {
                    const { height } = event.nativeEvent.layout;
                    editFieldHeight.current = height;
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
                    <Text style={{ color: Color.white, fontSize: 12, fontFamily: Constants.fontFamilyRegular }}>
                        {'Guests: ' + guestCount + ' ' + (guestCount === 1 ? 'Person' : 'People') + '  |  Date: ' + selectedDate}
                    </Text>
                </View>
            </View>
            {restaurantName.length >= 2 && searchResults?.length > 0 && (
                <Animated.View
                    style={{
                        transform: [{ translateY: translateAnim }],
                        opacity: animEditRestaurantOp,
                        height: '100%',
                    }}>
                    <Animated.View style={{ opacity: fadeAnimBottom ?? animContentFade }}>
                        <TouchableOpacity
                            onPress={() => {
                                animateToCloseRestaurantList();
                            }}
                            style={{
                                backgroundColor: 'black',
                                height: '100%',
                            }} />
                    </Animated.View>
                    <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 10 }}>
                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontFamily: Constants.fontFamilyRegular, marginBottom: 10 }}>
                            {searchResults.length} Restaurants Found
                        </Text>
                        <FlatList
                            data={searchResults}
                            renderItem={renderRestaurantItem}
                            keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </Animated.View>
            )}
            <BottomSheet
                isBottomSafeArea={true}
                refRBSheet={modalizeRef}>
                <View style={{ padding: 20 }}>
                    <TextElement
                        h3
                        bold
                        h3Style={{ marginBottom: 15 }}>
                        Select Date
                    </TextElement>
                </View>
            </BottomSheet>
            <BottomSheet
                isBottomSafeArea={true}
                refRBSheet={refBSGuests}>
                <Block isForground={true} style={{ padding: 15 }}>
                    <TextElement
                        h3
                        bold
                        h3Style={{ marginBottom: 10 }}>
                        Guests Count
                    </TextElement>
                    {[1, 2, 3, 4, 5, 6].map(count => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.guestOption,
                                guestCount === count && styles.guestOptionSelected,
                            ]}
                            onPress={() => handleGuestsSelect(count)}>
                            <TextElement
                                h4
                                h4Style={{
                                    color: guestCount === count ? Color.white : colors.textPrimary,
                                }}>
                                {count} {count === 1 ? 'Person' : 'People'}
                            </TextElement>
                        </TouchableOpacity>
                    ))}
                </Block>
            </BottomSheet>
        </View>
    );
};

export default RestaurantSearchSelection;

const styles = StyleSheet.create({
    root: {
        flexGrow: 0,
    },
    topHeader: {
        paddingHorizontal: 9,
        paddingTop: 5,
        paddingBottom: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 27,
    },
    backButton: {
        width: 25,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    backIcon: {
        color: Color.white,
        fontSize: 23,
        lineHeight: 24,
    },
    headerTitle: {
        color: Color.white,
        fontSize: 12,
        fontWeight: '500',
    },
    bottomFieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
    },
    guestsButton: {
        flex: 1,
        minHeight: 34,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.28)',
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.10)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    fieldText: {
        color: Color.white,
        fontSize: 10,
        marginLeft: 8,
    },
    searchButton: {
        width: 35,
        height: 34,
        marginLeft: 5,
        borderRadius: 5,
        backgroundColor: Color.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    swapContainer: {
        position: 'absolute',
        borderWidth: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        right: 20,
        bottom: 45,
        top: 45,
        width: 35,
        height: 35,
        zIndex: 999,
    },
    inlineSearchIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guestOption: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: Color.fieldBackground,
    },
    guestOptionSelected: {
        backgroundColor: Color.headerBlue,
    },
    restaurantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Color.fieldBackground,
    },
    restaurantImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    restaurantInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: scale(14),
        fontFamily: Constants.fontFamilyMedium,
        color: Color.textPrimary,
        marginBottom: 2,
    },
    restaurantLocation: {
        fontSize: scale(12),
        fontFamily: Constants.fontFamilyRegular,
        color: Color.placeholderColor,
        marginBottom: 4,
    },
    starText: {
        fontSize: 12,
        color: Color.yellow_btn_color,
    },
    reviewCount: {
        fontSize: 10,
        fontFamily: Constants.fontFamilyRegular,
        color: Color.placeholderColor,
        marginLeft: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
