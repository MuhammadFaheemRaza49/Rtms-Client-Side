import React, {memo, useContext, useEffect, useRef} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Constants from '../../../common/Constants';
import {scale} from '../../../ScalingUtils';
import globals from '../../../../globals';
import {Color} from '../../../common';
import appStyle from '../shared/PCBTicketing/styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ImageCarousel from 'react-native-image-carousel';
import { AntDesign as Icon } from "@react-native-vector-icons/ant-design";
import {Context} from '../../../config/LanguageProvider';
import TextElement from '../../components/text/Text';
import NoteComponent from '../shared/Umrah/Components/whatIncluded/NoteComponent';
import {getBusAndTerminalGallery} from '../../../redux/bus/operations';

function BusInfoComponent({bus}) {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  const dispatch = useDispatch();
  let imageRef = useRef();
  const [busImages, setBusImage] = React.useState([]);
  const [busImageBaseUrl, setBusImageBaseUrl] = React.useState('');
  const busGallery = useSelector(state => state.bus.busGallery);
  useEffect(() => {
    globals.FirebaseEventsNew('BusInfo');
  }, []);

  useEffect(() => {


    if (busGallery) {
      if ('bus' in busGallery && 'gallery' in busGallery.bus) {
        const busImages = busGallery.bus.gallery.filter(
          images =>
            images.service_id == bus.service_id && images.seats == bus.seats,
        );

        setBusImageBaseUrl(busGallery.bus.baseurl);
        if (busImages.length > 0) {
          setBusImage(busImages[0].images);
        }
      }
    }
  }, [busGallery]);

  function closeFullScreen(ref) {
    ref?.current?.close();
  }

  function renderHeader(ref) {
    return (
      <View style={{alignItems: 'flex-end', margin: 10}}>
        <Icon
          onPress={() => {
            closeFullScreen(ref);
          }}
          name={'close'}
          style={{padding: 10}}
          color={Color.white}
          size={20}
        />
      </View>
    );
  }

  return (
    <View>


      {bus.facilities && bus.facilities.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {bus.facilities &&
              bus.facilities.length > 0 &&
              bus.facilities.map((item, index) => {
                return (
                  <View
                    style={StyleSheet.flatten([
                      styles.facilitiesItem,
                      {backgroundColor: colors.bgInfoChip},
                    ])}>
                    <Image
                      tintColor={colors.blueIconColor}
                      style={{
                        marginEnd: 5,
                        width: scale(18),
                        height: scale(18),
                      }}
                      source={{uri: item.img}}
                    />
                    <TextElement
                      medium
                      style={{
                        color:colors.blueIconColor,
                        fontFamily: Constants.fontFamilyRegular,
                        fontSize: scale(10),
                        marginVertical: 2,
                        marginRight: 5,
                      }}>
                      {item.name}
                    </TextElement>
                  </View>
                );
              })}
          </View>
        </View>
      ) : null}
      {busImages.length > 0 ? (
        <View style={{flex: 1,marginTop:10}}>
          <TextElement
            h4
            medium
            h4Style={[

            ]}>
            {t('inBus:images')}
          </TextElement>
          <NoteComponent textStyle={{fontFamily:Constants.fontFamilyMedium}} iconSize={20} containerStyle={{alignItems:'center'}}
                         text={t("inBus:imageMightBeDifferent")}/>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
              <ImageCarousel
                zoomEnabled={true}
                ref={imageRef}
                renderContent={url => {
                  return (
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Image
                        style={{
                          aspectRatio: 1.5,
                          width: '100%',
                          height: undefined,
                        }}
                        source={{uri: busImageBaseUrl + '/' + busImages[url]}}
                        resizeMode={'cover'}
                      />
                    </View>
                  );
                }}
                renderFooter={id => {
                  return (
                    <View style={{marginVertical: 20, alignItems: 'center'}}>
                      <TextElement style={[appStyle.h1, {color: '#fff'}]}>{`${
                        id + 1
                      } / ${busImages.length}`}</TextElement>
                    </View>
                  );
                }}
                renderHeader={() => {
                  return renderHeader(imageRef);
                }}>
                {busImages.map((item, index) => {
                  if (index > 1) return null;
                  return (
                    <View key={item} style={styles.busImage}>
                      <Image
                        style={{width: '100%', height: '100%', borderRadius: 6}}
                        source={{uri: busImageBaseUrl + '/' + item}}
                      />

                      {index === 1 && busImages.length > 2 ? (
                        <View style={styles.overlay}>
                          <TextElement
                            style={[appStyle.h, {color: '#fff'}]}>{`${
                            busImages.length - 2
                          } +`}</TextElement>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </ImageCarousel>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const getImages = (array) => {
    const arr = []
    for (const item of array) {
        arr.push(item.img)
    }
    return arr
}

const styles = StyleSheet.create({

    containerStyle: {
        flex: 1
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    miniTextHeader: {
        fontSize: scale(8),
        color: 'white',
        fontFamily: Constants.fontFamilyRegular
    },
    row: {
        flexDirection: 'row'
    },
    innerRowItemStyle: {
        flex: 1,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    dot: {
        alignSelf: 'center',
        marginHorizontal: 5,
        width: scale(2),
        height: scale(2),
        borderRadius: scale(2),
        backgroundColor: '#dbdbdb'
    },
    imageCoin: {
        width: 30,
        height: scale(15),
        resizeMode: 'contain'
    },
    discountView: {
        backgroundColor: 'rgba(20, 118, 209, .1)',
        padding: 10,
        borderRadius: 5
    },
    textStyle: {
        fontSize: scale(14),
        fontFamily: Constants.fontFamilyRegular,
        color: Color.primary
    },
    centeredStyle: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'

    },
    verticalSeparator: {
        height: scale(15),
        width: 1,
        backgroundColor: '#efefef'
    },
    lightgreyTxt: {
        flex: 1,
        color: '#949494',
        marginRight: 8,
        fontWeight: '500',
        fontSize: scale(9),
        fontFamily: globals.regular
    },
    darkGreyTxt: {
        color: '#010101',
        fontWeight: '500',
        fontSize: scale(12),
        fontFamily: globals.semi_bold,
        includeFontPadding: false,
        textAlignVertical: 'top'
    },
    timeText: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: '600',
        fontFamily: Constants.fontFamilyMedium
    },
    sphereStyle: {
        borderColor: '#0C4DA8',
        borderWidth: 1,
        width: scale(10),
        height: scale(10),
        borderRadius: scale(10)
    },
    locationBtn: {
        flexDirection: 'column',
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    verticalMap: {
        flexDirection: 'column',
        flex: 0.1,
        marginLeft: 8,
        marginRight: 8,
        paddingTop: 5,
        alignItems: 'center'
    },
    locBtnStyle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    facilitiesItem: {
        marginVertical: 2.5,
        marginRight: 5,
        padding: 5,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        borderRadius: 4
    },
    busImage: {
        height: undefined,
        width: scale(70),
        aspectRatio: 1,
      marginRight: 8,
    },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    opacity: 0.7,
    backgroundColor: 'black',
    width: scale(70),
    alignSelf: 'center',

    borderRadius: 4,
  }
})

export default memo(BusInfoComponent)
