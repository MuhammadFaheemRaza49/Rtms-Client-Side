import Color from "../../../../../common/Color";
import Constants from "../../../../../common/Constants";
import React, {useContext, useRef, useState, useEffect} from "react";
import {Context} from "../../../../../config/LanguageProvider";
import {TouchableOpacity as Ripple, StyleSheet, Text, View} from "react-native";
import {scale} from "../../../../../ScalingUtils";
import {padding} from "../../../../components/config/spacing";
import TextElement from "../../../../ComponentsV2/ComponentsV2/text/Text";
import homeStyle from '../../HomeContainer/homeStyle';


const SelectionButton = ({ disable,textStyle,children,endIcon=undefined,error,onPress,backgroundColor=undefined,borderColor=undefined,placeholder,title,icon,isIcon,isHeading=false,isDark=true,label,showIconDD=true,containerStyle}) => {
  const DropdownButton = useRef();
  const { value: { language,themeColor: { colors } } } = useContext(Context)


  const toggleDropdown = () => {
    onPress()
  };
  return (
      <Ripple
          rippleColor="rgba(0, 0, 0, 0.3)" // Customize ripple color
          rippleDuration={500} // Duration of the ripple animation
          rippleSize={'100%'}
          ref={DropdownButton}
          disabled={disable}
          onPress={toggleDropdown}>
        <View  style={styles.container}
            isDark={isDark}
            label={label}
            error={error}
            borderColor={borderColor??colors.layer_color}
            backgroundColor={backgroundColor??colors.fieldOpacity}
            isFocus={isHeading}
            isHeading={isHeading}>
          <View style={[styles.viewInput,{marginHorizontal:isIcon||icon?15:5}]}>
            {icon&&icon}
            <View style={[homeStyle.rowHorizantalCenter,{flex:1}]}>
            <TextElement numberOfLines={1} style={[styles.title,{color:title?colors.fieldTextColor:colors.placeholderColor},textStyle]}>{title??placeholder}</TextElement>
            </View>
            {endIcon&&endIcon}
          </View>
        </View>
        {typeof error === 'string'
            ? (
                <TextElement
                    h7 light h7Style={[
                      styles.textError,
                      {
                        color: Color.red
                      }
                    ]}>
                  {error}
                </TextElement>
            )
            : null}
      </Ripple>


  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    height: 14,
    zIndex: 1,
  },
  container: {
    borderWidth: 1,
    paddingVertical:13,
    borderRadius:8,
    marginTop:10
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor:'rgba(0,0,0,0.3)'
  },
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:15,
    // flex:1,
  },
  textError: {
    marginBottom: 2,
    marginTop:2,
  },
  icon: {
    paddingVertical: padding.base,
    marginRight:5

  },
  iconStyle:{
    width:16,
    height:16
  },
  title: {
    includeFontPadding: false,
    flex:1,
    flexShrink:1,
    marginHorizontal: 10,
    fontFamily: Constants.fontFamilyRegular,
  },
});

export default SelectionButton;
