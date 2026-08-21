
import React,{memo, useContext} from 'react';
import {Context} from '../../../../../config/LanguageProvider';
import {TouchableOpacity} from 'react-native';

const FilterButtonComponent = memo(
  ({
     selected = false,
     fillColor = false,
     onPress,
     style,
     icon,
     disabled = false,
     isUmrah = false,
   }) => {
    const {
      value: {
        themeColor: {colors},
      },
    } = useContext(Context);

    return (
      <TouchableOpacity
        style={[
          {
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: selected
              ? isUmrah
                ? colors.umrahTextChip
                : colors.blueIconColor
              : colors.borderColor2,
            backgroundColor: fillColor ? fillColor : colors.bgColorWhite,
          },
          style,
        ]}
        onPress={onPress}
        disabled={disabled}>
        {icon && icon}
      </TouchableOpacity>
    );
  },
);
export default FilterButtonComponent
