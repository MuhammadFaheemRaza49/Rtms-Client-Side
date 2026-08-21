import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {scale} from "../../../ScalingUtils";
import appStyle from '../shared/PCBTicketing/styles'


export default function RemoveCancelImage({onRemove, onCancel}) {

    return (
        <View style={styles.favContainer}>
            <View style={styles.handler}/>
            <View>
                <TouchableOpacity onPress={onRemove} style={styles.textContainer}>
                    <Text style={appStyle.h2}>Remove Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.textContainer}
                    onPress={onCancel}>
                    <Text style={appStyle.h2}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    favContainer: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 20
    },
    handler: {
        width: '25%',
        height: 6,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 15,
        backgroundColor: '#dbdbdb'
    },
    textContainer:{
        padding: 10,
        borderRadius: 5,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        marginVertical: 5
    }

})
