import React, {useEffect, useState} from 'react'
import {Animated} from 'react-native'


const FadeAnimation = (props) => {
    const [fadeAnim] = useState(new Animated.Value(0.4))

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        )
        animation.start()
        return () => animation.stop()
    }, [fadeAnim])

    return (
        <Animated.View style={{ ...props.style, opacity: fadeAnim }}>
            {props.children}
        </Animated.View>
    )
}
export default FadeAnimation