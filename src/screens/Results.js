import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import Constants from 'expo-constants';
import screensStyles from '../styles/ScreensStyles';
import { MyCard } from '../components/MyCard';
import axios from 'axios';

const BANKS = [
    {
        id: '1',
        name: 'TD BANK',
        confidence: '88',
        quote: '1'
    },
    {
        id: '2',
        name: 'AVIVA',
        confidence: '88',
        quote: '2'
    },
    {
        id: '3',
        name: 'SCOTIABANK',
        confidence: '88',
        quote: '3'
    },
    {
        id: '4',
        name: 'SUNLIFE',
        confidence: '88',
        quote: '4'
    },
    {
        id: '5',
        name: 'INTACT',
        confidence: '88',
        quote: '1'
    },
]



const Results = (props) => {


    const { navigate } = props.navigation

    const payload = JSON.stringify(props.navigation.getParam('inputData', 'NO-Data'))

    const [dataFromServer, setDataFromServer] = useState({ data: null, loading: true })
    const baseURL = 'https://carsurance.appspot.com/postjson';
    // const baseURL = 'http://localhost:5000/postjson/';


    useEffect(() => {
        axios.post(baseURL, payload).then((res) => {
            const newData = res.data.sort((a, b) => {
                var x = a.quote; var y = b.quote;
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
            setDataFromServer({ data: newData, loading: false })
        }).catch((err) => console.log(err))
    }, [])

    const onSelect = React.useCallback(({ name, confidence, quote, onSelect, selected, uri }) => {
        navigate('ViewScreen', { name, confidence, quote, uri })
    }, [])

    return (
        dataFromServer.loading ? <View style={[styles.container, styles.horizontal]}><ActivityIndicator size="large" color="#0000ff"></ActivityIndicator></View> :

            <>
                <View style={screensStyles.ScreenWrapper}>

                    <View style={screensStyles.ScreenMainPage}>

                        <Text style={{ fontSize: 40, textAlign: 'center', padding: 20, marginTop: 20 }} >Results</Text>
                        <View style={[screensStyles.ScreenButtom, { alignItems: 'center' }]}>
                            <View style={{ flex: 1 }}>
                                <SafeAreaView style={{ width: 400 }}>
                                    <FlatList
                                        data={dataFromServer.data}
                                        renderItem={({ item }) =>
                                            <MyCard
                                                uri={item.uri}
                                                name={item.name}
                                                confidence={item.confidence}
                                                quote={item.quote}
                                                onSelect={onSelect}
                                                selected={item.selected}
                                            />}
                                    />
                                </SafeAreaView>

                            </View>
                            <TouchableOpacity
                                style={[screensStyles.Button, { backgroundColor: '#70CE9B', marginBottom: 30, marginTop: 30 }]}
                                title="Submit"
                                onPress={() => { navigate("LandingPage") }}>
                                <Text>Re-calculate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </>
    )
}

const styles = StyleSheet.create({
    statusBar: {
        height: Constants.statusBarHeight,
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
});

export default Results

