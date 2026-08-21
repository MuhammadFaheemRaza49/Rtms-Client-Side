import React, { useContext } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import Text from './text/Text'
import { margin, padding, borderRadius } from './config/spacing'
import fonts, { sizes, lineHeights } from './config/fonts'
import { Color, Constants } from '../../common'
import { Context } from '../../config/LanguageProvider'
import { lightTheme } from '../../common/Color'

const MIN_HEIGHT = 50
const TOP = 3
const BOTTOM = margin.base - 6
// const MIN_HEIGHT = 50
// const TOP = 4
// const BOTTOM = margin.base - 8

class ViewLabel extends React.Component {
  UNSAFE_componentWillMount () {
    this._animatedIsFocused = new Animated.Value(this.props.isHeading ? 1 : 0)
  }

  componentDidUpdate () {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.props.isHeading || this.props.value ? 1 : 0,
      duration: 120,
      useNativeDriver: false
    }).start()
  }

  render () {
    const {
      label,
      error,
      children,
      colors,
      backgroundColor=undefined,
      borderColor=colors.borderColor2,
      borderRadius=undefined
    } = this.props
    const paddingHorizontal = padding.large - margin.small
    const topCenter = (MIN_HEIGHT - lineHeights.base) / 2
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [topCenter, TOP]
      }),
      ...fonts.regular,
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [sizes.base, 10]
      }),
      lineHeight: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [lineHeights.base, 15]
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? Color.red : colors.greyText, error ? Color.red : this.props.isFocus ? Color.primary : colors.white]
      }),
      zIndex: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 9999]
      }),
      // backgroundColor: '#f7f7f7',
      paddingHorizontal: paddingHorizontal,
      marginHorizontal: margin.small
    }

    const activeStyle = { borderWidth: 2, borderColor: colors.blueIconColor }
    const errorStyle = { borderRadius:borderRadius??9,borderColor: Color.red }
    const defaultStyle = { borderColor: colors.borderColor2,backgroundColor:backgroundColor??colors.bgSecondaryColor};
    const styless = error ? errorStyle : this.props.isFocus ? activeStyle : defaultStyle
    return (
      <>
        <View
          style={[
            styles.container,
            styless
          ]}>
          {typeof label === 'string'
            ? (<Animated.Text style={[labelStyle]} numberOfLines={1}>
              {label}
            </Animated.Text>)
            : null}
            <View style={{ marginTop: 2 }}>
          {children}
            </View>
        </View>
        {typeof error === 'string'
          ? (
          <Text
            style={[
              styles.textError,
              {
                color: Color.red
              }
            ]}>
            {error}
          </Text>
            )
          : null}
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: MIN_HEIGHT,
    borderWidth: 1,

    borderRadius: borderRadius.base + 5,
    marginTop: TOP,
    marginBottom: BOTTOM
  },
  textError: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: BOTTOM,
    fontFamily: Constants.fontFamilyMedium
  }
})

ViewLabel.defaultProps = {
  isHeading: false,
  visit: 'center'
}

const ViewLabell = ({ isDark = true, ...rest }) => {
  const { value: { themeColor: { colors: theme } } } = useContext(Context)
  const colors = isDark ? theme : lightTheme.colors
  return (
      <ViewLabel {...rest} colors={colors}/>
  )
}

export default ViewLabell
export { MIN_HEIGHT }
