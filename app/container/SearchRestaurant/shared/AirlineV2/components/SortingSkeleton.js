import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import AirlineSkeleton from './AirlineSkeleton'
import SortingSkeletonItem from './SortingSkeletonItem'
import { Context } from '../../../../../config/LanguageProvider'

const SortingSkeleton = () => {
  return (
        <View style={styles.row}>
            {[1, 2, 3, 4, 5].map((i, index) => {
              return (
                    <SortingSkeletonItem key={index.toString()}/>
              )
            })}
        </View>
  )
}
export default SortingSkeleton
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 3,
    marginTop: 10
  }
})
