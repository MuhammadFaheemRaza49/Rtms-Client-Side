import React, {useContext, useEffect, useState} from 'react';
import {FlatList, I18nManager, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {MaterialCommunityIcons as Ionicons} from '@react-native-vector-icons/material-design-icons';
import {useNavigation} from '@react-navigation/native';
import globals from '../../../../../../globals';
import TextElement from '../../../../components/text/Text';
import {Context} from '../../../../../config/LanguageProvider';
import Constants from '../../../../../common/Constants';
import {scale} from '../../../../../ScalingUtils';
import {Color} from '../../../../../common';
import Block from '../../../../components/Block';
import {platform} from '../../../../components/ReCaptcha/src/constants';

const BankListModal = ({isVisible, onClose, onPress, bankList}) => {
  const [query, setQuery] = useState('');
  const [countries, setCountry] = useState(bankList);
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  const navigation = useNavigation();
  useEffect(() => {
    findLocation(query);
  }, [query]);

  const findLocation = e => {
    let text = e?.toLowerCase();
    let filteredName = bankList?.filter(item => {
      return item?.name?.toLowerCase()?.match(text);
    });
    if (!text || text === '') {
      setCountry(bankList);
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
    } else if (Array.isArray(filteredName)) {
      setCountry(filteredName);
    }
  };

  return (
    <Block isForground style={{flex: 1}}>
      <Animatable.View animation={'fadeInUp'} style={{height: '100%', flex: 1}}>
        <Block isForground style={{paddingHorizontal: 10}}>
          <TextElement style={styles.favTitle}>{t("wallet:searchBank")}</TextElement>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.bgSecondaryColor,
                borderColor: colors.blueIconColor,
              },
            ]}>
            <Ionicons
              size={20}
              color={colors.blueIconColor}
              style={{marginHorizontal: 10}}
              name={'magnify'}
            />
            <TextInput
              placeholderTextColor={colors.greyText}
              placeholder={t('hotel:search')}
              style={[
                styles.input,
                {
                  color: colors.headingText,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                },
              ]}
              onChangeText={text => {
                setQuery(text);
              }}
              value={query}
            />
            <TouchableOpacity
              onPress={() => {
                setQuery('');
              }}>
              <Ionicons
                name="close"
                size={18}
                color={colors.samegrey}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
        </Block>
        <Block isForground style={{flex: 1,marginTop: 10}}>
          <FlatList
            style={{flex: 1}}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode="none"
            data={countries}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  onPress(item);
                }}>
                <TextElement
                  style={[styles.countryName, {borderColor: colors.darkgrey}]}>
                  {item.name}
                </TextElement>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.code}
          />
        </Block>
      </Animatable.View>
    </Block>
  );
};

const styles = StyleSheet.create({
  countryName: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    includeFontPadding: false,
    fontFamily: globals.medium,
    fontSize: scale(12),
  },
  input: {
    flex: 1,
    fontFamily: Constants.fontFamilyRegular,
    fontSize: scale(12),
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  favTitle: {
    paddingTop: 10,
    fontFamily: Constants.fontFamilyBold,
    includeFontPadding: false,
    fontSize: scale(16),
    marginEnd: 5,
  },
});
export default BankListModal;
