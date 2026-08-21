'use strict';

import React, {useState, useEffect, useContext} from "react";
import {Image, Text, View} from 'react-native';
import { lightTheme } from "../../common/Color";
import { scale } from "../../ScalingUtils";
import { Constants } from "../../common";
import {Context} from "../../config/LanguageProvider";

const GIfLoader = (props) => {
    const { value: { themeColor: { colors: theme } } } = useContext(Context);
    const colors = props.isDark ? theme : lightTheme.colors;
    const defaultMsgArr = [
        'Do you know, you can refer Bookme app to a friend & earn 100 Rs.',
        'Find the cheapest fare with the best facilities by tapping "Recommended" button on search results.',
        'Bus fares tend to go higher with time, buy tickets early to save more'
    ];

    const msgArr = props.msg && props.msg.length > 0 ? props.msg : defaultMsgArr;

    const generateRandomNumber = (length) => Math.floor(Math.random() * length);

    const [newMsg, setNewMsg] = useState(
        props.msg === undefined ? msgArr[generateRandomNumber(msgArr.length)] : (props.msg.length > 0 ? props.msg[0] : '')
    );

    useEffect(() => {
        let timer;
        if (newMsg && newMsg.length > 0) {
            timer = setTimeout(() => {
                setNewMsg(msgArr[generateRandomNumber(msgArr.length)]);
            }, 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [newMsg, msgArr]);



    if (!props.isVisible) return null;

    return (
        <View style={[{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.bgColorWhite,
            flex: 1,
            zIndex: 2
        }, props.style]}>
            <Image
                style={{
                    zIndex: 2,
                    width: '80%',
                    height: undefined,
                    aspectRatio: 1.65,
                }}
                source={{ uri: props.url }}
            />
            <Text style={{
                fontFamily: Constants.fontFamilyBold,
                fontSize: scale(13),
                textAlign: 'center',
                marginTop: 30,
                marginHorizontal: 20,
                color: '#999999'
            }}>
                {"Loading..."}
            </Text>
        </View>
    );
};

export default GIfLoader;
