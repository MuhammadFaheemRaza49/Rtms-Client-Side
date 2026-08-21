import {StyleSheet, TouchableOpacity, View} from 'react-native';
import appStyle from '../SearchRestaurant/shared/PCBTicketing/styles';

import React, {useContext} from 'react';
import {Color} from '../../common';
import {Context} from '../../config/LanguageProvider';
import {scale} from '../../ScalingUtils';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import TextElement from '../ComponentsV2/text/Text';
import BackIconComponent from '../ComponentsV2/BackIconComponent';
import ForwardIconComponent from '../ComponentsV2/ForwardIconComponent';
import globals from '../../../globals';

export default function AddVoucherComponent({
                                                onPress,
    primaryColor=undefined,
    analyticsEventData,
}) {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  const resolveColor= primaryColor?? colors.blueIconColor

  return (
    <TouchableOpacity
      onPress={() => {
        if (analyticsEventData?.service_type) {
          globals.FirebaseVerticalEvent(
            'AddVoucherClick',
            analyticsEventData.service_type,
            analyticsEventData.page_url,
            analyticsEventData,
          );
        }
        onPress?.();
      }}
      style={[styles.container,{borderColor: colors.borderColor2, backgroundColor: colors.bgColorWhite}]}>
      <View style={{flex: 1}}>
        <TextElement h5 medium h5Style={{color: colors.headingText, textAlign:'left'}}>
          {t('hotel:addVoucher')}
        </TextElement>
      </View>
      <View style={[appStyle.rowAlign, {alignItems: 'center'}]}>
        <TextElement  h5 medium h5Style={{color: resolveColor, marginBottom: 2}}>
          {t('hotel:viewOptions')}
        </TextElement>
        <ForwardIconComponent
              name={'chevron-thin-right'}
              size={24}
              strokeWidth={1.5}
              color={resolveColor}
            />


      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        padding:14,
        borderRadius:10,
        alignItems:'center',
        borderWidth:1,
        overflow:'hidden'
    }
})
