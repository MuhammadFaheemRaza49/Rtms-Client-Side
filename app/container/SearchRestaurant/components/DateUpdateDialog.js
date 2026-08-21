import React, { useContext } from 'react';
import { Image, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import TextElement from '../../ComponentsV2/ComponentsV2/text/Text';
import PopUpAnimatedView from '../../ComponentsV2/ComponentsV2/PopUpAnimatedView';
import { Context } from '../../../config/LanguageProvider';
import Block from '../../components/Block';
import ButtonComponent from '../../ComponentsV2/ComponentsV2/button/ButtonComponent';
import { Tools } from "../../../common";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";


const DateUpdateDialog = ({ title = undefined, description = undefined, iconSource = null, isVisible, setVisible, originalDate, foundDate }) => {
  const {
    value: {
      t,
      themeColor: { colors },
    },
  } = useContext(Context);

  // Memoize close handler
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={handleClose}
      animationType="none">
      <TouchableWithoutFeedback onPress={handleClose}>
        <PopUpAnimatedView containerStyle={styles.flex} isVisible={isVisible}>
          <View pointerEvents="box-none" style={styles.container}>
            <Block style={styles.item} isForground={true}>
              <View style={styles.infoContainer}>
                {iconSource ?
                  <Image style={styles.image} source={iconSource} /> : null}
                <TextElement
                  h3
                  medium
                  h3Style={{ marginVertical: 5, color: colors.headingText }}>
                  {title ?? t('inBus:noResultFoundDialogHeading', { date: Tools.getFormattedDate(foundDate, 'YYYY-MM-DD', 'DD MMMM YYYY') })}
                </TextElement>
                <TextElement
                  h5
                  light
                  h5Style={{ textAlign: 'center', color: colors.greyText }}>
                  {description ?? t('inBus:noBusSearchResultWithDateDescription', { date: Tools.getFormattedDate(originalDate, 'YYYY-MM-DD', 'DD MMMM YYYY') })}
                </TextElement>
              </View>

              <ButtonComponent
                style={{ marginVertical: 10 }}
                title={t('tier:gotIt')}
                onPress={handleClose}
              />
            </Block>
          </View>
        </PopUpAnimatedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  item: {
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  image: {
    marginTop: 10,
    height: hp('10%'), aspectRatio: 1, resizeMode: 'contain'
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoContainer: {
    alignItems: 'center',
  },
});

export default React.memo(DateUpdateDialog);
