import React, { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

const patchPostMessageJsCode = `function getToken(res) {window.ReactNativeWebView.postMessage(res)};`;

const ReCaptchaComponent = ({ onReceiveToken, onLoaded }) => {
    const webViewRef = useRef(null);

    useEffect(() => {
        if (Platform.OS !== 'ios') {
            webViewRef.current?.clearCache(true);
            webViewRef.current?.clearHistory();
        }
    }, []);

    return (
        <View style={{ flex: 1, margin: 5 }}>
            <WebView
                incognito={true}
                cacheEnabled={false}
                cacheMode={'LOAD_NO_CACHE'}
                ref={webViewRef}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                injectedJavaScriptForMainFrameOnly={false}
                injectedJavaScript={patchPostMessageJsCode}
                mixedContentMode={'compatibility'}
                onMessage={(e) => {
                    onReceiveToken(e.nativeEvent.data);
                }}
                onLoadEnd={() => {
                    onLoaded(true);
                    webViewRef.current?.injectJavaScript(patchPostMessageJsCode);
                }}
                source={{ uri: 'https://bookme.pk/mobile-recaptcha.html' }}
            />
        </View>
    );
};

export default ReCaptchaComponent;
