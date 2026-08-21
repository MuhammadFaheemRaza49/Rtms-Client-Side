import React, {useContext} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {Color} from '../../../../../common';
import Block from '../../../../components/Block';
import TextElement from '../../../../components/text/Text';
import ButtonComponent from '../../../../ComponentsV2/button/ButtonComponent';
import appStyle from '../../PCBTicketing/styles';
import {Context} from '../../../../../config/LanguageProvider';

const PermissionSheetComponent = ({
  image,
  title,
  description,
  onPressAllow,
  onPressDeny,
}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  return (
    <Block isForground={true} style={styles.sheet}>
      <View style={styles.container}>
        <Image style={styles.image} source={image} />
        <View style={styles.copy}>
          <TextElement h2 medium h2Style={styles.heading}>
            {title}
          </TextElement>
          <TextElement h4 light h4Style={styles.description}>
            {description}
          </TextElement>
        </View>
      </View>
      <View style={[appStyle.rowAlign, styles.buttons]}>
        <View style={styles.leftButton}>
          <ButtonComponent
            textStyle={{color: colors.blueIconColor}}
            onPress={onPressDeny}
            title={t('permissions:doNotAllow')}
            style={[
              styles.secondaryButton,
              {borderColor: colors.blueIconColor},
            ]}
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
  },
});

export default PermissionSheetComponent;
