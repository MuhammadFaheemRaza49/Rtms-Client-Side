import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import Color from '../../../common/Color';
import {useSelector} from 'react-redux';

const BackIcon = ({
  strokeWidth=1.5,
                    onPress = undefined,
  style,
  size = 24,
  color = undefined,
}) => {
  const language = useSelector(state => state.app.languagee);

  const IconComponent = language?.rtl ? ChevronRight : ChevronLeft;

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      onPress={onPress}
      color={color ?? Color.white}
      style={[{paddingEnd: 5, marginEnd: 5}, style]}
    />
  );
};

export default BackIcon;
