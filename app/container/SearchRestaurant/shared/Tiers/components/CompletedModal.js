import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
} from 'react-native';
import {TIER_DETAILS} from '../styles/detail';
import TextElement from '../../../../ComponentsV2/text/Text';
import Images from '../../../../../common/Images';
import {
  Coins,
  ContactRound,
  Files,
  Gamepad2,
  Headset,
  Percent,
} from 'lucide-react-native';
import {Context} from '../../../../../config/LanguageProvider';
import Color from '../../../../../common/Color';
import SvgColorComponent from '../../../../../common/SvgColorComponent';
import ButtonComponent from "../../../../ComponentsV2/button/ButtonComponent";
import PopUpAnimatedView from "../../../../ComponentsV2/PopUpAnimatedView";

const CompletedModal = ({tier,benefitsData=undefined, isVisible, setVisible}) => {
  const {
    value: {
      t,
      themeColor: {key,colors},
    },
  } = useContext(Context);
  const [showGif, setShowGif] = useState(true);


  useEffect(()=>{
    setTimeout(()=>{
      setShowGif(false)
    },2000)
  },[])

  const benefits = benefitsData??[
    {
      Icon: Coins,
      text: 'Get points for every booking you make',
    },
    {
      Icon: Percent,
      text: 'Receive alerts for special discounts just for you',
    },
    {
      Icon: Gamepad2,
      text: 'Play fun games and earn points, it’s a win-win!',
    },
    {
      Icon: ContactRound,
      text: 'Invite your loved ones to share the perks',
    },
    {
      Icon: Files,
      text: 'Use the drawer to keep your documents organized',
    },
    {
      Icon: Headset,
      text: 'Enjoy 24/7 support, we are always here for you',
    },
  ];

  const gradientColors = key === 'dark'
      ? [tier?.extra_info?.text_color_light, tier?.extra_info?.theme_color]
      : [tier?.extra_info?.theme_color, tier?.extra_info?.theme_color_secondary];


  return (
    <Modal
      transparent
      animationType={'fade'}

      visible={isVisible}
      onRequestClose={() => setVisible(false)}>

      <TouchableWithoutFeedback onPress={() => setVisible(false)}>

        <View style={styles.container}>
          <PopUpAnimatedView
              isVisible={isVisible}
              containerStyle={styles.modalContainer}>
          {showGif&& <ImageBackground source={require('../../../../../images/winpricegif.gif')}
                                      style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        zIndex: 99999
                                      }}></ImageBackground>}
          <TouchableWithoutFeedback onPress={() => {}}>

            <View
              style={[
                styles.gradient,
                {
                  experimental_backgroundImage: `linear-gradient(45deg, ${gradientColors.join(', ')})`,
                },
              ]}>

              <Image source={Images.tier.confetti} style={styles.image} />
              <TextElement h3 bold h3Style={{marginTop: 16}}>
                {t('tier:congratulations')}
              </TextElement>
              <TextElement h5 medium h3Style={{marginTop: 4}}>
                {t('tier:availedAll',{tier:tier?.title})+" "+t("tier:benefits")}
              </TextElement>
              <View
                style={[styles.benefitContainer,{backgroundColor:colors.bgTierBenefit}]}>
                {benefits.map((item, index) => {
                  const {Icon, text} = item;
                  return (
                    <View
                      style={[
                        styles.rowCenter,
                        {marginTop: index === 0 ? 0 : 6},
                      ]}>
                      <View
                        style={[
                          styles.rowCenter,
                          styles.iconBenefit,
                          {backgroundColor: key === 'light'
                                ? tier?.extra_info?.profile_card_light
                                : tier?.extra_info?.profile_card_dark},
                        ]}>

                        {item?.icon&&

                            <SvgColorComponent color={ key === 'light'
                                ?tier?.extra_info?.text_color_light
                                : tier?.extra_info?.text_color_dark} svg_url={item?.icon} width={20} height={20} />}

                      </View>
                      <TextElement
                        h6
                        medium
                        h6Style={{flexShrink: 1, flexWrap: 'wrap'}}>
                        {item?.description??text}
                      </TextElement>
                    </View>
                  );
                })}
              </View>

              <ButtonComponent onPress={()=>{
                setVisible(false)
              }} title={t("tier:gotIt")} style={{width:'100%', marginTop:10}}/>
            </View>

          </TouchableWithoutFeedback>
          </PopUpAnimatedView>
        </View>
      </TouchableWithoutFeedback>

    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',


  },  modalContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  gradient: {
    flexGrow: 1,
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    margin:12
  },
  image: {
    height: 160,
    objectFit: 'contain',
  },
  benefitContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    flexShrink: 1,
    width: '100%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBenefit: {
    justifyContent: 'center',
    marginEnd: 8,
    borderRadius: 5,
    padding: 6,
    overflow: 'hidden',
  },
  iconBackground: {
    zIndex:9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white20,
    borderRadius: 4,
    padding:5,
    marginBottom: 8,
  },
});

export default CompletedModal;
