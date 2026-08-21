import React, { useContext, useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import BusSearchItem from './BusSearchItem'
import Block from '../../components/Block'
// import globals from '../../../../globals'

import AdsComponent from "../shared/Ads/Index";
import EmptyInfo from "../shared/BusesV2/EmptyInfo";
import { Context } from "../../../config/LanguageProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FasterTravelWrapper from "./FasterTravelWrapper";
import ListingItem from "../shared/AirlineV2/components/ListingItem";
import { Host, Portal } from "react-native-portalize";
import BottomSheet from "../../BottomSheet/NewGorhomBS";
import FareCardsComponent from "../shared/AirlineRevamp/components/FareCardsComponent";
import { getFares, getMergedLegs, getSingleItinerary } from "../../../redux/airline/operations";
import { useDispatch, useSelector } from "react-redux";
import { saveAirlineObj, saveProgressCount } from "../../../redux/airline/actions";
import { airlineFlow } from "../../../navigation/NavigationPath";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../components/Loading";
import { Color } from "../../../common";


const TimesList = ({
    airlineList = [],
    onReload,
    twoWay = 0,
    busTimes,
    airlineObj = null,
    modification = undefined,
    onPress,
}) => {
    const { value: { t } } = useContext(Context)
    const insets = useSafeAreaInsets()
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // ─── Refs ────────────────────────────────────────────────────────────────
    const abortRef = useRef(null);
    const fareBSRef = useRef(null);
    const isMountedRef = useRef(true);           // FIX #2 – guard async setState

    // ─── Redux ───────────────────────────────────────────────────────────────
    const accessToken = useSelector(state => state.airline.accessToken);

    // ─── Local state ─────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [data, setData] = useState(null);
    const [flight, setFlight] = useState(null);

    // ─── Lifecycle ───────────────────────────────────────────────────────────

    // FIX #2 + FIX #3 – mark unmounted & abort any in-flight request
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            abortRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        globals.FirebaseEventsNew('BusTimes');
    }, []);

    useEffect(() => {
        if (!airlineList || !Array.isArray(airlineList) || airlineList.length === 0) return;
        setFlight(airlineList[0]);
    }, [airlineList]);

    // FIX #1 – open sheet via ref; don't conditionally mount the Portal
    useEffect(() => {
        if (selectedItem) {
            fareBSRef.current?.open();
        }
    }, [selectedItem]);

    // ─── Navigation ──────────────────────────────────────────────────────────

    const handleMore = () => {
        dispatch(saveAirlineObj(undefined));
        setTimeout(() => {
            navigation.navigate(airlineFlow.main_stack, {
                screen: airlineFlow.search_list,
                params: { SearchData: airlineObj },
            });
        }, 100);
    };

    // ─── Render item ─────────────────────────────────────────────────────────

    // FIX #5 – include all values consumed inside the callback in deps
    const renderItem = React.useCallback(
        ({ item, index }) => {
            const handlePress = () => onPress(item);

            const content = (
                <BusSearchItem
                    modification={modification}
                    index={index}
                    item={item}
                    onPress={handlePress}
                />
            );

            if (index === 0) {
                return (
                    <>
                        {content}
                        <AdsComponent screen="bus" child="list" />
                    </>
                );
            }

            if (index === 1 && airlineList?.length > 0) {
                return (
                    <>
                        {content}
                        <FasterTravelWrapper
                            onMoreFlights={handleMore}
                            moreFlightsCount={airlineList.slice(0, 1)?.length}>
                            <ListingItem
                                isRecommended={false}
                                showCheapest={false}
                                otherSequences={[]}
                                selectedSequence={[]}
                                currentSequence={0}
                                onReload={onReload}
                                isError={isError}
                                isFareChanged={item?.isFareChanged}
                                isSelectionEnabled={true}
                                onClickTag={() => { }}
                                data={data}
                                onPress={() => onPress(data)}
                                onClickItem={() => onItemClick(flight)}
                                key={flight?.RefID}
                                item={flight}
                                t={t}
                            />
                        </FasterTravelWrapper>
                    </>
                );
            }

            return content;
        },
        // FIX #5 – data, isError, loading were missing from the original deps
        [busTimes, flight, data, isError, loading],
    );

    // ─── Key extractor ───────────────────────────────────────────────────────

    // FIX #4 – never return undefined; fall back through multiple candidates
    const renderKeyExtractor = React.useCallback(
        (item, index) =>
            item.id?.toString() ??
            item.RefID?.toString() ??
            index.toString(),
        [],
    );

    // ─── Async helpers ───────────────────────────────────────────────────────

    function safeSet(setter, value) {
        // FIX #2 – only update state when still mounted
        if (isMountedRef.current) setter(value);
    }

    function updateDataAndState(item, isLoading = false) {
        safeSet(setLoading, isLoading);
        safeSet(setData, {
            itinerary: { RefID: item.RefID, MainRefID: item.MainRefID },
            flights: { ...item?.Flight, selectedFare: item?.Flight?.Fares?.[0] },
        });
        safeSet(setSelectedItem, item.RefID);
    }

    function getDynamicItemFare(item) {
        safeSet(setLoading, true);
        safeSet(setIsError, false);

        const params = { RefID: item?.MainRefID, ItineraryRefID: item?.RefID };
        const obj = { itinerary: { MainRefID: item?.MainRefID, RefID: item?.RefID } };

        safeSet(setData, obj);
        safeSet(setSelectedItem, item.RefID);

        // FIX #3 – store & reuse the controller so we can abort on unmount
        const controller = new AbortController();
        abortRef.current = controller;

        globals.FirebaseEventsWithData('DynamicFareItemAirline', { data: params });

        dispatch(getFares(accessToken, params, controller))
            .then(res => {
                if (!isMountedRef.current) return;           // FIX #2

                if (res?.Itinerary) {
                    const obj = {
                        ...res.Itinerary,
                        MainRefID: res.RefID,
                        GetFares: false,
                        IsCached: item?.IsCached,
                        isFareChanged: item?.isFareChanged,
                    };
                    safeSet(setFlight, JSON.parse(JSON.stringify(obj)));
                    updateDataAndState(obj, false);
                } else if (!res?.cancelled) {
                    safeSet(setLoading, false);
                    safeSet(setIsError, true);
                    globals.FirebaseEventsWithData('AirlineDynamicFareError', { data: params });
                } else {
                    safeSet(setLoading, false);
                }
            })
            .catch(() => {
                if (!isMountedRef.current) return;           // FIX #2
                safeSet(setLoading, false);
                safeSet(setIsError, true);
            });
    }

    const onItemClick = (item) => {
        safeSet(setIsError, false);
        globals.FirebaseEventsWithData('AirlineItemExpand', { data: item });

        const controller = new AbortController();
        abortRef.current = controller;                       // FIX #3

        if (item?.IsCached) {
            safeSet(setLoading, true);
            globals.FirebaseEventsNew('AirlineItemCached');

            const params = { RefID: item.MainRefID, ItineraryRefID: item.RefID };
            safeSet(setData, { itinerary: { RefID: item.RefID, MainRefID: item.MainRefID } });
            safeSet(setSelectedItem, item.RefID);

            dispatch(getSingleItinerary(accessToken, params, controller))
                .then(response => {
                    if (!isMountedRef.current) return;       // FIX #2

                    if (response?.Itinerary) {
                        const obj = {
                            ...response.Itinerary,
                            MainRefID: response.RefID,
                            IsCached: item?.IsCached,
                            isFareChanged: response?.FareChanged,
                        };

                        if (response?.Itinerary?.GetFares) {
                            getDynamicItemFare(obj);
                        } else {
                            safeSet(setFlight, JSON.parse(JSON.stringify(obj)));
                            safeSet(setSelectedItem, obj?.RefID);
                            updateDataAndState(obj, false);
                        }
                    } else if (!response?.cancelled) {
                        safeSet(setLoading, false);
                        safeSet(setIsError, true);
                        globals.FirebaseEventsWithData('AirlineCachedItineraryError', { data: params });
                    } else {
                        safeSet(setLoading, false);
                    }
                })
                .catch(() => {
                    if (!isMountedRef.current) return;       // FIX #2
                    safeSet(setLoading, false);
                    safeSet(setIsError, true);
                });
        } else {
            fareCheckAndReplacingObject(item);
        }
    };

    function fareCheckAndReplacingObject(item) {
        if (item.GetFares) {
            getDynamicItemFare(item);
        } else {
            updateDataAndState(item);
        }
    }

    const onSelectValue = (value, item) => {
        safeSet(setData, prevData => ({
            flights: { ...value?.flight, selectedFare: value?.selectedFare },
            itinerary: item
                ? { RefID: item.RefID, MainRefID: item.MainRefID }
                : prevData?.itinerary,
        }));
    };

    // ─── mergeLegs ───────────────────────────────────────────────────────────

    const setReloadLoading = () => { };

    function mergeLegs() {
        safeSet(setLoading, true);

        const params = [{
            RefID: data?.itinerary?.MainRefID,
            ItineraryRefID: data?.itinerary?.RefID,
            FlightFare: data?.flights?.selectedFare?.RefID,
        }];

        dispatch(getMergedLegs(accessToken, params))
            .then(response => {
                if (!isMountedRef.current) return;           // FIX #2

                fareBSRef?.current?.close();
                safeSet(setLoading, false);

                if (response) {
                    const temp = response?.Itineraries[0]?.Flights;

                    const tempData = {
                        flights: temp.map(x => ({ ...x, selectedFare: x?.Fares[0] })),
                        itinerary: {
                            MainRefID: response?.RefID,
                            RefID: response?.Itineraries[0]?.RefID,
                        },
                    };

                    const fareChanged = response?.Itineraries
                        ?.flatMap(x => x.Flights)
                        .some(flight => flight.Fares?.some(fare => fare.DidFareChanged));

                    const obj = { ...airlineObj, selectedData: tempData };

                    dispatch(saveAirlineObj(obj));
                    dispatch(saveProgressCount(0));

                    navigation.navigate(airlineFlow.main_stack, {
                        screen: airlineFlow.itinerary_detail,
                        params: {
                            setReloadLoading,
                            priceUpdated: fareChanged,
                        },
                    });

                    globals.FirebaseEventsWithData('GotoFlightDetailScreen', { data: obj });
                }
            })
            .catch(() => {
                if (!isMountedRef.current) return;           // FIX #2
                fareBSRef?.current?.close();
                safeSet(setLoading, false);
            });
    }

    const handleOnFlightClick = () => mergeLegs();

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <Host>
            <Loading color={Color.primary} visible={loading} />

            <Block style={{ flex: 1, marginHorizontal: 5 }}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={() => (
                        <Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <EmptyInfo
                                title={t('General:emptyList')}
                                msg={t('General:emptyListMsg')}
                            />
                        </Block>
                    )}
                    extraData={selectedItem}
                    data={busTimes}
                    keyExtractor={renderKeyExtractor}   // FIX #4
                    renderItem={renderItem}
                    ListFooterComponent={<View style={{ height: insets.bottom }} />}
                />
            </Block>

            {/*
              FIX #1 – Portal is ALWAYS mounted.
              The sheet is opened/closed via fareBSRef.
              Only the *content* inside is conditionally rendered,
              which keeps the Portal's native view tag stable.
            */}
            <Portal>
                <BottomSheet
                    isBottomSafeArea={true}
                    onClosed={() => setSelectedItem(null)}
                    refRBSheet={fareBSRef}>
                    <View style={{ flex: 1 }}>
                        {flight && (
                            <FareCardsComponent
                                item={flight}
                                onPressDetail={() => { }}
                                onPress={handleOnFlightClick}
                                isLoading={loading}
                                data={data}
                                onReload={onReload}
                                isError={isError}
                                onSelect={value => onSelectValue(value, flight)}
                                selectedSequence={[]}
                                otherSequences={[]}
                                currentSequence={0}
                            />
                        )}
                    </View>
                </BottomSheet>
            </Portal>
        </Host>
    );
};



export default TimesList;