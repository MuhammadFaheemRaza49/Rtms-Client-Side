import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TextElement from '../../../../ComponentsV2/text/Text';
import PopUpAnimatedView from '../../../../ComponentsV2/PopUpAnimatedView';
import ButtonComponent from '../../../../ComponentsV2/button/ButtonComponent';
import { Color, Images, Constants } from '../../../../../common';
import { Context } from '../../../../../config/LanguageProvider';

const GIF_SHOW_DELAY = 500;
const GIF_DISPLAY_DURATION = 2500;

const CongratulationsDialog = ({
                                 heading = '',
                                 isVisible,
                                 setVisible,
                                 title,
                                 content,
                                 reward,
                                 rewardContainerStyle,
                                 buttonTitle = 'Got it',
                                 onClick = null,
                               }) => {
  const {
    value: {
      t,
      themeColor: { colors },
    },
  } = useContext(Context);

  const [gifVisible, setGifVisible] = useState(false);

  // Handle GIF visibility with proper cleanup
  useEffect(() => {
    if (!isVisible) {
      setGifVisible(false);
      return;
    }

    const showTimeout = setTimeout(() => {
      setGifVisible(true);
    }, GIF_SHOW_DELAY);

    const hideTimeout = setTimeout(() => {
      setGifVisible(false);
    }, GIF_SHOW_DELAY + GIF_DISPLAY_DURATION);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isVisible]);

  // Memoize gradient colors
  const gradientColors = useMemo(
    () => [Color.blueBackground, colors.blueSelection],
    [colors.blueSelection]
  );

  const gradientPoints = useMemo(
    () => ({ start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }),
    []
  );

  // Memoize close handler
  const handleClose = () => {
    setVisible(false);
  }

  // Memoize dynamic styles
  const commentBoxStyle = useMemo(
    () => [
      styles.commentBox,
      { backgroundColor: colors.bgSecondaryColor },
      rewardContainerStyle,
    ],
    [colors.bgSecondaryColor, rewardContainerStyle]
  );

  const buttonStyle = useMemo(
    () => ({
      width: '100%',
      marginTop: 16, backgroundColor: colors.blueLightWhiteDark }),
    [colors.blueLightWhiteDark]
  );

  const buttonTextStyle = useMemo(
    () => ({ color: colors.primaryWhiteBtn }),
    [colors.primaryWhiteBtn]
  );


  const titleStyle = useMemo(
    () => ({ marginTop: 4, textAlign: 'center', color: colors.greyText }),
    [colors.greyText]
  );

  const contentStyle = useMemo(
    () => ({ marginTop: 24, textAlign: 'center', color: colors.greyText }),
    [colors.greyText]
  );
  const handleButtonPress = () => {
    if (onClick) {
      onClick();
    } else {
      setVisible(false);
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={handleClose}
      animationType="none">
      {gifVisible && (
        <ImageBackground source={Images.games.winGif} style={styles.gifOverlay} />
      )}
      <TouchableWithoutFeedback onPress={handleClose}>

        <PopUpAnimatedView containerStyle={styles.flex} isVisible={isVisible}>
          <View pointerEvents="box-none" style={styles.container}>
            <View>
              <View
                  style={[
                    styles.gradient,
                    {
                      experimental_backgroundImage: `linear-gradient(-135deg, ${gradientColors.join(', ')})`,
                    },
                  ]}>

                <View style={{padding:14,  alignItems: 'center'}}>
                <Image
                    source={Images.tier.confetti}
                    style={styles.image}
                    resizeMode="contain"
                />
                <TextElement h3 bold h3Style={styles.heading}>
                  {heading || t('tier:congratulations')}
                </TextElement>

                {title && (
                    <TextElement h5 h5Style={titleStyle}>
                      {title}
                    </TextElement>
                )}

                {reward && (
                    <View style={commentBoxStyle}>{reward}</View>
                )}

                {content && (
                    <TextElement h5 h5Style={contentStyle}>
                      {content}
                    </TextElement>
                )}

                <ButtonComponent
                    style={buttonStyle}
                    textStyle={buttonTextStyle}
                    title={buttonTitle || t('games:gotIt')}
                    onPress={handleButtonPress}
                />
                </View>
              </View>
            </View>
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
  gradient: {
    borderRadius: 8,

    margin: 12,
    minWidth: '90%',
  },
  image: {
    height:undefined,
    width: '70%',
    aspectRatio:1
  },
  heading: {
    marginTop: 16,
  },
  commentBox: {
    padding: 12,
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    marginTop: 24,
  },
  buttonMain: {
    marginTop: 16,
  },
  gifOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBenefit: {
    justifyContent: 'center',
    marginEnd: 8,
    borderRadius: 8,
    padding: 6,
    overflow: 'hidden',
  },
  iconBackground: {
    zIndex: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white20,
    borderRadius: 4,
    padding: 5,
    marginBottom: 8,
  },
});

export default React.memo(CongratulationsDialog);
