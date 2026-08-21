import {CircleArrowLeft, CircleArrowRight,} from 'lucide-react-native';
import Color from '../../../common/Color';
import {useSelector} from 'react-redux';

const CircularArrowLTRComponent = ({onPress=undefined,style,size=24, color = undefined,strokeWidth=1.5}) => {
  const language = useSelector(state => state.app.languagee);

  const IconComponent = language?.rtl ? CircleArrowRight  :CircleArrowLeft ;

  return (
    <IconComponent
      strokeWidth={strokeWidth}
      size={size}
      onPress={onPress}
      color={color ?? Color.white}
      style={[{paddingEnd: 5,}, style]}
    />
  );
};

export default CircularArrowLTRComponent;
