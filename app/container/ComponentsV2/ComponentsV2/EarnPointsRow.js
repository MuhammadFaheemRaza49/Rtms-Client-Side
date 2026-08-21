import React, {useContext} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Context} from '../../config/LanguageProvider';
import Images from '../../common/Images';
import TextElement from './text/Text';

/**
 * Reward points earned on a booking, shown as a coin icon followed by "N pts".
 * Renders nothing when points are 0, null or undefined, so every caller can drop
 * it in unconditionally. `style` overrides the row's spacing per screen.
 */
const EarnPointsRow = ({points, style, textColor}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  if (!(points > 0)) return null;

  return (
    <View style={[styles.row, style]}>
      <Image source={Images.cupicon} style={styles.coin} />
      <TextElement h6 medium h6Style={{color: textColor ?? colors.greyText}}>
        {points} {t('inBus:points')}
      </TextElement>
    </View>
  );
};

export default EarnPointsRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coin: {
    width: 15,
    height: 15,
    marginEnd: 6,
  },
});
