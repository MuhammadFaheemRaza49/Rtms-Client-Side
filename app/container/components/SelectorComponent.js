import React, {FC, ReactElement, useContext, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, Modal, Image, View} from 'react-native';
import { Fontisto as Fontisto } from "@react-native-vector-icons/fontisto";
import {Color, Constants, Images} from "../../common";
import {scale} from "../../ScalingUtils";
import { Feather as Icon } from "@react-native-vector-icons/feather";
import {Context} from "../../config/LanguageProvider";
import {margin, padding} from "./config/spacing";
import TextElement from '../ComponentsV2/text/Text';


const BOTTOM = margin.base - 2

const SelectorComponent = ({
                               error,
                               onPress,
                               placeholder,
                               title,
                             titleColor,
                               icon,
                             backgroundColor,
                               isIcon,
                               label,
                               iconStyle,
                               isRequired=false,
                               editable=true,
                           }) => {
    const DropdownButton = useRef();
    const {value: {themeColor: {colors}}} = useContext(Context)

    const toggleDropdown = () => {
        onPress()
    };
    return (
        <TouchableOpacity
          // style={{backgroundColor:colors.bgSecondaryColor}}
            disabled={!editable}
            ref={DropdownButton}
            onPress={toggleDropdown}>
            {label&&label!==""?  <TextElement
                h5
                medium
                h5Style={{
                    marginBottom: BOTTOM - 3,
                    color: colors.headingText,
                  textAlign:'left'
                }}>
                {label}
            </TextElement>:null}
            <View style={[styles.viewInput, {
                borderColor: error ? Color.red : colors.borderColor2,
                backgroundColor: backgroundColor||colors.bgSecondaryColor
            }]}>
                {isIcon ?

                    <Fontisto
                        name={'world-o'}
                        color={colors.greyText}
                        size={16}
                        style={[styles.icon,{marginStart:10,marginEnd: 2}]}
                    />
                    :
                    (icon ?
                        <Image
                            resizeMode={'contain'}
                            style={[styles.iconStyle, iconStyle]}
                            source={icon}
                            tintColor={colors.greyText}
                        />

                        : null)
                }

                <TextElement style={[styles.title, {color: titleColor||colors.greyText}]}>
                    {title ?? placeholder}
                </TextElement>
                {isRequired&&(
                    <TextElement h6 h6Style={[{color:Color.red}]}>*</TextElement>
                )}
                {error ? (


                    <Image
                        resizeMode={'contain'}
                        style={[styles.image,{marginEnd:margin.large}]}
                        source={Images.input.alert}
                    />
                ):
                editable ? (
                    <Icon
                        name={'chevron-down'}
                        color={colors.greyText}
                        size={16}
                        style={styles.icon}
                    />
                ) : null}
            </View>
            {typeof error === 'string'
                ? (
                    <TextElement
                        style={[
                            styles.textError,
                            {
                                color: Color.red
                            }
                        ]}>
                        {error}
                    </TextElement>
                )
                : null}
        </TouchableOpacity>


    );
};

const styles = StyleSheet.create({


    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        paddingVertical: 5,
        marginBottom: BOTTOM,
        borderWidth: 1,
        borderRadius: 10
    },
    icon: {
        paddingVertical: padding.base,
        marginEnd: 10

    },
    iconStyle: {
      marginStart:10,
        width: 16,
        height: 16
    },
    title: {
        includeFontPadding: false,
        flex: 1,
        paddingVertical:10,
        marginHorizontal: 5,
    },
    image: {
        marginStart:margin.large,
        width: 16,
        height: 16
    },
    textError: {
        fontSize: 10,
        lineHeight: 15,
        marginBottom: BOTTOM,
        fontFamily: Constants.fontFamilyMedium
    },
});

export default SelectorComponent;
