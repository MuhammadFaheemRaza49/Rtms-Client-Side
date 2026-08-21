import React, {useContext, useState} from 'react'
import {StyleSheet} from 'react-native'
import {scale} from '../../../../../ScalingUtils'
import Constants from '../../../../../common/Constants'
import {Context} from '../../../../../config/LanguageProvider'
import Block from '../../../../components/Block'
import TextElement from '../../../../components/text/Text'
import ButtonComponent from "../../../../ComponentsV2/button/ButtonComponent";
import BottomSheetInputField from "../../../../ComponentsV2/input/BottomSheetInputField";

const CreateFavComponent = ({ isFetching, onCreate }) => {
  const { value: { t, themeColor: { colors } } } = useContext(Context)
  const [nickName, onChangeNickName] = useState('')
  const [nickNameError, onChangeNickNameError] = useState(undefined)
  return (
    <Block isForground={true} style={styles.favContainer}>
      <TextElement
        h4
        medium
        h4Style={[styles.favTitle, {color: colors.headingText}]}>
        {t('inBus:updateFav')}
      </TextElement>
      <BottomSheetInputField
        label={t('inBus:nickname')}
        value={nickName}
        onChangeText={value => {
          onChangeNickName(value);
          onChangeNickNameError(undefined);
        }}
        error={nickNameError}
        placeholderTextColor={colors.greyText}
      />
      <ButtonComponent
        onPress={() => {
          if (nickName.trim().toString() === '') {
            onChangeNickNameError('Type Nickname');
          } else {
            onCreate(nickName);
          }
        }}
        isLoading={isFetching}
        disable={isFetching}
        style={{marginVertical: 10}}
        title={t('inBus:create')}
      />
    </Block>
  );
}

export default CreateFavComponent
const styles = StyleSheet.create({
  favTitle: {
    fontFamily: Constants.fontFamilyBold,
    includeFontPadding: false,
    marginBottom:10
  },
  favDesc: {
    color: '#bab6b8',
    fontFamily: Constants.fontFamilyRegular,
    includeFontPadding: false,
    fontSize: scale(12)
  },
  favContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#ffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  handler: {
    width: '25%',
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 15,
    backgroundColor: '#dbdbdb'
  }
})
