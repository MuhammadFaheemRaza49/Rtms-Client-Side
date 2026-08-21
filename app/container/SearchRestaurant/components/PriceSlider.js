import {View} from 'react-native'
import RangeSlider from 'rn-range-slider'
import React, {useCallback} from 'react'
import {Color} from '../../../common'

const PriceSlider = ({rangeValues, minValue, maxValue, onRheostatValUpdated, onTouchEnd}) => {
    // console.log(rangeValues)
    // console.log(maxValue)
    // console.log(minValue)
    const handleValueChange = useCallback((low, high) => {
        onRheostatValUpdated(low,high)
    }, []);

    const renderThumb = useCallback(() =>  <View style={{backgroundColor: Color.primary, height: 20, width: 20, borderRadius: 20}}/>, []);
    const renderRail = useCallback(() =>  <View style={{flex: 1, backgroundColor: Color.grey2, height: 5}}/>, []);
    const renderRailSelected = useCallback(() =>  <View style={{backgroundColor: Color.primary, height: 5}}/>, []);
    return (
        <View style={{}}>
            <RangeSlider
                renderRailSelected={renderRailSelected}
                renderRail={renderRail}
                renderThumb={renderThumb}
                floatingLabel
                style={{minHeight: 15, width: '100%'}}
                min={minValue}
                max={maxValue}
                step={50}
                low={rangeValues.values[0]}
                high={rangeValues.values[1]}
                onValueChanged={handleValueChange}
            />
        </View>
    )
}

export default PriceSlider
