import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Context} from '../../config/LanguageProvider';

const isLiquidGlassSupported = false;

const GlassView = ({
    children,
    style,
    effect = 'regular',
    interactive = false,
    tintColor,
    fallbackStyle,
    ...rest
}) => {
    const {
        value: {themeColor},
    } = useContext(Context);
    const isDark = themeColor?.key === 'dark';
    const colors = themeColor?.colors ?? {};

    return (
        <View
            style={[
                {
                    backgroundColor: isDark
                        ? 'rgba(17, 24, 39, 0.96)'
                        : 'rgba(255, 255, 255, 0.96)',
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.borderColor,
                },
                style,
                fallbackStyle,
            ]}
            {...rest}>
            {children}
        </View>
    );
};

/**
 * Groups nearby GlassView children so their glass shapes merge together
 * when close (native effect on iOS 26+). Renders a plain View elsewhere.
 */
export const GlassContainer = ({children, spacing, style, ...rest}) => {
    return (
        <View style={style} {...rest}>
            {children}
        </View>
    );
};

export {isLiquidGlassSupported};
export default GlassView;
