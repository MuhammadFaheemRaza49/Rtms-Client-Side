import React, {useState} from 'react';
import BottomSheet from "../../../../BottomSheet/NewGorhomBS";
import Block from "../../../../components/Block";
import {heightPercentageToDP} from "react-native-responsive-screen";
import {WebView} from "react-native-webview";
import Loading from "../../../../components/Loading";
import {Color} from "../../../../../common";
import {toast} from "../../../../../Omni";




export default function TermsAndConditionBS({BSRef,url,close}) {

    const [isLoading, setIsLoading] = useState(true);

    return(
        <BottomSheet isBottomSafeArea refRBSheet={BSRef}>
            <Block isForground={true} style={{height:heightPercentageToDP(80),}}>
              <Loading visible={isLoading} color={Color.primary}/>
                <WebView

                    incognito={true}
                    cacheEnabled={false}
                    cacheMode={'LOAD_NO_CACHE'}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    javaScriptEnabledAndroid={true}
                    injectedJavaScriptForMainFrameOnly={false}
                    mixedContentMode={'compatibility'}
                    onLoadStart={()=>{
                        setIsLoading(true);
                    }}
                    onError={(err)=>{
                        setIsLoading(false);
                        close()
                        toast("Something went wrong!");
                        // navigation.pop()
                    }}
                    onLoad={()=>{
                    }}
                    onLoadEnd={(syntheticEvent) => {
                        setIsLoading(false)
                    }}

                    source={{uri:url}}
                    style={{ flex: 1}}
                />

            </Block>
        </BottomSheet>
    )

}
