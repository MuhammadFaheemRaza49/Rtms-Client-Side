import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import globals from "../../../../../../globals";
import {navigate} from "../../../../../navigation/RootNavigation";
import {Context} from "../../../../../config/LanguageProvider";

export default function AdItem({item}) {
    const {link,ratio,file,navigation} = item
    const {value: {themeColor: {colors}}} = useContext(Context)

    return(
        <TouchableOpacity
            disabled={!navigation&&(!link||link==="")}
            style={StyleSheet.flatten([styles.container,{aspectRatio:parseFloat(ratio)}])}
            onPress={()=>{
                if (link||link!=="") {
                    try {
                        globals.openTheUrl(link)
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    navigate(navigation)
                }

            }}>
            <Image
                source={{uri:file}}
                style={{flex:1,borderRadius: 10,}}
            />
        </TouchableOpacity>
    )





}

const styles = StyleSheet.create({

    container:{
        height:undefined,
        width:'100%',
        borderRadius: 10,
    }


})
