import {View} from "react-native";
import TextElement from "../../../../components/text/Text";
import appStyle from "../../PCBTicketing/styles";
import React, {useContext} from 'react';
import {Color} from '../../../../../common';
import {Context} from '../../../../../config/LanguageProvider';

const HeadingComponent = ({title, value}) => {
  const {value: {t, themeColor: {colors}}} = useContext(Context)

    return (
        <View>
            <TextElement h5 medium h5Style={{color: colors.headingText}}>
                {title}
            </TextElement>
            <TextElement h5 light h5Style={[{
              color:colors.greyText,
              textTransform: 'capitalize',
            }
            ]}>
                {value}
            </TextElement>
        </View>
    )

}
export default HeadingComponent
