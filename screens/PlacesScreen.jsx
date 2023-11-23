import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCity, removeCity } from '../reducers/inputValue';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function PlacesScreen() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.input.value)
  const markers = useSelector((state) => state.input.value.markers)
  const [city, setCity] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAdd = () => {
    const regex = /^[0-9]/g;
    if (city.length === 0 || !city.trim() || city.match(regex)) {
      setErrorMsg('Please enter a valid city name!')
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.features.length === 0) {
          setErrorMsg('Enter a valid city!')
          return
        }

        const newCity = data.features[0].geometry.coordinates;
        const lat = newCity[1];
        const long = newCity[0];
        dispatch(addCity({ cityName: city, latitude: lat, longitude: long }))
        setCity('')
        setErrorMsg('')
      });
  };

  const handleRemove = (name) => {
    dispatch(removeCity(name))
  }

  const cities = user.cities.map((city, index) => (
    <View style={styles.citiesCard} key={index}>
      <View>
        <Text>{city.cityName}</Text>
      </View>
      <View>
        <Text>LAT: {city.latitude} LON: {city.longitude}</Text>
      </View>
      <View>
        <FontAwesome
          name="trash-o"
          style={styles.icon}
          onPress={() => handleRemove(city.cityName)}
        />
      </View>
    </View>
  ))

  const marker = markers.map((marker, index) => (
    <View style={styles.citiesCard} key={index}>
      <View>
        <Text>Marker {index + 1}</Text>
      </View>
      <View>
        <Text>LAT: {marker.latitude} LON: {marker.longitude}</Text>
      </View>
    </View>
  ))

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{user.nickName}'s Places</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New City"
          onChangeText={(value) => setCity(value)}
          value={city}
        />
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.error}>{errorMsg.length > 0 && errorMsg}</Text>

      {cities}
      {marker}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'Pacifico_400Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '80%',
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
  },
  input: {
    width: '65%',
    borderBottomWidth: 1,
    borderBottomColor: '#B733D0',
    fontSize: 17,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#B733D0',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  citiesCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  icon: {
    color: '#B733D0',
    fontSize: 23,
  },
});
