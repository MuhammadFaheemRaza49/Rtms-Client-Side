import React, {useContext} from 'react'
import {Image, TouchableOpacity} from 'react-native'

import {Context} from '../../config/LanguageProvider'
import {Images} from "../../common";
import images from "../../common/Images";
import TextElement from '../ComponentsV2/text/Text';

const NewCheckBox = ({title, checkBoxValue, onPress,titleStyle}) => {
    const {value: {themeColor: {colors}}} = useContext(Context)
    return (
        <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', marginTop: 8, alignItems:'center'}}>
            <Image
                style={{height:16,width:16}}
                source={checkBoxValue?Images.deleteAccount.checked:images.deleteAccount.unchecked}
            />
            <TextElement h5 h5Style={[{

                marginStart: 5,

            },titleStyle]}>{title}</TextElement>
        </TouchableOpacity>
    )
}

export default NewCheckBox
