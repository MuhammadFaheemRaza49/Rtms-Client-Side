import React, {useState, useRef, useEffect, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import InputBasic from './InputBasic';
import ViewLabel, {MIN_HEIGHT} from '../ViewLabel';
import {margin, padding} from '../config/spacing';
import {Color, Constants} from "../../../common";
import {scale} from "../../../ScalingUtils";
import TextElement from '../../ComponentsV2/text/Text';

const InputVerify = ({
                         label,
                         error,
                         secureTextEntry,
                         style,
                         multiline,
                         verify,
                         btnName,
                         colors,
                         value,
                         defaultValue,
                         onFocus,
                         onBlur,
                         onChangeText,
                         editable,
                         isUmrah = false,
                         ...rest
                     }) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);
    const [isHeading, setIsHeading] = useState(value || defaultValue);
    const input = useRef(null);

    useEffect(() => {
        setIsHeading(value);
    }, [value]);

    const handleFocus = data => {
        setIsHeading(true);
        if (onFocus) {
            onFocus(data);
        }
    };

    const onChange = val => {
        if (onChangeText) {
            onChangeText(val);
        }
    };

    const handleBlur = data => {
        setIsHeading(prev => prev || (!input.current && input.current._lastNativeText));
        if (onBlur) {
            onBlur(data);
        }
    };

    const resolveColors = useMemo(() => {
        return isUmrah ? (colors ? colors.umrahTextChip : Color.umrahPrimary) : (colors ? colors.blueIconColor : Color.primary)
    }, [colors, isUmrah])

    return (
        <ViewLabel label={label} error={error} isHeading={isHeading}>
            <View style={[styles.viewInput]}>
                <InputBasic
                    {...rest}
                    inputRef={input}
                    testID="RN-text-input"
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onChangeText={onChange}
                    secureTextEntry={isSecure}
                    multiline={multiline}
                    style={[
                        editable === false && {backgroundColor: "rgba(184, 180, 182, .36)"},
                        styles.input,
                        !multiline && {height: MIN_HEIGHT},
                        style && style,
                    ]}
                />
                <TouchableOpacity onPressIn={verify}>
                    <TextElement
                        h5
                        medium
                        h5Style={[styles.primayText, {color: resolveColors}]}
                    >
                        {btnName ?? 'Verify'}
                    </TextElement>
                </TouchableOpacity>
            </View>
        </ViewLabel>
    );
};

const styles = StyleSheet.create({
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: padding.large,
    },
    viewIcon: {
        marginRight: margin.large,
    },
    icon: {
        paddingVertical: padding.base,
        marginRight: margin.large,
    },
    primayText: {
        fontFamily: Constants.fontFamilyMedium,
        fontSize: scale(12),
        includeFontPadding: false,
        color: Color.primary,
        marginEnd: 20,
        marginBottom: 5,
    },
});

export default InputVerify;