import Block from "../../../../components/Block";
import {Image, TouchableOpacity, View, StyleSheet} from "react-native";
import appStyle from "../../PCBTicketing/styles";
import {Color} from "../../../../../common";
import React, {useContext} from "react";
import moment from "moment";
import {Context} from "../../../../../config/LanguageProvider";
import BorderedView from "../../Railways/components/BorderedView";
import SvgColorComponent from "../../../../../common/SvgColorComponent";
import TextElement from '../../../../ComponentsV2/text/Text';

const VoucherItem = ({data,isUmrah=false, onPress,showBtn=false}) => {
    const {value: {t, themeColor: {key,colors}}} = useContext(Context)
    return (
      <BorderedView onPress={onPress} style={styles.container}>
        <View style={{alignItems: 'center', flexDirection: 'row', flex: 1}}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  key === 'light'
                    ? data?.register?.style?.bg_light
                    : data?.register?.style?.bg_dark,
              },
            ]}>
            <SvgColorComponent
              width={30}
              height={30}
              color={key === 'light' ? data?.register?.style?.icon_light : data?.register?.style?.icon_dark}
              svg_url={data?.register?.style?.icon}
            />
          </View>

          <View style={{flex: 1, paddingHorizontal: 10}}>
            <TextElement h5 medium>
              {data.name}
            </TextElement>

            <View style={{flexDirection: 'row', flex: 1}}>
              <TextElement
                h6
                numberOfLines={2}
                h6Style={[{color: colors.greyText}]}>
                {data.description}
              </TextElement>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  backgroundColor: colors.bgInfoChip,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 4,
                  marginRight: 10,
                }}>
                <TextElement
                  h7
                  h7Style={[appStyle.black10, {color: colors.blueIconColor}]}>
                  {data.code}
                </TextElement>
              </View>

              <TextElement
                h7
                h7Style={[

                  {
                    color: colors.textChipError,
                  },
                ]}>
                Valid Till: {moment(data.expire_on).format('DD/MM/YYYY')}
              </TextElement>
            </View>
          </View>

          {showBtn && (
            <TouchableOpacity onPress={onPress}>
              <TextElement h4 medium h4Style={{color: isUmrah?colors.umrahTextChip:colors.blueIconColor}}>
                  {t("inBus:apply")}
              </TextElement>
            </TouchableOpacity>
          )}
        </View>
      </BorderedView>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 0,
        marginRight: 0,
        borderRadius: 8,
        borderWidth: 1,

    },
    iconContainer: {
        padding: 8,
        borderRadius: 9999,
        alignItems:"center",
        justifyContent: "center"
    }
})
export default VoucherItem
