import React, {useContext, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import BulletText from '../../PostPayment/PostPaymentV2/components/BulletText';
import TextElement from '../../ComponentsV2/text/Text';
import {Context} from '../../../config/LanguageProvider';



export default function PolicyComponent({data=[],numberOfLines=5}){
  const { value: {t, themeColor: { colors } } } = useContext(Context)
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => setShowAll(!showAll);

  const itemsToShow = showAll ? data : data?.slice(0, numberOfLines);

  if (data?.length===0) return null;



  return (
    <View>

      {itemsToShow.map((item, index) => (
        <BulletText text={item} key={index} />
      ))}


      {data.length > numberOfLines && (
        <TouchableOpacity style={{marginVertical:5}} onPress={toggleShowAll}>
          <TextElement h5 medium h5Style={styles.viewMore(colors)}>
            {showAll ? t("inBus:viewLess") : t("inBus:viewMore")}
          </TextElement>
        </TouchableOpacity>
      )}
    </View>
  )

}

const styles = StyleSheet.create({
  viewMore:(colors)=>({
    textDecorationLine:"underline",
    color:colors.blueIconColor
  })
})
