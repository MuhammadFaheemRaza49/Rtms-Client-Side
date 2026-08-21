import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {scale} from '../../ScalingUtils'
import ViewLabel from "./ViewLabel";
import {Constants} from '../../common'
import TextElement from './text/Text'

const globals = {
  theme_color: '#1552B3',
};

const Checkbox = ({ isHeading=false,error=undefined,label,title, value, isDark = true, onPress, style, checkboxStyle, colors }) => {
  return (
      <ViewLabel
          isDark={isDark}
          label={label}
          value={value}
          error={error}
          isFocus={isHeading}
          isHeading={isHeading}>
        <TouchableOpacity onPress={onPress} style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, style]}>
            <View style={[{padding: scale(5)}, checkboxStyle]}>
                {value
                  ? <View style={{width: scale(19), height: scale(19), borderRadius: 3, backgroundColor: globals.theme_color, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{color: '#FFFFFF', fontSize: 12, lineHeight: 14, includeFontPadding: false}}>✓</Text>
                    </View>
                  : <View style={{width: scale(19), height: scale(19), borderRadius: 3, borderWidth: 2, borderColor: '#dbdbdb'}}/>}
            </View>
            {isDark
              ? <TextElement style={{
                fontSize: scale(12),
                flex: 1,
                fontFamily: Constants.fontFamilyRegular,
                includeFontPadding: false,
                alignSelf: 'center'
              }}>{title}</TextElement>
              : <Text style={{ fontSize: scale(12), flex: 1, fontFamily: Constants.fontFamilyRegular, includeFontPadding: false, alignSelf: 'center' }}>{title}</Text>
            }
        </TouchableOpacity>
      </ViewLabel>
  )
}

export default Checkbox
