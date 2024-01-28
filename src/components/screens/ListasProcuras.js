import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import { Searchbar } from 'react-native-paper';

const ListasProcuras = ({ route }) => {
  const { array } = route.params;
  const arrayOrdenado = array.sort();

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
      'CircularSpotifyText-Book': require('../../../assets/fonts/CircularSpotifyText-Book.otf'),
      'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
      'CircularSpotifyText-Medium': require('../../../assets/fonts/CircularSpotifyText-Medium.otf'),
    });
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  return (
    <View>
      <Searchbar
          style={{marginTop:5}}
          placeholder="Procurar"
          onChangeText={onChangeSearch}
          value={searchQuery}
      />
      
      <FlatList
        style={{marginBottom:15}}
        data={arrayOrdenado}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text style={{fontSize: 17, fontFamily: 'CircularSpotifyText-Light'}}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ListasProcuras;
