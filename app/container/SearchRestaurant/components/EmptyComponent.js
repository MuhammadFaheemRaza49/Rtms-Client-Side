import React from 'react'
import {StyleSheet, View} from 'react-native'


function EmptyComponent(){
  return (
      <View  style={styles.col}>
          <View style={StyleSheet.flatten([styles.seatView,])}/>

      </View>
  )  ;

}

export default React.memo(EmptyComponent)
const styles = StyleSheet.create({
    col: {


    },
    seatView: {
      width: 50,
      height: 50,


    },
    absoluteText: {
        position: 'absolute'
    }
})
