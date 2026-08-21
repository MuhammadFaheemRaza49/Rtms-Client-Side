import React, { useContext } from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import appStyle from '../shared/PCBTicketing/styles'
import Color from '../../../common/Color'
import Card from '../shared/PCBTicketing/component/Card'
import Constants from '../../../common/Constants'
import TextElement from '../../components/text/Text'
import { Context } from '../../../config/LanguageProvider'
import NewPriceComponent from "../../components/text/NewPriceComponent";




export default function VoucherItem ({ onPress, item, isSelected, style, children, available ,currency}) {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
        <TouchableOpacity onPress={onPress} style={[isSelected ? styles.selectedContainer : [styles.container, { borderColor: colors.borderColor }], style]}>
        <View
            style={{ paddingHorizontal: 10 }}
            // style={[isSelected ? styles.selectedContainer : styles.container, style]}
        >
            <View style={styles.rowStyle}>
                <TextElement style={[appStyle.h1, { fontFamily: Constants.fontFamilyMedium }]}>{item.title}</TextElement>
                {item.price &&



                    <NewPriceComponent
                    currency={currency}
                containerStyle={{  marginVertical: 5}}
                value={item.price}
                style={[appStyle.h1, {
                    color:colors.blueIconColor,

                }]}
            />
                }
                {item.discount &&
                <Text style={[appStyle.h1, {
                  color: colors.blueIconColor,
                  fontFamily: Constants.fontFamilyMedium
                }]}>{item.discount} % Discount</Text>
                }
                {item.tickets &&
                <Text style={[appStyle.h1, {
                  color: colors.blueIconColor,
                  fontFamily: Constants.fontFamilyMedium
                }]}>{item.tickets}</Text>
                }
            </View>
            {item.route &&
            <TextElement style={[appStyle.h3]}>{item.route}</TextElement>
            }
            <Text style={[appStyle.grey10, {color: colors.greyText}]}>{item.description}</Text>

        </View>
            {children}
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {

    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 5
  },
  selectedContainer: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#0C4DA8',
    borderRadius: 10
  },
  rowStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

})
