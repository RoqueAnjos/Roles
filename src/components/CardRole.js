// ItemCard.js
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const CardRole = ({ mix, usuario, tela }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [userLiked, setUserLiked] = useState(false);

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
        /*
        if(mix.curtidas.includes(usuario)){
            setUserLiked(true);
        }
        */
    }, []);

    if (!fontLoaded) {
        return (null
        );
    }

    const convertToDate = (variavel) =>{
        const segundos = variavel.seconds;
        const nanossegundos = variavel.nanoseconds;
    
        // Crie um objeto Date a partir de segundos e milissegundos
        const newDate = new Date(segundos * 1000 + nanossegundos / 1000000);

        return `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`
    }

    return (
        <Card style={[tela==='radar'? {width: 300, marginHorizontal: 8} : {width: 180, marginHorizontal:5}]} mode="contained">
            <Card.Cover style={[{margin:15}, tela==='pesquisa' ? {width:150, height: 120} : null]} source={mix.image!==undefined? { uri: mix.image }: {uri: mix.imagens[0]}} />
            <Card.Title style={{marginTop: -20}} titleStyle={{fontFamily:'CircularSpotifyText-Bold'}} title={mix.titulo} />
            <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -15 }}>
                    <FontAwesome name="calendar" size={13} color="black" style={{ marginRight: 8, marginBottom:2 }} />
                    <Text style={[styles.name, {fontSize: 13}]}>{convertToDate(mix.quando)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="map-marker" size={20} color="black" style={{ marginRight: 8, marginBottom:2 }} />
                    <Text style={[styles.name, {fontSize: 13}]}>{mix.local}, {mix.cidade} - {mix.estado}</Text>
                    
                </View>
                {tela==='radar' ? <Text style={[styles.name, {marginTop:10}]}>{mix.descrição}</Text> : null}

                
            </Card.Content>
            
            <Card.Actions style={{alignSelf: 'center'}}>
                {tela==='radar' ? 
                <Button onPress={()=>console.log('Press')} 
                    icon={({ size, color }) => (  
                    userLiked ? 
                    <Image
                        source={require('../images/v-live_21117251111.png')}
                        style={{ width: size-1, height: size-1 }}
                    />
                    :
                    <Image
                        source={require('../images/v-live_211172511111111.png')}
                        style={{ width: size-1, height: size-1 }}
                    />
                    )}                
                >
                    <Text style={styles.name}>100</Text>
                </Button>
                    :null
                }
                <Button>Abrir</Button>
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

export default CardRole;
