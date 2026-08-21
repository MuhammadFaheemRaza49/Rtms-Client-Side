import React, {useContext} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Navigation} from 'lucide-react-native';

import {Color, Images} from '../../../../../common';
import Block from '../../../../components/Block';
import TextElement from '../../../../components/text/Text';
import ButtonComponent from '../../../../ComponentsV2/button/ButtonComponent';
import appStyle from '../../PCBTicketing/styles';
import {Context} from '../../../../../config/LanguageProvider';
import homeStyle from '../homeStyle';

const LocationPermissionRow = ({colors, t}) => (
  <View style={styles.permissionRow(colors)}>
    <View style={styles.rowLeading}>
      <View style={styles.iconBox}>
        <Navigation fill={Color.white} size={20} color={Color.white} />
      </View>
      <TextElement medium h4 h4Style={styles.rowTitle}>
        {t('hotel:location')}
      </TextElement>
    </View>
    <TextElement h4 light h4Style={styles.rowText}>
      {t('permissions:whileUsingApp')}
    </TextElement>
  </View>
);

const LocationSheetComponent = ({onPressAllow, onPressDeny}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  return (
    <Block isForground={true} style={styles.sheet}>
      <View style={styles.container}>
        <Image style={styles.image} source={Images.permission.location} />
        <View style={styles.copy}>
          <View style={homeStyle.rowHorizantalCenter}>
            <TextElement h2 medium h2Style={styles.heading}>
              {t('permissions:allowLocation')}
            </TextElement>
          </View>
          <View style={homeStyle.rowHorizantalCenter}>
            <TextElement h4 light h4Style={styles.description}>
              {t('permissions:allowLocationAccessDesc')}
            </TextElement>
          </View>
        </View>
        <View style={styles.copy}>
          <TextElement h4 light h4Style={styles.description}>
            {t('permissions:settingOpenDesc')}
          </TextElement>
        </View>
        <LocationPermissionRow colors={colors} t={t} />
      </View>
      <View style={[appStyle.rowAlign, styles.buttons]}>
        <View style={styles.leftButton}>
          <ButtonComponent
            textStyle={{color: Color.primary}}
            onPress={onPressDeny}
            title={t('permissions:doNotAllow')}
            style={styles.secondaryButton}
          />
        </View>
        <View style={styles.rightButton}>
          <ButtonComponent
            style={styles.primaryButton}
            title={t('permissions:allow')}
            onPress={onPressAllow}
          />
        </View>
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  sheet: {
    padding: 14,
  },
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  copy: {
    marginTop: 10,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  heading: {
    textAlign: 'center',
  },
  description: {
    color: Color.greyText,
    textAlign: 'center',
  },
  image: {
    height: undefined,
    aspectRatio: 1.5,
    resizeMode: 'contain',
    width: '100%',
  },
  permissionRow: colors => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.borderColor2,
    borderRadius: 12,
    backgroundColor: colors.bgColorWhite,
    marginVertical: 10,
  }),
  rowLeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    borderRadius: 5,
    backgroundColor: '#1e4dff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  rowTitle: {
    marginLeft: 10,
  },
  rowText: {
    color: Color.greyText,
  },
  buttons: {
    marginVertical: 14,
  },
  leftButton: {
    flex: 1,
    marginEnd: 5,
  },
  rightButton: {
    flex: 1,
    marginStart: 5,
  },
  primaryButton: {
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    paddingVertical: 14,
    marginTop: 10,
    borderColor: Color.primary,
  },
});

export default LocationSheetComponent;
