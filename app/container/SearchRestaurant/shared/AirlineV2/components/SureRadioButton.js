import React, {memo, useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {scale} from '../../../../../ScalingUtils'
import {Color, Constants} from '../../../../../common'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import {Context} from "../../../../../config/LanguageProvider";
import Text from "../../../../components/text/Text";
import TextElement from '../../../../ComponentsV2/text/Text';

const SureRadioButton = ({onChange,error, value = 1, primaryColor}) => {

    const {
      value: {
        t,
        language,themeColor: {colors},
      },
    } = useContext(Context);
  const radio_props = [
    {label: t('airline:mr'), value: 1},
    {label: t('airline:mrs'), value: 0},
    {label: t('airline:miss'), value: 2},
  ];

    return (
        <View>
        <View style={styles.container}>
            <RadioForm style={{alignItems: 'center'}}
                formHorizontal={true}
            >
                {radio_props.map((obj, i) => {


                    return (
                      <RadioButton labelHorizontal={true} key={i}>
                        <RadioButtonInput
                          obj={obj}
                          index={i}
                          isSelected={value === obj.value}
                          onPress={onChange}
                          borderWidth={1}
                          buttonInnerColor={colors.bgColorWhite}
                          buttonOuterColor={
                            value === obj.value
                              ? primaryColor ?? colors.primary
                              : colors.borderColor2
                          }
                          buttonSize={scale(8)}
                          buttonOuterSize={scale(16)}
                          buttonInnerSize={scale(10)}
                          buttonStyle={{
                            borderWidth: value === obj.value ? 8 : 1,
                          }}
                          buttonWrapStyle={{
                              marginEnd:-10
                          }}
                        />
                        <RadioButtonLabel
                          obj={obj}
                          index={i}
                          labelHorizontal={true}
                          onPress={onChange}
                          labelStyle={{
                            letterSpacing: language==='ar'?0 :- 0.5,
                            fontSize: 14,
                            marginStart: 5,
                            color: colors.headingText,
                            marginEnd: 10,
                            fontFamily:
                              language === 'ar'
                                ? Constants.fontFamilyMediumArabic
                                : Constants.fontFamilyMedium,
                          }}
                        />
                      </RadioButton>
                    );
                })

                }
            </RadioForm>
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
        </View>
    )

}

export default SureRadioButton

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5
    },
    textError: {
        fontSize: 11,
        lineHeight: 15,
        marginStart:0,
        marginBottom: 6,
        fontFamily: Constants.fontFamilyMedium
    }
})
