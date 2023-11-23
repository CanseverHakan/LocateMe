import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { addMarker } from '../reducers/inputValue';
import * as Location from 'expo-location';

export default function MapScreen() {
    const dispatch = useDispatch()
    const [currentPosition, setCurrentPosition] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [markers, setMarkers] = useState([])
    const [city, setCity] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [currentMarker, setCurrentMarker] = useState(null);
    const [markerName, setMarkerName] = useState('');

    console.log(city)

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied')
                    return;
                }
                let location = await Location.getCurrentPositionAsync({})
                setCurrentPosition({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                })
                let geoInfo = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                if (geoInfo && geoInfo.length > 0) {
                    setCity(geoInfo[0].city);
                }
            } catch (error) {
                console.error('Error getting location:', error)
            }
        })()
    }, [])


    const initialRegion = {
        latitude: currentPosition ? currentPosition.latitude : 48.85831098110776,
        longitude: currentPosition ? currentPosition.longitude : 2.34785338589706,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const handleLongPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setCurrentMarker(coordinate);
        setModalVisible(true);
    }

    const handleModalClose = () => {
        setModalVisible(false);
        setMarkerName('');
    }

    const handleMarkerSubmit = () => {
        const markerWithDetails = { ...currentMarker, name: markerName };
        setMarkers([...markers, markerWithDetails]);
        dispatch(addMarker(markerWithDetails));
        setModalVisible(false);
        setMarkerName('');
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion} onLongPress={handleLongPress}>
                {currentPosition && <Marker coordinate={currentPosition} title="Position" />}
                {markers.map((marker, index) => (
                    <Marker key={index} coordinate={marker} title={marker.name || `Marker ${index + 1}`} />
                ))}
            </MapView>
            <Modal transparent={true} visible={modalVisible} animationType="slide">
                <View style={styles.modalMain}>
                    <View style={styles.modale}>
                        <TextInput
                            style={styles.modalText}
                            placeholder="Enter marker name"
                            value={markerName}
                            onChangeText={(text) => setMarkerName(text)}
                        />
                        <View style= {styles.button}>
                            <Button title="Submit" onPress={handleMarkerSubmit} />
                            <Button title="Cancel" onPress={handleModalClose} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    modalMain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: ' 100%',
    },
    modale: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: ' 60%',
        height: '30%',
        backgroundColor: 'grey',
        alignItems: 'center',
        borderRadius: 15,
        gap: 10,
    },
    modalText: {
        width: 150,
        height: 40,
        backgroundColor: 'white'
    },
    button: {
        gap: 10,
        width: 120,
    }
})