import React, {useContext, useEffect, useState} from 'react'
import {Keyboard, StyleSheet, View} from 'react-native'
import VoucherMainItem from "../../Voucher&discount/component/VoucherItem";
import {scale} from '../../../../../ScalingUtils'
import InputVerify from '../../../../components/input/InputVerify'
import Constants from '../../../../../common/Constants'
import {useDispatch, useSelector} from "react-redux";
import {Context} from "../../../../../config/LanguageProvider";
import Block from "../../../../components/Block";
import TextElement from "../../../../components/text/Text";
import VoucherItem from "../../../components/VoucherItem";
import VoucherItemBundle from '../../BusBundles/components/VoucherItem';
import {Color} from "../../../../../common";
import BorderedView from '../../Railways/components/BorderedView';
import globals from '../../../../../../globals';
import {getDiscountsAndCampaigns, redeemVoucher} from '../../../../../redux/home/operations';
import Loading from '../../../../components/Loading';
import {Fade, Placeholder, PlaceholderLine} from '@cniot/rn-placeholder';

// Generic voucher sheet used by every vertical. The component owns the
// vouchers/list fetch (shimmer while loading) and the redeem call; the parent
// only supplies the request payloads and receives the applied voucher back
// through onApplied to drive its own discount display/calculations.
export default function VoucherComponent({
                                             // {type, booking, ...extras} — merged into the vouchers/list
                                             // request. When omitted no list is fetched (promo-code only).
                                             listParams,
                                             // object or () => object: {type, booking, final_amount, ...}
                                             // merged into the redeem request. Enables internal claiming.
                                             redeemParams,
                                             // (data, item) => void — redeem succeeded; parent stores the
                                             // voucher (name/discount/uuid) and closes the sheet.
                                             onApplied,
                                             // Legacy fallbacks for parents that claim through their own
                                             // endpoint (e.g. cricket/psl promo claim) instead of redeemParams.
                                             applyPromoCode,
                                             setVoucher,
                                             isPromoCreditEnable,
                                             isUmrah = false,
                                             setIsEnableGameCredit,
                                             analyticsEventData,
                                             // Optional bus-bundle upsell item
                                             bundle,
                                             isBundleEnable,
                                             setBundleEnable,

                                         }) {
    const {value: {t, language, themeColor: {colors, key: themeKey}}} = useContext(Context)
    const [promo, setPromo] = useState('')
    const [promoErr, setPromoErr] = useState(undefined)
    const [voucher, setVoucherList] = useState(undefined)
    const [listLoader, setListLoader] = useState(Boolean(listParams))
    const [claimLoader, setClaimLoader] = useState(false)
    const user = useSelector(state => state.user.userInfo)
    const api_token = useSelector(state => state.user.userInfo.user.api_token)
    const dispatch = useDispatch()

    // The sheet mounts its content on first open, so this runs when the user
    // actually opens the voucher sheet, not on the summary screen load.
    useEffect(() => {
        if (listParams) {
            getVouchers()
        }
    }, [])

    const getVouchers = () => {
        setListLoader(true)

        const params = {
            api_key: globals.API_KEY,
            api_token: api_token,
            ...listParams,
        }

        dispatch(getDiscountsAndCampaigns(params))
            .then(data => {
                setListLoader(false)
                if (data) {
                    setVoucherList(data)
                }
            })
            .catch(err => {
                setListLoader(false)
            })
    }

    const claim = item => {
        const base = typeof redeemParams === 'function' ? redeemParams() : redeemParams

        const params = {
            api_key: globals.API_KEY,
            api_token: api_token,
            ...base,
            type: item?.register?.type ?? base?.type,
            code: item.code,
        }

        setClaimLoader(true)
        dispatch(redeemVoucher(params))
            .then(data => {
                setClaimLoader(false)
                if (data) {
                    onApplied?.(data, item)
                }
            })
            .catch(err => {
                setClaimLoader(false)
            })
    }

    let list = voucher?.reduce((mainItem, current, index) => {
        return [
            ...mainItem, ...current.lists
        ]
    }, [])


    return (

        <Block isForground={true}
               style={{flex: 1, marginBottom: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
            <View style={styles.handler}/>


            <View style={{padding: 10}}>
                <TextElement h3 medium h3Style={{
                    color: colors.headingText,
                    marginBottom: 10
                }}>{t("hotel:addVoucher")}</TextElement>
                <TextElement h5 medium h5Style={{
                    color: colors.headingText,
                    marginBottom: 10
                }}>{t('inBus:addpromocode')}</TextElement>

                <InputVerify
                    isUmrah={isUmrah}
                    colors={colors}
                    placeholderTextColor={colors.greyText}
                    placeholder={t("hotel:promoCodePlaceholder")}
                    // label={t('cargo:promCode')}
                    value={promo}
                    onChangeText={(value) => {
                        setPromo(value)
                        setPromoErr(undefined)
                    }}
                    style={{textAlign: language === 'en' ? 'left' : 'right'}}
                    error={promoErr}

                    btnName={t('inBus:apply')}
                    verify={() => {
                        if (promo == '') {
                            setPromoErr(t("hotel:promoCodePlaceholder"))
                        } else {
                            Keyboard.dismiss()
                            if (analyticsEventData?.service_type) {
                                globals.FirebaseVerticalEvent(
                                    'PromoCodeApplied',
                                    analyticsEventData.service_type,
                                    analyticsEventData.page_url,
                                    {
                                        ...analyticsEventData,
                                        title: promo,
                                    },
                                )
                            }
                            // An explicit applyPromoCode wins: some verticals
                            // (e.g. bundles, cricket) claim promo codes through
                            // their own endpoint instead of redeemVoucher.
                            if (applyPromoCode) {
                                applyPromoCode(promo)
                            } else if (redeemParams) {
                                claim({code: promo})
                            }
                        }
                    }}
                />
            </View>

            <View style={{paddingHorizontal: 10}}>
                <TextElement h5 medium h5Style={[{marginVertical: 10}]}>{t('inBus:avaDis')}</TextElement>

                {listLoader ?
                    <Placeholder Animation={themeKey === 'light' ? Fade : null}>
                        {[0, 1, 2].map(index => (
                            <View key={index.toString()}
                                  style={[styles.shimmerCard, {borderColor: colors.borderColor}]}>
                                <PlaceholderLine color={colors.shimmerColor} noMargin={true}
                                                 style={styles.shimmerLine1}/>
                                <PlaceholderLine color={colors.shimmerColor} noMargin={true}
                                                 style={styles.shimmerLine2}/>
                            </View>
                        ))}
                    </Placeholder> : null}

                {!listLoader && list && list.length > 0 && list.map((item, index) => {
                    return (
                        <VoucherMainItem
                            isUmrah={isUmrah}
                            showBtn={true}
                            data={item}
                            onPress={() => {
                                if (analyticsEventData?.service_type) {
                                    globals.FirebaseVerticalEvent(
                                        'VoucherApplied',
                                        analyticsEventData.service_type,
                                        analyticsEventData.page_url,
                                        {
                                            ...analyticsEventData,
                                            title: item?.register?.voucher?.name ?? item?.title ?? item?.code,
                                        },
                                    )
                                }
                                if (redeemParams) {
                                    claim(item)
                                } else {
                                    setVoucher(item)
                                }
                            }}
                        />
                    )
                })}

                {listLoader ? null : user?.game?.fx_credits && user?.game?.fx_credits > 0 || voucher?.length > 0 || bundle ?
                    <View>
                        {user?.game?.fx_credits && user?.game?.fx_credits > 0 ?
                            <VoucherItem
                            style={{marginVertical: 5}}
                            available={true}
                            currency={user?.user?.currency}
                            isSelected={isPromoCreditEnable}
                            onPress={() => {
                                if (isPromoCreditEnable)
                                    setIsEnableGameCredit(false)
                                else
                                    setIsEnableGameCredit(true)
                            }}
                            item={{
                                description: t("train:willExpireSoon"),
                                price: user?.game?.fx_credits.toString(),
                                title: t("wallet:promoCredits")
                            }}/> : null}
                        {bundle ? <VoucherItemBundle
                            style={{marginVertical: 5}}
                            item={bundle}
                            isSelected={isBundleEnable?.id == bundle?.id}
                            onPress={() => {
                                if (isBundleEnable) {
                                    setBundleEnable(undefined)
                                } else {
                                    setBundleEnable(bundle)
                                }
                            }}
                        /> : null}

                    </View> :
                    <BorderedView style={{marginHorizontal: 0}}>
                        <TextElement h5 light style={[{
                            marginVertical: 10,
                            color: colors.greyText,
                            textAlign: 'center'
                        }]}>{t('inBus:noVouchers')}</TextElement>

                    </BorderedView>}

            </View>

            <Loading visible={claimLoader}/>

        </Block>
    )
}

const styles = StyleSheet.create({
    container: {},
    rowStyle: {
        alignItems: 'center',
        flexDirection: 'row'

    },
    handler: {
        width: '15%',
        height: 6,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 15,
        backgroundColor: '#dbdbdb'
    },
    orContainer: {
        borderRadius: 5,
        backgroundColor: Color.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerRowItemStyle: {
        flex: 1,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageCoin: {
        width: scale(20),
        height: scale(15),
        resizeMode: 'contain'
    },
    borderedContainer: {
        borderColor: '#dbdbdb',
        borderWidth: 1,
        paddingVertical: 5,
        borderRadius: 10,
        marginVertical: 5
    },
    text11: {
        fontSize: scale(11),
        color: '#000',
        fontFamily: Constants.fontFamilyRegularItalic
    },
    shimmerCard: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginVertical: 5
    },
    shimmerLine1: {
        width: '55%',
        height: scale(14),
        marginBottom: 10
    },
    shimmerLine2: {
        width: '35%',
        height: scale(12)
    }

})
