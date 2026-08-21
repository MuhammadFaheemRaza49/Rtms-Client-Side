import React, {useContext, useEffect, useState} from 'react';
import {Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell,} from 'react-native-confirmation-code-field';
import TextElement from '../text/Text';
import {Color, Constants} from '../../../common';
import {Context} from "../../../config/LanguageProvider";

const RNOtpVerify = Platform.OS === 'android' ? require('react-native-otp-verify').default : null;

const styles = StyleSheet.create({
    root: {paddingHorizontal: 0},
    title: {textAlign: 'center', fontSize: 30},
    codeFiledRoot: {marginTop: 8, marginBottom: 10},
    cell: {
        width: 45,
        height: 45,
        lineHeight: 45,
        fontSize: 24,
        borderRadius: 5,
        borderWidth: 1,
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});

const CELL_COUNT = 6;

const App = ({onFulfill, onCodeChange,showVerifyButton=true}) => {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const {value: {t,themeColor: {colors}}} = useContext(Context)


    useEffect(() => {
        // getHash();
        if (Platform.OS === 'android') {
            startListeningForOtp();
        }
        return () => {
            if (RNOtpVerify) {
                RNOtpVerify.removeListener();
            }
        };
    }, []);
    return (
        <View style={styles.root}>
            {showVerifyButton?<TouchableOpacity style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between', marginTop: 10}} onPress={() => {
                setValue("")
            }}>
                <TextElement h4 medium h4Style={{color: colors.white}}>
                    {t('setting:enter_code')}
                </TextElement>
                <TextElement h4 medium h4Style={{
                    fontFamily: Constants.fontFamilyRegular,
                    color: colors.blueIconColor,
                }}>Clear</TextElement>
            </TouchableOpacity>:null}
            <CodeField
                ref={ref}
                {...props}
                textContentType={"oneTimeCode"}
                value={value}
                onChangeText={(v) => {
                    onCodeChange(v);
                    setValue(v);
                }}
                cellCount={CELL_COUNT}
                rootStyle={StyleSheet.flatten([styles.codeFiledRoot, {borderColor: '#fff',}])}
                keyboardType="numeric"
                autoFocus={true}
                renderCell={({index, symbol, isFocused}) => {
                    return (<Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell, {
                            color: colors.headingText,
                            borderColor: colors.borderColor2,
                            fontFamily: Constants.fontFamilyMedium
                        }]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor   // Blinking animation speed (optional, number)
                            delay={1500}
                            // Symbol that would be returned to simulate cursor blinking (optional, string)
                            cursorSymbol="|"/> : null)}
                    </Text>)
                }}
            />
        </View>
    );



    function startListeningForOtp() {
        if (!RNOtpVerify) {
            return;
        }
        RNOtpVerify.getOtp()
            .then(p => RNOtpVerify.addListener(otpHandler))
            .catch(p => console.log(p));
    }

    function otpHandler(message) {
        try {
            const otp = /(\d{6})/g.exec(message)[1];
            setValue(otp);
            onCodeChange(otp);
            RNOtpVerify.removeListener();
            Keyboard.dismiss();
        } catch (e) {

        }

    }

};

export default App;
