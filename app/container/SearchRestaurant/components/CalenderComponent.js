import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Color from '../../../common/Color';
// import globals from '../../../../globals';
// import {toast} from '../../../Omni';
import { Context } from '../../../config/LanguageProvider';
import Block from '../../components/Block';
import Checkbox from '../../components/Checkbox';
import { useSelector } from 'react-redux';
import { Constants, Images, Tools } from '../../../common';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import ButtonComponent from '../../ComponentsV2/ComponentsV2/button/ButtonComponent';

const globals = {
  theme_color: Color.headerBlue,
  medium: Constants.fontFamilyMedium,
};
const toast = msg => Alert.alert('', msg);

const staticColors = {
  primary: '#1576D1',
  primaryLight: '#C1DCF5',
  lowPriceBackground: '#C1EBDF',
  lowPriceText: '#7AB4A3',
  mediumPriceBackground: '#FFF1BD',
  mediumPriceText: '#B0833E',
  highPriceBackground: '#F5D2CD',
  highPriceText: '#C6735D',
};

let lastTap = 0;

export default function CalenderComponent({
  selectedDate,
  oneWay,
  mutliWay,
  nextDate,
  departureDate,
  arrivalDate,
  isShowFlexibleDate = false,
  flexibleValue = false,
  isBus = false,
}) {
  const {
    value: {
      t,
      language,
      themeColor: { colors },
    },
  } = useContext(Context);

  const calendarFares = useSelector(state => state.airline.calendarFares);
  const configurationSetting = useSelector(state => state.bus?.busSetting) || {};
  const { advance_booking = null } = configurationSetting;

  const today = useMemo(() => moment(new Date()).format('YYYY-MM-DD'), []);

  const [depDate, setDepDate] = useState(
    departureDate ? moment(departureDate, 'DD MMM, YYYY').format('YYYY-MM-DD') : null,
  );
  const [arrDate, setArrDate] = useState(
    arrivalDate ? moment(arrivalDate, 'DD MMM, YYYY').format('YYYY-MM-DD') : null,
  );

  useEffect(() => {
    if (departureDate) {
      setDepDate(moment(departureDate, 'DD MMM, YYYY').format('YYYY-MM-DD'));
    }
  }, [departureDate]);

  useEffect(() => {
    if (arrivalDate) {
      setArrDate(moment(arrivalDate, 'DD MMM, YYYY').format('YYYY-MM-DD'));
    }
  }, [arrivalDate]);

  const [markedDates, setMarkedDates] = useState({});
  const [isFlexibleDate, setIsFlexible] = useState(flexibleValue);

  const ICON = language === 'en' ? ChevronRight : ChevronLeft;
  const ICON2 = language === 'en' ? ChevronLeft : ChevronRight;

  // -------------------------
  // Locale setup
  // -------------------------
  useEffect(() => {
    LocaleConfig.locales.en = {
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      today: 'Today',
    };

    LocaleConfig.locales.ar = {
      monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      dayNamesShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمـ', 'سبت'],
      today: 'اليوم',
    };

    LocaleConfig.defaultLocale = language || 'en';
  }, [language]);

  // oneWay => clear arrival date
  useEffect(() => {
    if (oneWay === 1) setArrDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Recompute marked dates
  // -------------------------
  useEffect(() => {
    if (!depDate) {
      setMarkedDates({});
      return;
    }

    const formattedDep = moment(depDate).format('YYYY-MM-DD');
    const enable = configurationSetting?.advance_booking?.enabled;

    if (oneWay === 1) {
      // One-way: full circle
      let singleMark = {
        [formattedDep]: {
          startingDay: true,
          endingDay: true,
          single: true,
          color: Color.headerBlue,
          textColor: 'white',
          bgColor: Color.headerBlue,
          icon:
            enable && isBus && advance_booking && dateExistsInArray(formattedDep)
              ? Images.clock
              : undefined,
          iconStyle: { tintColor: Color.white },
        },
      };

      if (isBus && advance_booking && enable) {
        const nextDays = generateNextDays();
        for (let fare of nextDays) {
          if (fare.Date !== formattedDep) {
            singleMark[fare.Date] = {
              icon: Images.clock,
              iconStyle: { tintColor: colors.blueIconColor },
            };
          }
        }
      }

      setMarkedDates(singleMark);
      return;
    }

    if (!arrDate) {
      // Two-way but arr not selected yet: show ONLY startingDay (left semi circle)
      let startMark = {
        [formattedDep]: {
          startingDay: true,
          endingDay: false,   // ✅ no right side fill — renders left semi circle
          color: Color.headerBlue,
          textColor: 'white',
          icon:
            enable && isBus && advance_booking && dateExistsInArray(formattedDep)
              ? Images.clock
              : undefined,
          iconStyle: { tintColor: Color.white },
        },
      };

      if (isBus && advance_booking && enable) {
        const nextDays = generateNextDays();
        for (let fare of nextDays) {
          if (fare.Date !== formattedDep) {
            startMark[fare.Date] = {
              icon: Images.clock,
              iconStyle: { tintColor: colors.blueIconColor },
            };
          }
        }
      }

      setMarkedDates(startMark);
      return;
    }

    const formattedArr = moment(arrDate).format('YYYY-MM-DD');
    const periods = markingDates(formattedDep, formattedArr) ?? {};
    setMarkedDates(periods);
  }, [calendarFares, depDate, arrDate, oneWay]);

  // -------------------------
  // Helpers
  // -------------------------
  function dateExistsInArray(dateToCheck) {
    const datesArray = generateNextDays();
    return datesArray.some(entry => entry.Date === dateToCheck);
  }

  function generateNextDays() {
    const advance = configurationSetting?.advance_booking;
    const startDate = moment(advance?.start_date);
    const datesArray = [];
    for (let i = 0; i < advance?.days; i++) {
      datesArray.push({
        Date: startDate.clone().add(i, 'days').format('YYYY-MM-DD'),
      });
    }
    return datesArray;
  }

  function markingDates(startDate, endDate) {
    let periodicMarking = {};
    const enable = configurationSetting?.advance_booking?.enabled;
    const currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');

    // If user picked end date before start date, swap them
    if (currDate.diff(lastDate) > 0) {
      setDepDate(endDate);
      setArrDate(null);
      return {};
    }

    // Same date selected for both dep and arr
    if (startDate === endDate) {
      periodicMarking[startDate] = {
        startingDay: true,
        endingDay: true,
        single: true,
        color: Color.headerBlue,
        textColor: 'white',
        bgColor: Color.headerBlue,
        icon:
          enable && isBus && advance_booking && dateExistsInArray(startDate)
            ? Images.clock
            : undefined,
        iconStyle: { tintColor: Color.white },
      };
    } else {
      // Start date
      periodicMarking[startDate] = {
        startingDay: true,
        color: Color.headerBlue,
        textColor: 'white',
        icon:
          enable && isBus && advance_booking && dateExistsInArray(startDate)
            ? Images.clock
            : undefined,
        iconStyle: { tintColor: Color.white, marginBottom: 3 },
      };

      // End date
      periodicMarking[endDate] = {
        endingDay: true,
        color: Color.headerBlue,
        textColor: 'white',
        icon:
          enable && isBus && advance_booking && dateExistsInArray(endDate)
            ? Images.clock
            : undefined,
        iconStyle: { tintColor: Color.white },
      };

      // Dates in between
      const iterDate = moment(startDate).startOf('day');
      while (iterDate.add(1, 'days').diff(lastDate) < 0) {
        const temp = iterDate.format('YYYY-MM-DD');
        periodicMarking[temp] = {
          selected: true,
          color: colors.bgSecondaryColor,
          textColor: colors.headingText,
        };
      }
    }

    // Bus advance booking icons (don't overwrite already marked dates)
    if (isBus && advance_booking && enable) {
      const nextDays = generateNextDays();
      for (let fare of nextDays) {
        if (!periodicMarking[fare.Date]) {
          periodicMarking[fare.Date] = {
            icon: Images.clock,
            iconStyle: { tintColor: colors.blueIconColor },
          };
        }
      }
    }

    return periodicMarking;
  }

  // -------------------------
  // Calendar props
  // -------------------------
  const minDate = mutliWay !== 1 ? today : nextDate ? nextDate : today;
  const current = mutliWay === 1 ? nextDate : depDate ? depDate : today;

  return (
    <Block
      isForground={true}
      style={{
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}>
      <View>
        <Calendar
          minDate={minDate}
          markingType={'period'}
          markedDates={markedDates ?? {}}
          current={current}
          theme={{
            calendarBackground: colors?.bgColorWhite ?? Color.white,
            textSectionTitleColor: '#8A94A6',
            todayTextColor: Color.headerBlue,
            monthTextColor: Color.textPrimary,
            todaySmallTextColor: depDate ? '#fff' : Color.headerBlue,
            selectedColor: '#fff',
            selectedDayTextColor: '#fff',
            textDisabledColor: colors?.darkgrey ?? Color.textMuted,
            selectedDayBackgroundColor: Color.headerBlue,
            dayTextColor: Color.textPrimary,
            textDayFontFamily: globals.medium,
            textMonthFontFamily: Constants.fontFamilyMedium,
            textDayHeaderFontFamily: globals.medium,
            textDayFontWeight: '500',
            textDayFontSize: 15,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
          onDayPress={day => {
            const now = Date.now();
            if (now - lastTap < 400) {
              return;
            }
            lastTap = now;

            if (oneWay === 1) {
              // One-way: toggle selection on/off
              if (depDate === day.dateString) {
                setDepDate(null);
              } else {
                setDepDate(day.dateString);
              }
              setArrDate(null);
            } else {
              // Two-way logic
              if (depDate && arrDate) {
                // Both set → reset and start fresh
                setDepDate(day.dateString);
                setArrDate(null);
              } else if (!depDate) {
                // Nothing set yet
                setDepDate(day.dateString);
              } else {
                // dep set, arr not set → set arr
                setArrDate(day.dateString);
              }
            }
          }}
          onDayLongPress={() => { }}
          monthFormat={'MMMM yyyy'}
          hideArrows={false}
          renderArrow={direction =>
            direction === 'right'
              ? <ICON size={20} color="#1E2937" />
              : <ICON2 size={20} color="#1E2937" />
          }
          hideExtraDays={true}
          disableMonthChange={false}
          firstDay={1}
          disableArrowLeft={false}
          disableArrowRight={false}
          hideDayNames={false}
          showWeekNumbers={false}
        />

        {isShowFlexibleDate && (
          <Checkbox
            style={{ backgroundColor: colors?.bgColorWhite }}
            colors={colors}
            value={isFlexibleDate}
            onPress={() => setIsFlexible(prev => !prev)}
            title={t('airline:flexibleDates')}
          />
        )}

        <TouchableOpacity
          onPress={() => {
            if (oneWay === 1) {
              if (depDate) {
                const depD = moment(depDate, 'YYYY-MM-DD').format('DD MMM, YYYY');
                selectedDate(depD, null, isFlexibleDate);
              } else {
                toast(t('inBus:selectDepDate'));
              }
              return;
            }

            if (!depDate) {
              toast(t('inBus:selectDepDate'));
              return;
            }

            if (!arrDate) {
              toast(t('inBus:selectArrDate'));
              return;
            }

            const depD = moment(depDate, 'YYYY-MM-DD').format('DD MMM, YYYY');
            const arrD = moment(arrDate, 'YYYY-MM-DD').format('DD MMM, YYYY');
            selectedDate(depD, arrD, isFlexibleDate);
          }}
          style={{
            backgroundColor: Color.headerBlue,
            borderRadius: 8,
            paddingVertical: 14,
            marginHorizontal: 16,
            marginVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: Color.white, fontSize: 16, fontWeight: '600', fontFamily: globals.medium }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </Block>
  );
}

const styles = StyleSheet.create({
  calenderContainer: {
    flex: 1,
  },
  headStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: staticColors.primary,
    flexDirection: 'row',
  },
  textStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 5,
  },
  textStyle2: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'black',
    fontWeight: '500',
  },
  textStylePricing: {
    fontSize: 13,
    padding: 8,
    marginHorizontal: 2.5,
    alignItems: 'center',
    alignSelf: 'center',
    color: staticColors.lowPriceText,
    backgroundColor: staticColors.lowPriceBackground,
    fontWeight: 'bold',
    borderRadius: 4,
  },
  headItemStyle: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
  },
  handler: {
    width: '25%',
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 9,
    marginTop: 15,
    backgroundColor: '#dbdbdb',
  },
});