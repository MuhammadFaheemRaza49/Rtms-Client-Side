import React, {useCallback, useContext} from 'react';
import {StyleSheet, View} from "react-native";
import {Color} from "../../../../../common";
import RangeSlider from "rn-range-slider";
import globals from "../../../../../../globals";
import {scale} from "../../../../../ScalingUtils";
import appStyle from "../../PCBTicketing/styles"
import TextElement from "../../../../components/text/Text";
import {Context} from "../../../../../config/LanguageProvider";




export default function SliderComponent({rangeValues,floatingLabel=true, minValue, maxValue, onRheostatValUpdated, onTouchEnd, isUmrah = false}) {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    const renderThumb = useCallback(() => <View style={[appStyle.shadow,{
        backgroundColor: minValue===maxValue?colors.borderColor2:Color.white,
        height: 18,
        width: 18,
        borderRadius: 20,
        elevation:4
    }]}/>, []);
    const renderRail = useCallback(() =>  <View style={{flex: 1, backgroundColor: colors.borderColor2, height: 5}}/>, []);
    const renderRailSelected = useCallback(() => <View style={{backgroundColor: isUmrah ? colors.umrahPrimary : colors.blueIconColor, height: 5}}/>, [colors, isUmrah]);
    const renderLabel = useCallback(value => <TextElement h6 medium h6Style={{
        backgroundColor:colors.bgColorWhite,
        padding:10,
        color:colors.white
    }}>{value}</TextElement>, []);
    const handleValueChange = useCallback((low, high) => {
        onRheostatValUpdated(low,high)
    }, []);

    if (minValue===maxValue){
      return (
        <View style={styles.disableRail}>
          <View style={{marginRight:-10}}>
            {renderThumb()}
          </View>
            <View style={styles.rail(colors)}/>
          <View style={{marginLeft:-10}}>
            {renderThumb()}
          </View>

        </View>
      )
    }

    return (

        <View style={styles.container}>

            <View style={{flex: 1}}>

                <RangeSlider
                    allowLabelOverflow={true}
                    renderRailSelected={renderRailSelected}
                    renderRail={renderRail}
                    renderThumb={renderThumb}
                    floatingLabel={floatingLabel}
                    style={{minHeight: 15, width: '100%'}}
                    min={minValue}
                    max={maxValue}
                    step={50}
                    low={rangeValues[0]}
                    high={rangeValues[1]}
                    labelStyle={'bubble'}
                    renderLabel={renderLabel}
                    onSliderTouchEnd={onTouchEnd}
                    selectionColor={isUmrah ? Color.umrahPrimary : Color.primary}
                    blankColor={'#dbdbdb'}
                    onValueChanged={handleValueChange}
                />


            </View>
        </View>
    )

}

const styles = {
    container: {

        // marginBottom: 15,
        marginTop: 5
    },
    textStyle: {
        fontFamily: globals.medium,
        fontSize: scale(12),
        fontWeight: '500',
        color: 'rgba(255, 255, 255,0.7)',
    },
  disableRail:{
    flexDirection:'row',alignItems:'center',paddingVertical:10
  },
  rail:(colors)=>({flex: 1, backgroundColor: colors.borderColor2, height: 5})





}
