import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {FlatList, I18nManager, Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Color from '../../../../../common/Color';
import Constants from '../../../../../common/Constants';
import Images from '../../../../../common/Images';
import TextElement from '../text/Text';
import {Context} from '../../../config/LanguageProvider';
import {scale} from '../../../ScalingUtils';
import SafeAreaCustom from '../../components/SafeAreaCustom';
import {margin, padding} from '../../components/config/spacing';
import {MIN_HEIGHT} from '../../components/ViewLabel';
import Block from '../../components/Block';
import SearchCityField2 from "../../SearchRestaurant/shared/HotelRevamp/components/SearchCityField2";

const BOTTOM = margin.base - 6;

export default function InputMobileNewField({
                                                reff,
                                                label,
                                                error,
                                                style,
                                                value,
                                                textStyle,
                                                flagStyle,
                                                textProps,
                                                disabled=false,
                                                onChangePhoneNumber,
                                                primaryColor,
                                                ...rest
                                            }) {
    const {
        value: {
            t,
            themeColor: {colors},
        },
    } = useContext(Context);
    const [isModalCountry, setIsModalCountry] = useState(false);
    const [pickerData, setPickerData] = useState([]);
    const [search, setSearch] = useState('');
    const [placeholder, setPlaceholder] = useState('');

    const phoneRef = useRef(null);

    const dataCountry = pickerData.filter(
        country => country.label.toLowerCase().indexOf(search.toLowerCase()) >= 0,
    );

    useEffect(() => {
        const rawList = phoneRef.current?.getPickerData();
        if (!rawList) return;

        const list = rawList.filter(
            country =>
                Constants.kickOffCountry.filter(code => country.iso2 !== code).length > 3,
        );
        setPickerData(list);
        setPlaceholder(phoneRef.current?.getDialCode());
    }, []);

    const changeCountry = country => {
        phoneRef.current?.selectCountry(country.iso2);
        changePhone(value);
        setIsModalCountry(false);
        setPlaceholder(country.dialCode);
    };

    useEffect(() => {
        phoneRef.current?.setValue(value !== '' ? value : '+92');
    }, [value]);


    const changePhone = useCallback((val) => {


        if (onChangePhoneNumber) {
            onChangePhoneNumber({
                value: val,
                code: phoneRef.current?.getISOCode() ?? '+92',
            });
        }
    }, [onChangePhoneNumber]);

    const onPressFlag = () => {
        setIsModalCountry(!isModalCountry);
    };

    const updateSearch = search => {
        setSearch(search);
    };

    return (
        <View>
            <View>
                <TextElement
                    h5
                    medium
                    h5Style={{
                        marginBottom: BOTTOM - 3,
                    }}>
                    {label}
                </TextElement>
                <View
                    style={[
                        styles.viewInput,
                        {
                            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                            direction: 'ltr',
                            borderColor: error ? Color.red : colors.borderColor2,
                        },
                    ]}>
                    <PhoneInput
                        disabled={disabled}
                        initialValue={value}
                        style={StyleSheet.flatten([styles.input, style && style])}
                        textStyle={{
                            fontSize: scale(12),
                            color: colors.white,
                            fontFamily: Constants.fontFamilyRegular,
                            textAlign: 'left',
                        }}
                        flagStyle={StyleSheet.flatten([
                            styles.flag,
                            flagStyle && flagStyle,
                        ])}
                        {...rest}
                        textProps={{
                            placeholder: placeholder,
                            placeholderTextColor: Color.lightgrey,
                            ...textProps,
                        }}
                        onChangePhoneNumber={changePhone}
                        ref={ref => {
                            // ✅ Fix 8: Assign to phoneRef.current, not a plain variable
                            phoneRef.current = ref;
                            reff(ref);
                        }}
                        onPressFlag={onPressFlag}
                    />
                    {error && (
                        <Image
                            resizeMode={'contain'}
                            style={[styles.image, {marginEnd: margin.large}]}
                            source={Images.input.alert}
                        />
                    )}
                </View>
                {typeof error === 'string' ? (
                    <TextElement
                        h7
                        h7Style={[
                            styles.textError,
                            {
                                color: Color.red,
                            },
                        ]}>
                        {error}
                    </TextElement>
                ) : null}
            </View>
            {isModalCountry ? (
                <Modal
                    visible={isModalCountry}
                    setModalVisible={() => setIsModalCountry(false)}
                    ratioHeight={0.7}>
                    <SafeAreaCustom>
                        <Block isForground={true} style={{flex: 1}}>
                            <SearchPlaceHolder
                                primaryColor={primaryColor}
                                colors={colors}
                                onClear={() => {
                                    setSearch('');
                                }}
                                query={search}
                                onBack={() => {
                                    setSearch('');
                                    setIsModalCountry(false);
                                }}
                                value={search}
                                onChangeText={updateSearch}
                                title={t('auth:search')}
                                placeholder={t('auth:searchCountry')}
                            />
                            {dataCountry && dataCountry.length > 0 ? (
                                <FlatList
                                    data={dataCountry}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            onPress={() => changeCountry(item)}
                                            style={{
                                                flexDirection: 'row',
                                                minHeight: 52,
                                                alignItems: 'center',
                                                paddingVertical: 8,
                                                borderTopColor: colors.lightgrey,
                                                borderTopWidth: StyleSheet.hairlineWidth,
                                                paddingHorizontal: padding.large,
                                            }}>
                                            <Image
                                                source={item.image}
                                                resizeMode="stretch"
                                                style={styles.flag}
                                            />
                                            <TextElement
                                                h5
                                                h5Style={{
                                                    fontFamily: Constants.fontFamilyRegular,
                                                    marginLeft: 20,
                                                }}>{`(${item.dialCode})${item.label}`}</TextElement>
                                        </TouchableOpacity>
                                    )}
                                    initialNumToRender={15}
                                    keyExtractor={item => item.key.toString()}
                                />
                            ) : null}
                        </Block>
                    </SafeAreaCustom>
                </Modal>
            ) : null}
        </View>
    );
}

const SearchPlaceHolder = ({
                               onBack,
                               placeholder,
                               query,
                               onChangeText,
                               onClear,
                               colors,
                               primaryColor,
                           }) => {
    return (
        <View style={[styles.wrapper, {backgroundColor: primaryColor ?? colors.primary}]}>
            <SearchCityField2
                value={query}
                onChange={onChangeText}
                onClear={query !== '' ? onClear : null}
                placeholder={placeholder}
                isFrom={true}
                isSecond={false}
                onBack={onBack}
                autoFocus
            />
        </View>
    );
};


let styles = StyleSheet.create({
    input: {
        flex: 1,
        flexDirection: 'row',
        height: MIN_HEIGHT,
        paddingHorizontal: padding.large,
    },
    wrapper: {
        paddingBottom: 10,
        paddingHorizontal: 14,
    },
    flag: {
        width: 20,
        height: 15,
        borderWidth: 0,
        resizeMode:'cover',

    },
    item: {
        paddingHorizontal: padding.large,
    },
    search: {
        paddingVertical: 10,
        paddingBottom: padding.small,
        paddingHorizontal: 20,
    },
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
    },
    textError: {
        fontSize: 10,
        marginBottom: BOTTOM,
    },
    image: {
        marginStart: margin.large,
        width: scale(16),
        height: scale(16),
    },
});
