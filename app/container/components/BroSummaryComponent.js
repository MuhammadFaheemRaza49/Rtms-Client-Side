import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {scale} from "../../ScalingUtils";
import {Images} from "../../common";
import TextElement from "./text/Text";
import {navigate} from "../../navigation/RootNavigation";
import {bookme_bro} from "../../navigation/NavigationPath";
import PriceTextElement from "./text/PriceTextElement";
import globals from '../../../globals'
import Text from "./Text";
import Color from "../../common/Color";
import {useNavigation} from '@react-navigation/native';


const BroSummaryComponent = ({price, detail}) => {
const navigation = useNavigation();

    const words = detail?.summary_text.split(' ');

    let styleWords = [];
    for (let word of words) {

        if (word == '{AMOUNT}') {
            styleWords.push(<TextElement
                h5
                medium
                h5Style={{color: "#18181B"}}
            >
                {price + " "}
            </TextElement>)
        } else if (word == '{SUBSCRIPTION_NAME}') {
            styleWords.push(<TextElement
                h5
                bold
                h5Style={{color: "#662499"}}
            >
                {detail?.name + " "}
            </TextElement>)
        } else {
            styleWords.push(
                <TextElement
                  h5
                  medium
                    h5Style={{color: "#18181B"}}
                >
                    {word + " "}
                </TextElement>)
        }

    }

    return (
      <TouchableOpacity
        onPress={() => {

            navigation.navigate(bookme_bro.main_stack);
        }}
        style={styles.container}>
          <View style={{flexBasis: '80%'}}>
              <TextElement
                h5
                medium
                h5Style={{zIndex: 1, lineHeight: 16, color: '#18181B'}}>
                  {styleWords}
              </TextElement>
          </View>
          <Image
            source={Images.tier.broIcon}
            style={{width: 48, height: 48, objectFit: 'contain', zIndex: 1}}
          />
          <Image source={Images.tier.semiHoop} style={styles.hoop} />
      </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: Color.violet200,
        color: Color.black,
        borderRadius: 4,
        overflow: 'hidden',
    },
    hoop: {
        position: 'absolute',
        bottom: 0,
        right: 20
    }
})


export default BroSummaryComponent;
