import React, {memo, useContext, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Constants from '../../../common/Constants';
import {scale} from '../../../ScalingUtils';
import globals from '../../../../globals';
import {Color, Images} from '../../../common';
import TextElement from '../../components/text/Text';
import {Context} from '../../../config/LanguageProvider';

function AboutTransporter({reviews}) {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  const [isPolicyExpended, setIsPolicyExpended] = useState(false);
  const [isModifyExpended, setIsModifyExpended] = useState(false);


  return (
    <View>


      <View style={{}}>
        {reviews?.figures?.departure!==undefined&&reviews?.figures?.departure!==null? (
          <ReviewCard
            title={t('inBus:lateDeparture')}
            icon={Images.bus.lateDepartures}
            data={reviews?.figures?.departure + ' %'}
          />
        ) : null}
        {reviews?.figures?.staff ? (
          <ReviewCard
            title={t('inBus:staffRating')}
            icon={Images.bus.staff}
            data={reviews?.figures?.staff}
          />
        ) : null}
        {reviews?.figures?.recommended ? (
          <ReviewCard
            title={t('inBus:recommendation')}
            icon={Images.bus.recommended}
            data={reviews?.figures?.recommended + ' %'}
          />
        ) : null}
      </View>



      {/*{feedBack?.length>0?*/}
      {/*<View>*/}
      {/*    <View style={{*/}
      {/*      flexDirection: 'row',*/}
      {/*      marginVertical: 10,*/}
      {/*      justifyContent: 'space-between',*/}
      {/*      alignItems: 'center'*/}
      {/*    }}>*/}
      {/*        <View style={{*/}
      {/*          flexDirection: 'row'*/}
      {/*        }}>*/}
      {/*            <TextElement style={[appStyle.h1, {*/}
      {/*              fontFamily: Constants.fontFamilyBold*/}
      {/*            }]}>{t('inBus:review')}</TextElement>*/}
      {/*            <TextElement style={[appStyle.h1, {*/}
      {/*              color: '#dbdbdb',*/}
      {/*              fontFamily: Constants.fontFamilyMedium,*/}
      {/*              marginLeft: 5*/}
      {/*            }]}>{`(${feedBack.length})`}</TextElement>*/}
      {/*        </View>*/}
      {/*        {feedBack?.length>0&&*/}
      {/*        <TouchableOpacity onPress={()=>navigation.navigate("AllReviews",{*/}
      {/*            review:reviews,*/}
      {/*        })}>*/}
      {/*            <TextElement style={[appStyle.black10, {*/}
      {/*              marginRight: 5,*/}
      {/*              color: '#0C4DA8'*/}
      {/*            }]}>{t('inBus:viewAll')}</TextElement>*/}
      {/*        </TouchableOpacity>}*/}
      {/*    </View>*/}
      {/*    {feedBack&&feedBack.length>0?*/}
      {/*    (feedBack.slice(0,2).map((item) => {*/}
      {/*      return (*/}
      {/*            <ReviewItem item={item}/>*/}
      {/*      )*/}
      {/*    })):(*/}
      {/*        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>*/}
      {/*            <TextElement h4 h4Style={{fontSize:scale(10)}}>*/}
      {/*                No reviews yet*/}
      {/*            </TextElement>*/}
      {/*        </View>*/}
      {/*        )*/}

      {/*    }*/}
      {/*</View>:null}*/}
    </View>
  );
}

function ReviewCard({title, icon, data}) {
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);
  return (
    <View
      style={{
        flex: 1,
        marginBottom: 5,
        backgroundColor: colors.bgSecondaryColor,
        padding: 10,
        borderRadius: 5,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={icon}
            style={{
              width: 15,
              height: 15,
              marginRight: 5,
              tintColor: colors.blueIconColor,
            }}
          />
          <TextElement h6 medium h6Style={[]}>
            {title}
          </TextElement>
        </View>
        <TextElement h6 medium h6Style={[{color: colors.blueIconColor}]}>
          {data}
        </TextElement>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniTextHeader: {
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
  },
  innerRowItemStyle: {
    flex: 1,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dot: {
    alignSelf: 'center',
    marginHorizontal: 5,
    width: scale(2),
    height: scale(2),
    borderRadius: scale(2),
    backgroundColor: '#dbdbdb',
  },
  imageCoin: {
    width: 30,
    height: scale(15),
    resizeMode: 'contain',
  },
  discountView: {
    backgroundColor: 'rgba(20, 118, 209, .1)',
    padding: 10,
    borderRadius: 5,
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Constants.fontFamilyRegular,
    color: Color.primary,
  },
  centeredStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  verticalSeparator: {
    height: 16,
    width: 1,
    backgroundColor: '#efefef',
  },
  lightgreyTxt: {
    flex: 1,
    color: '#949494',
    marginRight: 8,
    fontWeight: '500',
    fontSize: scale(9),
    fontFamily: globals.regular,
  },
  darkGreyTxt: {
    color: '#010101',
    fontWeight: '500',
    fontSize: scale(12),
    fontFamily: globals.semi_bold,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  timeText: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: '600',
    fontFamily: Constants.fontFamilyMedium,
  },
  sphereStyle: {
    borderColor: '#0C4DA8',
    borderWidth: 1,
    width: scale(10),
    height: scale(10),
    borderRadius: scale(10),
  },
  locationBtn: {
    flexDirection: 'column',
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  verticalMap: {
    flexDirection: 'column',
    flex: 0.1,
    marginLeft: 8,
    marginRight: 8,
    paddingTop: 5,
    alignItems: 'center',
  },
  locBtnStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilitiesItem: {
    marginVertical: 2.5,
    marginRight: 5,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 4,
  },
  busImage: {
    height: undefined,
    width: scale(70),
    aspectRatio: 1,
  },
});

export default memo(AboutTransporter);
