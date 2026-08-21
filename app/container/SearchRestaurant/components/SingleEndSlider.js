import {View,StyleSheet} from 'react-native'
import RangeSlider from 'rn-range-slider'
import React, {useCallback} from 'react'
import {Color} from '../../../common'
import TextElement from "../../components/text/Text";

const SingleEndSlider = ({value, minValue, maxValue, onRheostatValUpdated, onTouchEnd}) => {
    const handleValueChange = useCallback((low, high) => {
        onRheostatValUpdated(low,high)
    }, []);
    const renderLabel = useCallback(value => <Label value={value}/>, []);
    const renderThumb = useCallback(() =>  <View style={{backgroundColor: Color.primary, height: 20, width: 20, borderRadius: 20}}/>, []);
    const renderRail = useCallback(() =>  <View style={{flex: 1, backgroundColor: Color.grey2, height: 5}}/>, []);
    const renderRailSelected = useCallback(() =>  <View style={{backgroundColor: Color.primary, height: 5}}/>, []);
    return (
        <View style={{}}>
            <RangeSlider
                renderLabel={renderLabel}
                renderRailSelected={renderRailSelected}
                renderRail={renderRail}
                renderThumb={renderThumb}
                floatingLabel
                style={{minHeight: 15, width: '100%'}}
                min={minValue}
                max={maxValue}
                step={10}
                low={value}
                high={value}
                disableRange={true}
                labelStyle={'bubble'}
                onSliderTouchEnd={onTouchEnd}
                selectionColor={Color.primary}
                blankColor={'#dbdbdb'}
                onValueChanged={handleValueChange}
            />
        </View>
    )
}

const Label = ({value})=>{
    return(
        <View style={{
            backgroundColor:Color.primary,
            borderRadius:3,
            justifyContent:'center',
            padding:5,
            alignItems:'center'
        }}>
            <TextElement h6 light h6Style={{color:Color.white}}>{value}%</TextElement>
        </View>
    )
}

const styles=StyleSheet.create({
    root: {
        width: 8,
        height: 8,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#FE6600",
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 8
    }
})


export default SingleEndSlider
