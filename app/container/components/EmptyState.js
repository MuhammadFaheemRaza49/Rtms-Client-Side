import {Image, Text, TouchableOpacity, View} from 'react-native'
import {widthPercentageToDP} from 'react-native-responsive-screen'
import globals from '../../../globals'
import {scale} from '../../ScalingUtils'
import React, {useContext} from 'react';
import TextElement from './text/Text'
import {useSelector} from "react-redux";
import {Color} from "../../common";
import {Context} from '../../config/LanguageProvider';

const EmptyState = ({onPress,isShowBtn=true, image, title, description, btnText, style, imageStyle}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);




    return (
        <View style={[style, {flex: 1}]}>

            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Image style={[{width: widthPercentageToDP('50%'), height: undefined, aspectRatio: 1}, imageStyle]} source={image}/>
                <TextElement
                    h2 bold
                    h2Style={{
                        marginTop:10,
                        textAlign: 'center',
                        color:colors.headingText,
                    }}>
                    {title}
                </TextElement>
                <TextElement
                    h5 light
                    h5Style={{
                      textAlign: 'center',
                        color:colors.greyText,
                      marginTop:10,
                      marginHorizontal:20,
                    }}
                >{description}</TextElement>

                {isShowBtn&&
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    backgroundColor: globals.theme_color,
                    borderRadius: 10,
                    marginTop: 20,
                    alignItems: 'center',
                }}
                                  onPress={onPress}>
                    <Text style={{

                        color: '#ffffff',
                        fontFamily: globals.medium,
                        fontSize: 15,
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        textAlign: 'center',
                        includeFontPadding: false,
                        textAlignVertical: 'center',
                        fontWeight: '400'
                    }}>{btnText}</Text>
                </TouchableOpacity>}
            </View>
        </View>
    )
}

export default EmptyState
