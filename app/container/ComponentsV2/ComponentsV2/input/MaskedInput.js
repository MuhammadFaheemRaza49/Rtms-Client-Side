import React, {useContext, useMemo, useState} from 'react';
import {Image, Platform, StyleSheet, TextInput, View} from 'react-native';
import {scale} from "../../../ScalingUtils";
import Color from '../../../../../common/Color';
import Constants from '../../../../../common/Constants';
import Images from '../../../../../common/Images';
import {Context} from "../../../config/LanguageProvider";
import {margin, padding} from "../../components/config/spacing";
import TextElement from "../text/Text";
import {useSelector} from 'react-redux';

const MIN_HEIGHT = 53;
const BOTTOM = margin.base - 6;

// Fills digits into a '9'/separator pattern (e.g. "99999-9999999-9").
// Masking is done here on a plain controlled TextInput: react-native-mask-text
// keeps its own copy of the value and re-emits onChangeText whenever the value
// prop changes programmatically, which loops with parent state
// ("Maximum update depth exceeded", akinncar/react-native-mask-text#320).
function applyMask(input, pattern) {
    const raw = String(input ?? '');
    if (!pattern) return raw;
    const digits = raw.replace(/\D/g, '');
    let out = '';
    let di = 0;
    for (let i = 0; i < pattern.length && di < digits.length; i++) {
        out += pattern[i] === '9' ? digits[di++] : pattern[i];
    }
    return out;
}

function MaskedInput({
                         value,
                         onChangeText,
                         mask,
                         style,
                         tintColor,
                         keyboardType = "numeric",
                         label,
                         placeholder,
                         error,
                         lucideIcon,
                         icon,
                         isRequired,
                         editable,
                         imageStyle,
                         multiline = false,
                     }) {

    const {value: {themeColor: {colors}}} = useContext(Context);

    const [isFocused, setIsFocused] = useState(false);

    const isRTL = useSelector(state => state.app.languagee?.rtl);

    const computedMask = useMemo(() => regexToPattern(mask), [mask]);
    // Single source of truth: what's shown is always the parent's value, masked.
    const displayValue = applyMask(value, computedMask);

    function regexToPattern(regex) {
        if (!regex) return null;

        const pattern = regex.match(/\[0-9\](\{\d+\})?/g);

        if (!pattern) {
            console.warn('MaskedInput: could not parse mask pattern:', regex);
            return null;
        }

        const parts = pattern.map(part => {
            const countMatch = part.match(/\{\d+\}/);
            const count = countMatch ? parseInt(countMatch[0].replace(/\{|\}/g, '')) : 1;
            return '9'.repeat(count);
        });

        return parts.join("-");
    }

    const onChange = (newValue) => {
        const nextValue = applyMask(newValue, computedMask);

        if (nextValue === displayValue) return;

        try {
            if (onChangeText) {
                onChangeText(nextValue);
            }
        } catch (e) {
            console.log('MaskedInput onChange error:', e);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    // FIX #5: Actually use isFocused to highlight the border on focus.
    const borderColor = error
        ? Color.red
        : isFocused
            ? colors.primaryBlue ?? colors.borderColor
            : colors.borderColor;

    return (
        <View>
            {label ? (
                <TextElement
                    h5
                    medium
                    h5Style={{
                        marginBottom: BOTTOM - 3,
                        alignSelf: "flex-start",
                    }}>
                    {label}
                </TextElement>
            ) : null}

            <View style={[styles.viewInput, {
                borderColor,
                backgroundColor: colors.bgSecondaryColor,
            }]}>
                {icon ? (
                    <>
                        {lucideIcon
                            ? lucideIcon
                            : (
                                <Image
                                    resizeMode={'contain'}
                                    source={icon}
                                    tintColor={tintColor ? tintColor : colors.greyText}
                                    style={[styles.image, imageStyle]}
                                />
                            )}
                    </>
                ) : null}

                <TextInput
                    style={[
                        styles.cnicField,
                        {
                            alignSelf: "center",
                            color: colors.white,
                            paddingVertical: computedMask
                                ? (Platform.OS === 'ios' ? 10 : 5)
                                : 4,
                            textAlign: isRTL ? 'right' : 'left',
                        },
                        style,
                    ]}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    multiline={multiline}
                    value={displayValue}
                    maxLength={computedMask ? computedMask.length : undefined}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    placeholderTextColor={colors.greyText}
                    editable={editable}
                />

                {error ? (
                    <Image
                        resizeMode={'contain'}
                        style={[styles.image, {marginEnd: margin.large}]}
                        source={Images.input.alert}
                    />
                ) : isRequired ? (
                    <TextElement h6 h6Style={[{color: Color.red, marginEnd: 10}]}>*</TextElement>
                ) : null}
            </View>

            {typeof error === 'string' ? (
                <TextElement
                    style={[
                        styles.textError,
                        {color: Color.red},
                    ]}>
                    {error}
                </TextElement>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        paddingVertical: 8,
    },
    cnicField: {
        flex: 1,
        paddingHorizontal: padding.small,
        fontSize: scale(12),
        paddingVertical: 10,
        fontFamily: Constants.fontFamilyRegular,
    },
    textError: {
        fontSize: 10,
        lineHeight: 15,
        marginBottom: BOTTOM,
        fontFamily: Constants.fontFamilyMedium,
    },
    viewIcon: {
        marginRight: margin.large,
    },
    icon: {
        paddingVertical: padding.base,
        marginRight: margin.large,
    },
    image: {
        marginStart: margin.large,
        width: scale(16),
        height: scale(16),
        marginEnd: 5,
    },
});

export default MaskedInput;
