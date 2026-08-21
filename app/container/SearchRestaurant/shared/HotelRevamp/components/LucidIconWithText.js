import React, {useContext} from 'react'
import {TouchableOpacity} from "react-native";
import TextElement from "../../../../components/text/Text";
import {Context} from "../../../../../config/LanguageProvider";


const LucidIconWithText = ({icon,iconStyle,medium=true, onPress,title,titleStyle,mainStyle}) => {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    return (
        <TouchableOpacity onPress={onPress} style={[{flexDirection: 'row', alignItems: 'center',marginEnd:5},mainStyle]}>
            {icon&&icon}
            <TextElement h6 medium={medium} h6Style={[{color:colors.blueIconColor},titleStyle]}>
                {title}
            </TextElement>
        </TouchableOpacity>
    )
}



export default LucidIconWithText
