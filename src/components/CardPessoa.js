// ItemCard.js
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const CardPessoa = ({ navigation, mix}) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    const fetchFonts = () => {
        return Font.loadAsync({
          'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
          'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf'),
          'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
          'CircularSpotifyText-Medium': require('../../assets/fonts/CircularSpotifyText-Medium.otf'),
          'CircularSpotifyText-MediumItalic': require('../../assets/fonts/CircularSpotifyText-MediumItalic.otf'),
          'CircularSpotifyText-BookItalic': require('../../assets/fonts/CircularSpotifyText-BookItalic.otf'),
          'CircularSpotifyText-BlackItalic': require('../../assets/fonts/CircularSpotifyText-BlackItalic.otf'),
        });
    };

    useEffect(() => {
        const acessaFontes = async () =>{
            await fetchFonts();
            setFontLoaded(true);
        }
      
        acessaFontes();
    }, []);

    if (!fontLoaded) {
        return (null
        );
    }

    const abrePerfilPessoa = (idPessoa)=>{
        navigation.navigate('PerfilPessoa', {idPessoa: idPessoa})
    }
    
    return (
        <Card style={{width: 150, marginHorizontal:5}} mode="contained">
            <Card.Cover style={{width:135, height: 120, alignSelf: 'center', marginTop: 5}} source={{uri: mix.imagemPerfil}}/>
            <Card.Title titleStyle={{alignSelf: 'center', fontFamily:'CircularSpotifyText-Bold'}} title={mix.nome} />
            
            <Card.Actions style={{alignSelf: 'center', marginTop: -20}}>
                <IconButton 
                    icon="account-plus"
                    iconColor={'#000'}
                    size={23}
                    onPress={() => console.log('Pressed')}
                 />

                <Button onPress={()=>abrePerfilPessoa(mix.uid)}>Abrir</Button>
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  name: {
    fontFamily: 'CircularSpotifyText-Book'
  },
});

export default CardPessoa;
