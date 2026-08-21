import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Context} from '../../../../config/LanguageProvider';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {wallet} from '../../../../navigation/NavigationPath';
import SafeAreaCustom from '../../../components/SafeAreaCustom';
import Block from '../../../components/Block';
import BusSimpleHeader from '../../components/BusSimpleHeader';
import SelectorComponent from '../../../components/SelectorComponent';
import NewInputField from '../../../ComponentsV2/input/NewInputField';
import StandardButton from '../AuthContainer/Component/StandardButton';
import BottomSheet from '../../../BottomSheet/NewGorhomBS';
import BankListModal from './components/BankList';
import ButtonComponent from '../../../ComponentsV2/button/ButtonComponent';

import {scale} from '../../../../ScalingUtils';
import TextElement from '../../../ComponentsV2/text/Text';
import PriceTextElement from '../../../ComponentsV2/text/PriceTextElement';
import homeStyle from '../HomeContainer/homeStyle';
import {Color} from '../../../../common';
import Images from '../../../../common/Images';
import SelectedPaymentMethod from '../../../PostPayment/PostPaymentV2/components/SelectedPaymentMethod';
import GlobeHeader from './components/GlobeHeader';
import NewPriceComponent from '../../../ComponentsV2/text/NewPriceComponent';
import {updateUser} from '../../../../redux/user/operations';
import ClipCircle from './components/ClipCircle'
import BorderedView from "../Railways/components/BorderedView";

const ConfirmationScreen = props => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user.userInfo);
  const api_token = useSelector(state => state.user.userInfo?.user?.api_token);
  const data = props?.data;
  const inquiry = props?.inquiry;
  const {selectedMethod = {}, order = {}, type, isShowBooking,} =data  || {};

  const [leaderObject, setLeaderBoard] = useState({
    currentRank: 1,
    pointsEarned: 1,
  });
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [tier, setTier] = useState(null);
  const {order_ref_id} = order;

  useEffect(() => {
    // getLeaderBoardData();
    console.log('datac', data )
    dispatch(updateUser(userInfo))
  }, []);


  const goToWallet = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: wallet.main_stack,
            state: {
              routes: [
                { name: wallet.main }
              ]
            }
          }
        ]
      }))
  }

  return (
    <GlobeHeader
      title={t('wallet:confirmation')}
      onBack={() => {
        navigation.pop();
      }}
      navigation={navigation}>
      <View style={{flex: 1}}>
        <View style={{flex: 1, marginTop: 12}}>
          <Block isForground={true} style={styles.mainContent}>
            <View
              style={[
                styles.successView,
                {backgroundColor: Color.greenHighlighter},
              ]}>
              <View style={[styles.rowCenter, {marginBottom: 8}]}>
                <Image
                  source={Images.post_payment.payment_success}
                  style={{width: 20, height: 20}}
                  resizeMode={'contain'}
                />
                <TextElement h4 medium h4Style={{marginStart: 6, color: Color.darkBlueText}}>
                {inquiry?.Title??t('postPayment:paymentReceived')}
                </TextElement>
              </View>
              <TextElement
                h6
                medium
                h6Style={{color: Color.darkBlueText, marginTop: 4}}>
                {inquiry?.Message??t('wallet:weReceived')}

              </TextElement>
            </View>
            <View style={{marginHorizontal: 12, marginVertical: 16}}>
              <View style={{alignItems: 'center', marginVertical: 16}}>
                <NewPriceComponent h1 bold value={order?.billable_price} />
                <TextElement h6 medium>
                  {t('wallet:amountPaid')}
                </TextElement>
              </View>
              <TextElement h4 medium h4Style={{paddingBottom: 8}}>
                {t('postPayment:paymentMethod')}
              </TextElement>
              <SelectedPaymentMethod item={selectedMethod} colors={colors} />
            </View>
            <ClipCircle size={25} lineShow={false} />

          </Block>
          <BorderedView
            style={[
              homeStyle.rowSpaceBetween,
              styles.amountDetail,
            ]}>
            <View style={{flexShrink: 1, marginEnd: 12}}>
              <TextElement h6 h6Style={{color: colors.greyText, marginBottom: 2}}>
                {t('wallet:yourTotalBalance')}
              </TextElement>
              <NewPriceComponent h2 bold value={userInfo?.user?.wcredits} />
              <TextElement h6 h6Style={{color: colors.greyText, marginTop: 2}}>
                {t('wallet:useYourBalance')}
              </TextElement>
            </View>
            <View style={[styles.walletImgWrapper, {backgroundColor: colors.bgSecondaryColor}]} >
              <Image source={Images.bookmeWallet} style={styles.walletImg} />
            </View>
          </BorderedView>



          {/*<View style={[homeStyle.rowHorizantalCenter, styles.leaderboard]}>*/}
          {/*  <View style={{flex: 1, marginEnd: 10}}>*/}
          {/*    <TextElement h4 bold h4Style={{color: Color.darkBlueText}}>*/}
          {/*      {t('postPayment:pointsEarned', {points: earnedPoints ?? 400})}*/}
          {/*    </TextElement>*/}
          {/*    <TextElement>*/}
          {/*      <TextElement h6 medium h6Style={{color: Color.greyText}}>*/}
          {/*        {t('postPayment:leaderboardMessageFirst')}*/}
          {/*      </TextElement>*/}
          {/*      <TextElement h4 bold h4Style={{color: '#D97706'}}>*/}
          {/*        {` #${leaderObject?.currentRank} `}*/}
          {/*      </TextElement>*/}
          {/*      <TextElement h6 medium h6Style={{color: Color.greyText}}>*/}
          {/*        {t('postPayment:leaderboardMessageLater')}*/}
          {/*      </TextElement>*/}
          {/*    </TextElement>*/}
          {/*  </View>*/}
          {/*  <Image*/}
          {/*    source={Images.post_payment.partyCoin}*/}
          {/*    style={styles.image}*/}
          {/*  />*/}
          {/*</View>*/}
        </View>
        <Block
          isForground
          style={{
            padding: 12,
            borderTopWidth: 1,
            borderColor: colors.borderColor,
          }}>
          <ButtonComponent
            title={t('wallet:goToWallet')}
            onPress={goToWallet}
          />
        </Block>
      </View>
    </GlobeHeader>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    borderRadius: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  successView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboard: {
    backgroundColor: '#FDF1D9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 12,
  },
  image: {
    width: 100,
    height: undefined,
    aspectRatio: 1.4,
  },
  amountDetail: {
    margin: 12,
    paddingHorizontal: 12
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: 'white',
  },
  rowItem: {
    alignItems: 'center',
    flex: 1,
  },
  walletImgWrapper: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  walletImg: {
    width: 39,
    height: 36,
  }
});

export default ConfirmationScreen;
