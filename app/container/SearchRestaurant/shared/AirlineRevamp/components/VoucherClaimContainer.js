import React, {useContext} from "react";
import {Context} from "../../../../../config/LanguageProvider";
import {StyleSheet, View} from "react-native";
import TextElement from "../../../../ComponentsV2/text/Text";
import {X} from 'lucide-react-native'
import BorderedView from "../../Railways/components/BorderedView";
import globals from '../../../../../../globals';

function VoucherClaimContainer({selectedVoucher,isUmrah=false, isPromo, isEnablePromoCredit, onCancel, analyticsEventData}) {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    return (
        <BorderedView style={{marginHorizontal: 0, marginBottom: 0, overflow: 'hidden',}}>
            <View style={StyleSheet.flatten([styles.voucherContainer])}>
              <View>
                {isPromo && <TextElement h5 medium>{t('inBus:promoClaimed')}</TextElement>}
                {isEnablePromoCredit && <TextElement h5 medium>{t('main:promoCredit')}</TextElement>}
                {selectedVoucher ?
                  <TextElement h5 medium>{selectedVoucher?.register?.voucher?.name}</TextElement>
                  : null}
                <TextElement h5 light h5Style={{color: colors.headingText}}>
                  {t("airline:voucherApplied")}
                </TextElement>
              </View>

                <X
                    onPress={() => {
                        if (analyticsEventData?.service_type) {
                            globals.FirebaseVerticalEvent(
                                'VoucherRemoved',
                                analyticsEventData.service_type,
                                analyticsEventData.page_url,
                                {
                                    ...analyticsEventData,
                                    title: selectedVoucher?.register?.voucher?.name ?? analyticsEventData.title,
                                },
                            )
                        }
                        onCancel?.()
                    }}
                    color={isUmrah?colors.umrahTextChip:colors.blueIconColor}
                    size={12}
                    strokeWidth={1.5}
                    style={{paddingHorizontal: 10, paddingVertical: 10}}
                    name={'close'}
                />
            </View>

        </BorderedView>
    )

}

export default VoucherClaimContainer;
const styles=StyleSheet.create({
  voucherContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between'


  }
})
