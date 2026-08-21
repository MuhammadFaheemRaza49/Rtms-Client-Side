import React, {useContext} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import TextElement from "../../../../ComponentsV2/text/Text";
import Images from "../../../../../common/Images";
import Color from "../../../../../common/Color";
import {useNavigation} from "@react-navigation/native";
import {bookme_bro} from "../../../../../navigation/NavigationPath";
import {useSelector} from 'react-redux';
import homeStyle from '../homeStyle';
import {Context} from "../../../../../config/LanguageProvider";
import ForwardIconComponent from '../../../../ComponentsV2/ForwardIconComponent';

const BookmeBroCard = ({}) => {
  const {
    value: {
      t,
      themeColor: {key,colors},
    },
  } = useContext(Context);
  const userInfo = useSelector(state => state.user.userInfo)
  const navigation = useNavigation()


  return (
    <TouchableOpacity
        onPressIn={() => {

        navigation.navigate(bookme_bro.main_stack,{
          screen: bookme_bro.welcome,
        });
      }}
      style={styles.container}>
      <View style={{flexBasis: '80%',paddingBottom:10}}>
        <TextElement style={{color:"#333",}}>
        <TextElement
          h5
          medium
          h5Style={{paddingVertical:10,color:Color.black}}>
          {t('tier:welcomeBookmeBro1')}
        </TextElement>
          <TextElement
            h5
            medium
            h5Style={{paddingVertical:10,color: '#662499'}}>
            {' '}{'BookmeBro'}{' '}
          </TextElement>
        <TextElement
          h5
          medium
          h5Style={{paddingVertical:10,color:Color.black}}>
          {t('tier:welcomeBookmeBro2')}
        </TextElement>
        </TextElement>
      </View>
      <View style={homeStyle.rowHorizantalCenter}>
        <View style={[homeStyle.rowHorizantalCenter,{flex:1}]}>
        <Image
          source={Images.tier.broIcon}
          style={{width: 32, height: 32, objectFit: 'contain', zIndex: 1}}
        />
          <TextElement h3 bold h3Style={{color:Color.black,marginStart:5}}>
            {t("setting:bookmeBro")}
          </TextElement>
        </View>
        <ForwardIconComponent strokeWidth={1.5} size={24} color={Color.Text}/>
      </View>

      {/*<Image source={Images.tier.semiHoop} style={styles.hoop} />*/}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {

    padding: 12,
    marginTop: 8,
    backgroundColor: Color.violet200,

    borderRadius: 4,
    overflow: 'hidden',
  },

  hoop: {
    position: 'absolute',
    bottom: 0,
    right: 20
  }
});

export default BookmeBroCard;
