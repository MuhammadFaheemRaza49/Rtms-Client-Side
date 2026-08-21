import React, {useContext} from "react";
import {Context} from "../../../../../config/LanguageProvider";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Search} from "lucide-react-native"
import TextElement from "../../../../ComponentsV2/ComponentsV2/text/Text";

const SearchButton = ({onPress,containerStyle,bgColor=undefined,iconColor=undefined, btnText=null}) => {
  const { value: { themeColor: { colors } } } = useContext(Context)


  const resolveIconColor= iconColor??colors.blueIconColor
  const backgroundColor=bgColor??colors.primaryWhiteBtn

  return (
      <TouchableOpacity
          style={[styles.container, containerStyle,{backgroundColor:backgroundColor}]}
          onPressIn={onPress}>
           <Search size={20} strokeWidth={2} color={resolveIconColor}  />
          {
              btnText &&
              <TextElement h3 medium h3Style={{color: resolveIconColor}}>{btnText}</TextElement>
          }
      </TouchableOpacity>


  );
};

const styles = StyleSheet.create({

  container:{
      flexDirection:'row',
    alignItems: "center",
    justifyContent:'center',
    paddingHorizontal:15,
    marginTop:10,
    borderRadius:8,
      gap:5,
  }

});

export default SearchButton;
