import React, {useContext} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import { Feather as Icon } from "@react-native-vector-icons/feather";
import InputBasic from './InputBasic';
import ViewLabel, {MIN_HEIGHT} from '../ViewLabel';
import {padding, margin} from '../config/spacing';
import {Color} from "../../../common";
import withLanguage from "../../../config/withLanguage";
import {Context} from "../../../config/LanguageProvider";
import {scale} from "../../../ScalingUtils";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecure: props.secureTextEntry,
      isHeading: props.value || props.defaultValue,
    };
    this.input = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        // isHeading: this.props.value,
      });
    }
  }

  handleFocus = data => {
    this.setState({isHeading: true});
    // if (this.props.onFocus) {
    //   this.input.focus(data);
    // }
  };
  onChange = value => {
    this.setState(
      {
        value,
      },
      () => {
        if (this.props.onChangeText) {
          this.props.onChangeText(value);
        }
      },
    );
  };

  handleBlur = data => {
    // const {isHeading} = this.state;
    // this.setState({isHeading: isHeading || (!this.input.current && this.input.current._lastNativeText)});
    // if (this.props.onBlur) {
    //
    //   this.input.onBlur(data);
    // }
    this.setState({isHeading: false});
    // console.log(this.input.current.isFocused())
  };

  render() {
    const {
      label,
      error,
      secureTextEntry,
      style,
      multiline,
      placeholderTextColor,
      isDark=true,
      maxLength=60,
      colors,
      ...rest
    } = this.props;

    const {isSecure, isHeading} = this.state;

    return (
      <ViewLabel
          isDark={isDark}
          label={label}
          value={this.props.value}
          error={error}
          isFocus={this.props.editable===false?false:isHeading}
          isHeading={isHeading}>
        <View style={[styles.viewInput]}>
          <InputBasic
            {...rest}
            isDark={isDark}
            inputRef={this.input}
            testID="RN-text-input"
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            secureTextEntry={isSecure}
            multiline={multiline}
            maxLength={maxLength}
            placeholderTextColor={placeholderTextColor}
            style={[
              this.props.editable===false&&{backgroundColor:"rgba(184, 180, 182, .36)"},
              styles.input,
              !multiline && {
                height: MIN_HEIGHT,
                borderRadius:10,
              },
              style && style,
            ]}
          />
          {secureTextEntry && (
            <Icon
              name={isSecure ? 'eye' : 'eye-off'}
              color={isSecure ? Color.regular_text_color : Color.primary}
              size={15}
              // containerStyle={styles.viewIcon}
              style={styles.icon}
              // underlayColor="transparent"
              onPress={() =>
                this.setState({
                  isSecure: !isSecure,
                })
              }
            />
          )}
        </View>
       </ViewLabel>
    );
  }
}

const styles = StyleSheet.create({
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: padding.large,
    fontSize:scale(13),

    paddingTop:Platform.OS==='ios'?10:14,


  },
  viewIcon: {
    marginRight: margin.large,
  },
  icon: {
    paddingVertical: padding.base,
    marginRight: margin.large,
  },
});

export default Input
