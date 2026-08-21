import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import { scale } from '../../../../../ScalingUtils';
import { Constants } from '../../../../../common';
import { Context } from '../../../../../config/LanguageProvider';
import TextElement from "../../../../ComponentsV2/text/Text";
import GlassView, {isLiquidGlassSupported} from '../../../../ComponentsV2/GlassView';
import axios from 'axios';
import { SvgXml } from 'react-native-svg';

const fetchAndModifySvg = async (uri, strokeColor = '#FFF') => {
  try {
    const response = await axios.get(uri);

    let svgText = response.data;
      svgText= svgText.replace(/stroke="[^"]*"/g, `stroke=${strokeColor}`);


// Step 3 (optional): Remove any style blocks that might override
    svgText = svgText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return svgText;
  } catch (err) {
    console.error('Error loading SVG:', err);
    return null;
  }
};

const HomeCardItemNew = ({ image, title, textColor, iconColor,onclick, style, disable = false }) => {
  const { value: { t, themeColor: { colors: theme } } } = useContext(Context);
  const [svgXmlData, setSvgXmlData] = useState(null);

  useEffect(() => {
    if (image?.uri && iconColor) {
      fetchAndModifySvg(image.uri, iconColor).then(setSvgXmlData);
    }
  }, [image?.uri, iconColor]);

  // Android / iOS < 26: the original plain card, exactly as before glass
  if (!isLiquidGlassSupported) {
    return (
        <TouchableOpacity
            style={[
              styles.itemStyle,
              styles.centerContent,
              { backgroundColor: theme.grey1Black2 },
              style,
            ]}
            onPressIn={() => onclick()}
            disabled={disable}
        >
          {svgXmlData && (
              <SvgXml xml={svgXmlData} width={24} height={24} accessibilityLabel="Dashboard icon" />
          )}

          <TextElement
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                color: textColor,
                padding: 3,
                fontSize: 12,
                textAlign: 'center',
                fontFamily: Constants.fontFamilyMedium,
                flexShrink: 1,
                minWidth: 0,
                width: '100%',
              }}
          >
            {title}
          </TextElement>

          {disable && (
              <TextElement
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    fontSize: scale(8),
                    paddingHorizontal: 8,
                    borderRadius: 5,
                    paddingVertical: 3,
                    includeFontPadding: false,
                    position: 'absolute',
                    fontFamily: Constants.fontFamilyMedium,
                  }}
              >
                {"CLOSED"}
              </TextElement>
          )}
        </TouchableOpacity>
    );
  }

  // iOS 26+: per-service backgroundColor becomes the glass tint
  const { backgroundColor, ...restStyle } = StyleSheet.flatten([
    { backgroundColor: theme.grey1Black2 },
    style,
  ]);

  return (
      <GlassView
          interactive
          tintColor={backgroundColor}
          style={[styles.itemStyle, restStyle]}
      >
      <TouchableOpacity
          style={styles.touchArea}
          onPressIn={() => onclick()}
          disabled={disable}
      >
        {svgXmlData && (
            <SvgXml xml={svgXmlData} width={24} height={24} accessibilityLabel="Dashboard icon" />
        )}

        <TextElement
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: textColor,
              padding: 3,
              fontSize: 12,
              textAlign: 'center',
              fontFamily: Constants.fontFamilyMedium,
              flexShrink: 1,
              minWidth: 0,
              width: '100%',
            }}
        >
          {title}
        </TextElement>

        {disable && (
            <TextElement
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: scale(8),
                  paddingHorizontal: 8,
                  borderRadius: 5,
                  paddingVertical: 3,
                  includeFontPadding: false,
                  position: 'absolute',
                  fontFamily: Constants.fontFamilyMedium,
                }}
            >
              {"CLOSED"}
            </TextElement>
        )}
      </TouchableOpacity>
      </GlassView>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    borderRadius: 10,

    width: '22%',
    marginBottom: 8,
    marginHorizontal: '1.5%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    // original in-card layout (Android / iOS < 26)
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeCardItemNew;
