import {StyleSheet} from "react-native";
import {Color} from "../../../../common";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    row:{
      flexDirection:'row',
    },
    rowAlign:{
        flexDirection:'row',
        alignItems:"center",
    },
    block: {
        borderRadius: 10
    },
    rowItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    blueAreaWithBorder: {
        backgroundColor: 'rgba(55, 118, 244, 0.1)',
        borderRadius: 10,
        // paddingVertical: 5,
        borderWidth: 1,
        borderColor: Color.primary,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
})
export default Styles
