import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addName } from '../reducers/inputValue';

import { useFonts } from "expo-font";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";


export default function HomeScreen({ navigation }) {
    const dispatch = useDispatch();
    const [nickName, setNickname] = useState('')
    const [fontsLoaded] = useFonts({
        Pacifico_400Regular
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    const handlePress = () => {
        if (nickName.length === 0 || !nickName.trim()) {
            setErrorMsg('Please enter a nickname !')
            return;
        }
        dispatch(addName(nickName));
        navigation.navigate('TabNavigator')
    }


    return (
        <View style={styles.container}>
            <Image
                style={styles.imageHome}
                source={require('../assets/home-image.png')}>
            </Image>
            <Text style={styles.titleHome}>Welcome to Locate Me</Text>
            <View>
                <TextInput style={styles.input} placeholder='Nickname' onChangeText={(value) => setNickname(value)} value={nickName}></TextInput>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
                <View>
                    <Text style={styles.textButton}>Go to Map</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageHome: {
        width: '100%',
        height: '60%',
    },
    titleHome: {
        fontSize: 35,
        fontFamily: 'Pacifico_400Regular',
    },
    input: {
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: '#B733D0',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 12,
        width: '80%',
        backgroundColor: '#B733D0',
        borderRadius: 12,
    },
    textButton: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
});
