import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Card from '../shared/PCBTicketing/component/Card';
import React, {memo, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Context} from '../../../config/LanguageProvider';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import TextElement from '../../components/text/Text';
import {Color} from '../../../common';
import {getSeatInfo} from '../../../redux/bus/operations';
import {useDispatch, useSelector} from 'react-redux';
import globals from '../../../../globals';
import Block from '../../components/Block';
import {MoveRight} from 'lucide-react-native';

const WIDTH = Dimensions.get('window').width;
const TabBar = ({
  data,
  selectedIndex,
  onLoad,
  getCurrentItem,
  onChangeSelection,
  onResponse,
}) => {
  const {
    value: {
      themeColor: {colors},
    },
    value: {t},
  } = useContext(Context);
  // const animatedValue = useSharedValue(
  //   selectedIndex !== 1 ? 0 : WIDTH / 2 - 10,
  // );
  //
  // useEffect(() => {
  //   animateTransition(selectedIndex);
  //   getCurrentItem(data?.segment[selectedIndex]);
  // }, [selectedIndex]);
  // const animateTransition = index => {
  //   animatedValue.value = withTiming(index == 1 ? WIDTH / 2 - 20 : 0, {
  //     duration: 500,
  //   });
  // };
  //
  // const animatedStyles = useAnimatedStyle(() => ({
  //   transform: [{translateX: animatedValue.value}],
  // }));

  if (data?.segment && data?.segment.length === 0) {
    return null;
  }

  return (
    <Block style={{marginHorizontal: 5, padding: 5}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{flexDirection: 'row'}}>
        {data &&
          data?.segment?.map((item, index) => {
            return (
              <Tab
                onLoad={value => {
                  onLoad(value);
                }}
                index={index}
                item={item}
                getResponse={data => {
                  if (selectedIndex == index) onResponse(data);
                }}
                isSelected={selectedIndex == index}
                onPress={() => {
                  // animateTransition(index);
                  onChangeSelection(index);
                  getCurrentItem(item);
                }}
              />
            );
          })}
      </ScrollView>
      {/*<Animated.View*/}
      {/*  style={[styles.selected(colors), animatedStyles]}></Animated.View>*/}
    </Block>
  );
};

