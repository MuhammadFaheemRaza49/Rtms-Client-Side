import { Text, View } from 'react-native'
import globals from '../../../../globals'
import { scale } from '../../../ScalingUtils'
import React, {useContext} from 'react';
import TextElement from '../../components/text/Text'
import {Context} from '../../../config/LanguageProvider';

const NoteText = ({ amount, isUrdu }) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);


  return (
        <View>
        {amount <= 0 && isUrdu
          ? <TextElement
                h6 light h6Style={{ color:colors.greyText }}>{'\n'}<TextElement
                h6 medium h6Style={{
                  color: colors.headingText
                }}>Note:</TextElement> The total amount to be paid has been deducted from your Bookme Balance. If you tap on
                the <TextElement h6 medium h6Style={{color:colors.greyText}}>'Proceed To Pay'</TextElement> button
                below, your ticket will be automatically booked.{'\n'}</TextElement>
          : null}
            {amount === 0 && !isUrdu
              ? <TextElement
                h6 light h6Style={{ color:colors.greyText }}>{'\n'}<TextElement
                h6 medium h6Style={{
                color: colors.headingText
              }}>نوٹ :</TextElement>ادا کی جانے والی کل رقم آپ کے بُک می بیلنس سے کٹوتی کی گئی ہے اور 0 روپے ہے۔ اگر آپ ذیل میں 'ادائیگی جاری رکھیں' کے بٹن پر ٹیپ کرتے ہیں تو ، آپ کا ٹکٹ خود بخود بک ہوجاتا ہے۔

            </TextElement>
              : null}
        </View>
  )
}
export default NoteText
