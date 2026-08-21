import React, {useContext, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {Images} from '../../common';
import {Context} from '../../config/LanguageProvider';
import TextElement from '../ComponentsV2/text/Text';
import {useSelector} from 'react-redux';

const Loader = ({msg, isVisible, style}) => {
  const {
    value: {
      themeColor: {key, colors},
    },
  } = useContext(Context);
  const proTips  = useSelector(state => state.home.homeData?.appSettings?.proTips)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDark = key === 'dark';


  useEffect(() => {
    const randomIdx = getRandomIndex(proTips);
    setSelectedIndex(randomIdx);
  }, []);

  useEffect(() => {

    // Set an interval to call the function every 4 seconds
    const intervalId = setInterval(() => {
      const randomIdx = getRandomIndex(proTips);
      setSelectedIndex(randomIdx);
    }, 4000);

    return () => clearInterval(intervalId);
  },[selectedIndex])

  if (!isVisible) return null;

  function getRandomIndex(array) {
    if (!Array.isArray(array)||array?.length === 0) {
      return null; // Return null if the array is empty
    }
    return Math.floor(Math.random() * array.length)
  }

  return (
    <View
      style={[
        {
          backgroundColor: colors.bgColorWhite,
          flex: 1,
          zIndex: 2,
        },
        style,
      ]}>
      <View style={{flex:1}}/>
      <View style={{justifyContent:'center',alignItems:'center',position:'absolute',left:0, right:0, bottom:0,top:0}}>
        <Image
          style={{
            zIndex: 2,
            width: '25%',
            height: undefined,
            aspectRatio: 1,
          }}
          source={isDark ? Images.darkLoader : Images.lightLoader}
        />
      </View>

      {Array.isArray(proTips)&&proTips?.length > 0 ?
      <View style={{alignItems: 'center', padding: 20,marginBottom:'15%'}}>
        <Image
          style={{
            height:40,
            width:40,
            marginBottom:10,
          }}
          source={Images.tipBulb}
        />
        <TextElement
          h3
          medium
          h3Style={{

            textAlign: 'center',
            // color: colors.heading,
          }}>
          {proTips[selectedIndex]?.heading}
        </TextElement>
        <TextElement
          h5
          light
          h5Style={{
            textAlign: 'center',
            color: colors.greyText,
          }}>
          {proTips[selectedIndex]?.content}
        </TextElement>
      </View>:null}
    </View>
  );
};

export default Loader;