const Tab = memo(({onLoad, item, onPress, getResponse, isSelected, index}) => {
  const {
    value: {
      themeColor: {colors},
    },
    value: {t},
  } = useContext(Context);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userInfo.user);
  const [saveResponses, setSaveResponses] = useState(null);

  useEffect(() => {
    if (saveResponses) {
      getResponse(saveResponses);
    } else {
      apiCall().then(data => {
        setSaveResponses(data);
        getResponse(data);
      });
    }
  }, [isSelected]);

  const apiCall = () => {
    onLoad(true);

    const {
      departure_city_id,
      arrival_city_id,
      service_id,
      time_id,
      schedule_id,
      route_id,
      time,
      seats,
      is_advanced = 0,
      schedule_ref_id = null,
      search_ref_id = null,
      date,
      departureDate,
    } = item;

    const params = {
      api_key: globals.API_KEY,
      service_id,
      origin_city_id: departure_city_id,
      arrival_city_id,
      date: date ?? departureDate,
      deptime: time,
      time_id,
      schedule_id,
      route_id,
      seats,
      session_id: user.user_id,
      user_id: user.user_id,
      api_token: user.api_token,
      is_advanced,
      schedule_ref_id,
      search_ref_id,
    };

    return dispatch(getSeatInfo(params))
      .then(response => {
        if (response) {
          return {
            plan: setSeatsAvailablity(response).reverse(),
            classes: response.classes,
          };
        }
        return null;
      })
      .catch(err => {
        console.error('Seat info fetch failed:', err);
        getResponse(null);
        return null;
      })
      .finally(() => {
        onLoad(false);
      });
  };

  // console.log(item);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.rowAlign,{borderBottomWidth:2,borderColor:isSelected?colors.blueIconColor:colors.borderColor2}]}>
      <TextElement
        h6
        medium
        h6Style={{color: isSelected ? colors.headingText : colors.greyText}}>
        {`${item.departure_city_name}`}
      </TextElement>

      <MoveRight
        size={20}
        color={colors.greyText}
        style={{marginHorizontal: 5}}
      />

      <TextElement
        h6
        medium
        h6Style={{color: isSelected ? colors.headingText : colors.greyText}}>
        {`${item.arrival_city_name}`}
      </TextElement>
    </TouchableOpacity>
  );

  function setSeatsAvailablity(busJsonResponce) {
    // console.log(busJsonResponce);

    var busJson = busJsonResponce;
    var seatplan = busJson.seatplan.seatplan;
    var len = busJson.seatplan.seatplan.length;

    var available_seats = busJsonResponce.available_seats.split(',');
    var occupied_seats_male = busJsonResponce.occupied_seats_male.split(',');
    var reserved_seats_male = busJsonResponce.reserved_seats_male.split(',');
    var occupied_seats_female = busJsonResponce.occupied_seats_female
      .toString()
      .split(',');
    var reserved_seats_female =
      busJsonResponce.reserved_seats_female.split(',');

    var intArr = [];
    for (let i = 0; i < available_seats.length; i++)
      intArr.push(parseInt(available_seats[i]));
    available_seats = intArr;

    var male_Seats = [];
    for (let i = 0; i < occupied_seats_male.length; i++) {
      male_Seats.push(parseInt(occupied_seats_male[i]));
    }

    var male_Seats_reserved = [];
    for (let i = 0; i < reserved_seats_male.length; i++) {
      male_Seats_reserved.push(parseInt(reserved_seats_male[i]));
    }

    var female_Seats = [];
    for (let i = 0; i < occupied_seats_female.length; i++) {
      female_Seats.push(parseInt(occupied_seats_female[i]));
    }

    var female_Seats_reserver = [];
    for (let i = 0; i < reserved_seats_female.length; i++) {
      female_Seats_reserver.push(parseInt(reserved_seats_female[i]));
    }

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < seatplan[i].length; j++) {
        if (male_Seats_reserved.includes(parseInt(seatplan[i][j].seat_id))) {
          seatplan[i][j].gender = 'M';
          seatplan[i][j].checked = true;
          seatplan[i][j].disabled = true;
          seatplan[i][j].is_reserved = true;
          //seatplan[i][j].is_occupied = false;
          seatplan[i][j].is_occupied = true;
        } else if (male_Seats.includes(parseInt(seatplan[i][j].seat_id))) {
          seatplan[i][j].gender = 'M';
          seatplan[i][j].checked = true;
          seatplan[i][j].disabled = true;
          seatplan[i][j].is_reserved = true;
          seatplan[i][j].is_occupied = true;
        } else if (
          female_Seats_reserver.includes(parseInt(seatplan[i][j].seat_id))
        ) {
          seatplan[i][j].gender = 'F';
          seatplan[i][j].checked = true;
          seatplan[i][j].disabled = true;
          seatplan[i][j].is_reserved = true;
          //seatplan[i][j].is_occupied = false;
          seatplan[i][j].is_occupied = true;
        } else if (female_Seats.includes(parseInt(seatplan[i][j].seat_id))) {
          seatplan[i][j].gender = 'F';
          seatplan[i][j].checked = true;
          seatplan[i][j].disabled = true;
          seatplan[i][j].is_reserved = true;
          seatplan[i][j].is_occupied = true;
        } else {
          seatplan[i][j].checked = false;
          seatplan[i][j].disabled = false;
          seatplan[i][j].gender = '';
        }
      }
    }

    //to stop trace that starts at the time of seat plan network request calling
    //this.trace.stop();

    busJson.seatplan.seatplan = seatplan;

    return busJson.seatplan.seatplan;
  }
});
export default TabBar;

const styles = StyleSheet.create({
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 10,
    borderRadius: 3,

    width: WIDTH / 2 - 20,
  },
  selected: colors => ({
    width: WIDTH / 2 - 20,
    marginRight: 10,
    backgroundColor: colors.blueIconColor,
    height: 2,
  }),
});
