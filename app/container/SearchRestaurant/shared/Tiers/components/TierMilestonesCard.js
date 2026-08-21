import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TextElement from '../../../../ComponentsV2/text/Text';
import SvgColorComponent from '../../../../../common/SvgColorComponent';
import {Color} from '../../../../../common';


const TierMilestonesCard = React.memo(({tier, t, theme, tier_progress}) => {
    const progressPercent = Math.min(100, tier_progress?.progressPercent || 0);

    const totalRequired = tier?.tierMilestones?.reduce(
        (sum, milestone) => sum + (milestone?.required_count || 0),
        0
    );


    return (
        <View
            style={[styles.bannerGradient, {
                experimental_backgroundImage: `linear-gradient(to right, ${tier.extra_info.theme_color}, ${tier.extra_info.theme_color_secondary})`
            }]}
        >


            <View style={[styles.rowCenter, {padding: 12,}]}>

                <View style={styles.bannerCol1}>
                    <TextElement h3 bold style={{color: Color.darkBlueText}}>
                        {t('tier:levelTo')}
                        {'\n'}
                        {t('inBus:bookme')} {tier.title}
                    </TextElement>

                    <View style={styles.rowCenter}>
                        <View style={styles.fullBar}>
                            <View style={[styles.statusBar, {width: `${progressPercent}%`}]}/>
                        </View>
                        <TextElement h7 medium h7Style={styles.progressText}>
                            <TextElement h7 medium h7Style={{color: Color.greyText}}>
                                {tier_progress?.current_progress}{' '}
                            </TextElement>
                            / {totalRequired}
                        </TextElement>
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={styles.bannerCol2}>
                    {tier?.tierMilestones?.map((milestone) => {
                        const progress =
                            tier_progress?.progressItems?.find(
                                p => p?.identifier === milestone?.identifier,
                            )?.current_progress || 0;

                        return (
                            <View style={styles.milestoneRow}>
                                <View style={[styles.rowCenter, {flex: 1, marginEnd: 15}]}>
                                    <SvgColorComponent
                                        svg_url={
                                            theme === 'light'
                                                ? milestone.icon_light
                                                : milestone.icon_dark
                                        }
                                        color={Color.darkBlueText}
                                        width={16}
                                        height={16}
                                    />
                                    <TextElement h7 medium style={styles.milestoneTitle}>
                                        {milestone?.title}
                                    </TextElement>
                                </View>
                                <TextElement h7 medium style={styles.milestoneProgress}>
                                    <TextElement h7 medium h7Style={{color: Color.greyText}}>
                                        {progress}{' '}
                                    </TextElement>
                                    / {milestone?.required_count}
                                </TextElement>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
});
export default TierMilestonesCard;
const styles = StyleSheet.create({

    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerGradient: {

        borderRadius: 6,
        marginTop: 8,

    },
    fullBar: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        backgroundColor: Color.white20,
        overflow: 'hidden',
        flexShrink: 1,
        marginTop: 8,
    },
    statusBar: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: Color.zinc900,
    },
    bannerCol1: {
        flexShrink: 1,
        flexBasis: '60%',
        paddingEnd: 15,
    },
    bannerCol2: {
        flexShrink: 1,
        flexBasis: '45%',
        paddingStart: 10,
    },
    divider: {
        height: '95%',
        backgroundColor: 'black',
        width: 0.7,
    },
    greyText: {
        color: Color.greyText,
        marginTop: 8,
    },
    progressText: {
        color: Color.zinc900,
        marginHorizontal: 5,
        marginTop: 6,
    },
    milestoneRow: {
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 3,
    },
    milestoneTitle: {
        color: Color.greyText,
        marginStart: 4,
        marginEnd: 10,
    },
    milestoneProgress: {
        color: Color.zinc900,
    },
})
