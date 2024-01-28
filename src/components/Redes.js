import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Linking } from 'react-native';
import * as Font from 'expo-font';
import { useEffect } from 'react';

const Redes = (props) =>{
    const {twitter, instagram} = props;
    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf'),
      });
    };

    const abrirInstagram = () => {
        const nomeUsuario = instagram; // Substitua pelo nome de usuário desejado
      
        // Verifica se o Instagram está instalado no dispositivo
        Linking.canOpenURL(`instagram://user?username=${nomeUsuario}`)
          .then((supported) => {
            if (supported) {
              // Se o Instagram estiver instalado, abre o aplicativo do Instagram
              return Linking.openURL(`instagram://user?username=${nomeUsuario}`);
            } else {
              // Se o Instagram não estiver instalado, abre o perfil no navegador
              return Linking.openURL(`https://www.instagram.com/${nomeUsuario}`);
            }
          })
          .catch((err) => console.error('Erro ao abrir o Instagram:', err));
    };

    const abrirTwitter = () => {
        const nomeUsuario = twitter; // Substitua pelo nome de usuário desejado
      
        // Verifica se o Twitter está instalado no dispositivo
        Linking.canOpenURL(`twitter://user?screen_name=${nomeUsuario}`)
          .then((supported) => {
            if (supported) {
              // Se o Twitter estiver instalado, abre o aplicativo do Twitter
              return Linking.openURL(`twitter://user?screen_name=${nomeUsuario}`);
            } else {
              // Se o Twitter não estiver instalado, abre o perfil no navegador
              return Linking.openURL(`https://twitter.com/${nomeUsuario}`);
            }
          })
          .catch((err) => console.error('Erro ao abrir o Twitter:', err));
    };

    useEffect(() => {
      const buscaFontes = async ()=>{
        await fetchFonts();
        setFontLoaded(true);
      }
      buscaFontes();

    }, []);

    return(
        <ScrollView horizontal id='redes' style={styles.redes}>
            <Button textColor='rgba(0,0,0, 0.8)' icon="twitter" onPress={()=>abrirTwitter()}><Text style={{fontFamily: 'CircularSpotifyText-Book'}}>{twitter}</Text></Button>
            <Button textColor='rgba(0,0,0, 0.8)' icon="instagram" onPress={()=>abrirInstagram()}><Text style={{fontFamily: 'CircularSpotifyText-Book'}}>{instagram}</Text></Button>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    redes: {
      marginRight: 50,
      marginLeft: 8,
      flexDirection: 'row',
    },
})

export default Redes;