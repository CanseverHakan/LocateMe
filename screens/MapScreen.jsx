import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { addMarker } from '../reducers/inputValue';
import * as Location from 'expo-location';

export default function MapScreen() {
    const dispatch = useDispatch()
    const [currentPosition, setCurrentPosition] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [markers, setMarkers] = useState([])

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
            } catch (error) {
                console.error('Error getting location:', error)
            }
        })()
    }, [])

    const initialRegion = {
        latitude: currentPosition ? currentPosition.latitude : 48.85792255731739,
        longitude: currentPosition ? currentPosition.longitude : 2.2952699983317975,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const handleLongPress = (event) => {
        const { coordinate } = event.nativeEvent
        setMarkers([...markers, coordinate])
        dispatch(addMarker(coordinate))
      }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion} onLongPress={handleLongPress}>
                {currentPosition && <Marker coordinate={currentPosition} title="Position" />}
                {markers.map((marker, index) => (
                    <Marker key={index} coordinate={marker} title={`Marker ${index + 1}`} />
                ))}
            </MapView>
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
});