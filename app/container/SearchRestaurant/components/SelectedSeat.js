import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import appStyle from '../shared/PCBTicketing/styles';
import {Color, Constants} from '../../../common';
import {scale} from '../../../ScalingUtils';

import TextElement from '../../ComponentsV2/text/Text';
import {CircleX} from 'lucide-react-native';

const SelectedSeat = ({seatNo, male, onPress}) => {
    return (
        <View
            onPress={onPress}
            style={StyleSheet.flatten([
                male ? styles.seatViewActive : styles.seatViewInactive,
            ])}>
            <TextElement
                h7
                medium
                h7Style={{color:Color.white}}>
                {seatNo}
            </TextElement>

        </View>
    );
};

export default SelectedSeat;
const styles = StyleSheet.create({
    seatViewActive: {
        width:60,
        paddingVertical:8,
        backgroundColor: Color.greyText2,
        borderRadius: 4,
        paddingHorizontal:8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 5,

    },
    seatViewInactive: {
        width:60,
        paddingVertical:8,
        backgroundColor: '#EC4899',
        borderRadius: 4,
        paddingHorizontal:8,
        borderWidth: 1,
        borderColor: '#EC4899',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginEnd: 4,
    },
    absoluteText: {
        fontSize: 10,
        marginEnd:10,
        color: '#fff',
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        borderRadius: 100,
        borderWidth: 1,
        borderColor:Color.white,
    },
});
