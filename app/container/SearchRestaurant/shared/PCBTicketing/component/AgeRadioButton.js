import React, {useContext} from 'react'
import { StyleSheet, View } from 'react-native'
import { scale } from '../../../../../ScalingUtils'
import { Color, Constants } from '../../../../../common'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import {Context} from "../../../../../config/LanguageProvider";

const AgeRadioButton = ({ onChange, value = 0 ,age}) => {
  // eslint-disable-next-line camelcase
    const { value: {t,language, themeColor: { colors } } } = useContext(Context)
    const radio_props = [{ label: t("airline:nationalID"), value: 1 }, { label: t("airline:passportNumber"), value: 0 }]
    return (
      <View style={styles.container}>
        <RadioForm
          buttonSize={scale(8)}
          buttonOuterSize={scale(20)}
          formHorizontal={true}>
          {radio_props.map((obj, i) => (
            <RadioButton
              style={{alignItems: 'center'}}
              labelHorizontal={true}
              key={i}>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={value === obj.value}
                onPress={onChange}
                buttonInnerColor={colors.bgColorWhite}
                buttonOuterColor={
                  value === obj.value ? Color.primary : colors.borderColor2
                }
                buttonSize={scale(8)}
                buttonOuterSize={scale(16)}
                buttonInnerSize={scale(10)}
                buttonStyle={{
                  borderWidth: value === obj.value ? 8 : 1,
                }}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                onPress={onChange}
                labelStyle={{
                  // letterSpacing:-0.5,
                  fontSize: 14,
                  marginStart:5,
                  color: colors.white,
                  marginEnd: 10,
                  fontFamily: language==='ar'?Constants.fontFamilyMediumArabic:Constants.fontFamilyMedium,
                }}
              />
            </RadioButton>
          ))}
        </RadioForm>
      </View>
    );
}

export default AgeRadioButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5
  }
})
