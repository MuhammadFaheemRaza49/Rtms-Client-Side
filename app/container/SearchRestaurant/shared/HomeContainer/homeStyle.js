import {StyleSheet} from 'react-native'
import Color from "../../../../common/Color";


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row:{
        flexDirection: "row",
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
  rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rowHorizantalCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    colCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    colVerticalCenter: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    dialogBackground: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    divide:{
        height: 1,
        backgroundColor: Color.borderGrey
    },
    dialogContainer: {
      padding: 20,
      width: 0,
      flexGrow: 1,
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 20
    }
})

export default styles
