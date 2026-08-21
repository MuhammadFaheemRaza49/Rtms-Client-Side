import {StyleSheet} from 'react-native'
import {scale} from '../../../../ScalingUtils'
import {Constants} from '../../../../common'
import Color from '../../../../common/Color'

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        },
        logo: {
            height: scale(40),
            width: scale(60),
            resizeMode: 'contain',
            backgroundColor: '#f7f7f7',
            borderRadius: 10
        },
        space_between: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'

        },
        rowAlign: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        row: {
            flexDirection: 'row',
        },
        columnAlign: {
            flexDirection: 'column',
            // alignItems: 'center',
        },
        spliter: {
            height: 0.7,
            backgroundColor: Color.borderColor3
        },
        shadow: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
            backgroundColor: '#fff',
            margin: 3,
            borderRadius: 8
        },
        hh: {
            fontFamily: Constants.fontFamilyBold,
            fontSize: 16,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        hh2: {
            fontFamily: Constants.fontFamilyBold,
            fontSize: 14,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        hh4: {
            fontFamily: Constants.fontFamilyBold,
            fontSize: 10,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        h: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 16,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        h1: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 14,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        h2: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 12,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        h3: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 12,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        h4: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 11,
            includeFontPadding: false,
            letterSpacing:-0.5,
        },
        grey10: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 10,
            includeFontPadding: false,
            color: Color.greyText,
            letterSpacing:-0.5,
        },
        grey8: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 8,
            includeFontPadding: false,
            color:Color.greyText,
            letterSpacing:-0.5,
        },
        grey7: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 7,
            includeFontPadding: false,
            color: Color.greyText,
            letterSpacing:-0.5,
        },
        grey9: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 9,
            includeFontPadding: false,
            color: Color.greyText,
            letterSpacing:-0.5,
        },
        grey14: {
            fontFamily: Constants.fontFamilyBold,
            fontSize: 14,
            includeFontPadding: false,
            color: Color.greyText,
            letterSpacing:-0.5,
        },
        grey12: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 12,
            includeFontPadding: false,
            color:  Color.greyText,
            letterSpacing:-0.5,
        },
        medium_grey11: {
        fontFamily: Constants.fontFamilyRegular,
        fontSize: scale(11),
        includeFontPadding: false,
        color:  Color.greyText,
        letterSpacing:-0.5,
          fontWeight: 400,
          fontStyle:'normal'
        },
        black8: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 8,
            includeFontPadding: false,
            letterSpacing:-0.5,

        },
        black10: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 10,
            includeFontPadding: false,
            letterSpacing:-0.5,
            // color: '#000'
        },
        black12: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 12,
            letterSpacing:-0.5,
            includeFontPadding: false
            // color: '#000'
        },
        white10: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 10,
            letterSpacing:-0.5,
            includeFontPadding: false,
            color: '#fff'
        },
        white8: {
            fontFamily: Constants.fontFamilyRegular,
            fontSize: 8,
            includeFontPadding: false,
            letterSpacing:-0.5,
            color: '#fff'
        },
        primary12: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 12,
            includeFontPadding: false,
            letterSpacing:-0.5,
            color: Color.primary
        },
        primary10: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 10,
            includeFontPadding: false,
            letterSpacing:-0.5,
            color: Color.primary
        },
        primary8: {
            fontFamily: Constants.fontFamilyMedium,
            fontSize: 8,
            includeFontPadding: false,
            letterSpacing:-0.5,
            color: Color.primary
        },
        card: {
            elevation: 3,
            margin: 3,
            shadowRadius: 5,
            shadowOpacity: 0.2,
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 2
            }
        }
    }
)

export default styles
