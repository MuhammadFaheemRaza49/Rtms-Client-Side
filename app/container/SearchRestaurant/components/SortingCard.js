import React, { useContext, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Constants from '../../../common/Constants'
import { Context } from '../../../config/LanguageProvider'
import TextElement from "../../ComponentsV2/ComponentsV2/text/Text";
import ButtonComponent from "../../ComponentsV2/ComponentsV2/BackIconComponent";

const PriceFilterCard = ({ list, onApply }) => {
  const { value: { t, themeColor } } = useContext(Context)
  const [sortList, setSortList] = useState(list)

  function onChangeList(index) {
    const updateList = sortList.map(item => ({ ...item, status: false }))
    updateList[index].status = true
    setSortList(updateList)
  }

  return (
    <View style={StyleSheet.flatten([styles.favContainer, { backgroundColor: themeColor.colors.bgColorWhite }])}>
      {/*<View style={styles.handler}/>*/}
      <TextElement style={StyleSheet.flatten([styles.favTitle])}>{t('inBus:sort')}</TextElement>
      {sortList.map((item, index) => {
        return (
          <View style={{ marginTop: 10 }} key={index.toString()}>
            <SortItem colors={themeColor.colors} isSelected={item.status} title={t(`inBus:${item?.title?.toLowerCase()}`)} onPress={() => { onChangeList(index) }} />
          </View>
        )
      })}
      <View style={StyleSheet.flatten([{ marginTop: 18 }])}>
        <ButtonComponent onPress={() => onApply(sortList)} title={t('cargo:confirm')} />
      </View>
    </View>
  )
}


const SortItem = ({ title, onPress, isSelected, colors }) => {
  return (
    <TouchableOpacity style={isSelected ? styles.selected(colors) : styles.notSelected(colors)} onPressIn={onPress}>
      <TextElement h5 medium h5Style={isSelected ? { color: colors.blueIconColor } : { color: colors.greyText }}>{title}</TextElement>
    </TouchableOpacity>
  )
}

export default PriceFilterCard
const styles = StyleSheet.create({
  favTitle: {
    fontFamily: Constants.fontFamilyBold,
    includeFontPadding: false,
    marginStart: 14,
    fontSize: 16
  },
  notSelected: (colors) => ({
    justifyContent: 'center',

    padding: 14,


  }),

  selected: (colors) => ({
    justifyContent: 'center',

    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.bgSecondaryColor,
    borderWidth: 1,
    borderColor: colors.blueIconColor,
    color: colors.blueIconColor
  }),
  favContainer: {
    paddingHorizontal: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 30
  },
  handler: {
    width: '25%',
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 15,
    backgroundColor: '#dbdbdb'
  },
  textStyle: {

  }
})
