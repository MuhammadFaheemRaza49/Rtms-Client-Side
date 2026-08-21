import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Color, Tools} from '../../../../../common';
import Block from '../../../../components/Block';
import {History} from 'lucide-react-native';
import appStyle from '../../PCBTicketing/styles';
import TextElement from '../../../../ComponentsV2/text/Text';
import {Context} from '../../../../../config/LanguageProvider';
import homeStyle from '../../HomeContainer/homeStyle';



function RecentSearchComponent({onSelect,title,description}) {
  const {value:{t,themeColor:{colors}}} = useContext(Context)


  return(
    <Block isForground={true} style={{}}>
      <TouchableOpacity

        style={StyleSheet.flatten([styles.container,{borderColor: colors.borderColor2}])}
        onPress={() => onSelect()}>
        <View style={[styles.circleContainer,{backgroundColor: colors.bgInfoChip}]}>

            <History strokeWidth={1.5} size={24} color={colors.textInfoChip} />

        </View>
        <View style={{flex:1}}>
          <View style={[appStyle.rowAlign,{flex:1}]}>


            <TextElement
              h5
              medium
              h5Style={StyleSheet.flatten([

                {color: colors.headingText},
              ])}>{`${title}`}</TextElement>
          </View>
          <View style={homeStyle.rowHorizantalCenter}>
          <TextElement h6 light h6Style={[styles.countryName,{color : colors.greyText}]}>
            {description}
          </TextElement>
          </View>
        </View>
      </TouchableOpacity>
    </Block>
  )

}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  circleContainer: {
    backgroundColor: Color.backgroundHighlighter,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
  },
})
export default RecentSearchComponent;
