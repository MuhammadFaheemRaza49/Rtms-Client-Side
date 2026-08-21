import React, {memo, useContext} from 'react';
import {StyleSheet} from 'react-native';
import Block from '../../components/Block';
import FareItem from '../../SearchRestaurant/shared/HotelRevamp/components/FareItem';
import verticalStyles from '../../SearchRestaurant/shared/VisitSaudi/Styles';
import {Context} from '../../../config/LanguageProvider';
import ButtonComponent from '../button/ButtonComponent';

const FareSummary = ({
  currency, // required
  totalFare, // required – core fare amount
  cashInHand = 0,
  voucherDiscount = 0,
  baseFare = 0,
  discount = 0,
  chargedTaxes = 0,
  fees = 0,
  surchargedFee = 0,
  serviceFees = 0,
  platformFeeData = {},
  bookMeBalance = 0,
  promoCredits = 0,
  onPressButton,
}) => {
  const {
    value: {
      themeColor: {colors},
      t,
    },
  } = useContext(Context);

  const platformFee = platformFeeData?.PlatformFee ?? 0;
  const platformTax = platformFeeData?.Tax ?? 0;

  return (
    <Block isForground style={[styles.bordered(colors)]}>
      {/* Charges */}
      <Block isForground>
        <FareItem
          currency={currency}
          title={t('hotel:basePrice')}
          value={baseFare}
        />
        {surchargedFee > 0 && (
          <FareItem
            currency={currency}
            title={t('hotel:surcharge')}
            value={surchargedFee}
          />
        )}
        {chargedTaxes > 0 && (
          <FareItem
            currency={currency}
            title={t('hotel:tax')}
            value={chargedTaxes}
          />
        )}

        {platformFee > 0 && (
          <FareItem
            currency={currency}
            title={t('hotel:platformFee')}
            value={platformFee}
          />
        )}

        {platformFeeData?.TaxType && platformFeeData.TaxRate > 0 && (
          <FareItem
            currency={currency}
            title={`${platformFeeData.TaxType} (${platformFeeData.TaxRate}%)`}
            value={platformTax}
          />
        )}

        {fees > 0 ? (
          <FareItem currency={currency} title={t('hotel:fee')} value={fees} />
        ) : null}

        {serviceFees > 0 && (
          <FareItem
            currency={currency}
            title={t('airline:serviceCharges')}
            value={serviceFees}
          />
        )}
      </Block>

      {/* Discounts & Adjustments */}
      {(cashInHand > 0 ||
        promoCredits > 0 ||
        voucherDiscount > 0 ||
        discount > 0 ||
        bookMeBalance > 0) && (
        <Block isForground style={verticalStyles.block}>
          {cashInHand > 0 && (
            <FareItem
              currency={currency}
              isMinus
              title={t('inBus:adjustment')}
              value={cashInHand}
            />
          )}

          {promoCredits > 0 && (
            <FareItem
              currency={currency}
              isMinus
              title={t('hotel:promoCredits')}
              value={promoCredits}
            />
          )}

          {voucherDiscount > 0 && (
            <FareItem
              currency={currency}
              isMinus
              title={t('hotel:voucherDiscount')}
              value={voucherDiscount}
            />
          )}

          {discount > 0 && (
            <FareItem
              currency={currency}
              isMinus
              title={t('inBus:totalDis')}
              value={discount}
            />
          )}

          {bookMeBalance > 0 && (
            <FareItem
              currency={currency}
              isMinus
              title={t('inBus:bookmeWallet')}
              value={bookMeBalance}
            />
          )}
        </Block>
      )}

      {/* Final Amount */}
      <FareItem
        currency={currency}
        title={t('hotel:paidAmount')}
        value={totalFare}
        valueStyle={{color: colors.blueIconColor}}
      />

      <ButtonComponent
        style={{marginVertical: 10}}
        title={t('games:gotIt')}
        onPress={onPressButton}
      />
    </Block>
  );
};

export default memo(FareSummary);

const styles = StyleSheet.create({
  bordered: colors => ({
    backgroundColor: colors.bgColorWhite,
    borderColor: colors.borderColor2,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  }),
});
