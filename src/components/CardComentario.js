import {Card, Text} from 'react-native-paper';
import { StyleSheet, View, Image } from 'react-native';
import { firebaseConfig } from '../../firebaseConfig';
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import * as Font from 'expo-font';

const CardComentario = ({ mix, index }) => {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [nome, setNome] = useState('');
    const [imagem, setImagem]= useState('');

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

    const acessaDadosUsuario = async() =>{
        const documentRef = doc(db, "users", mix.user);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists) {
            // O documento existe, você pode acessar seus campos
            const userData = documentSnapshot.data();

            setNome(await userData.nome);
            setImagem(await userData.imagemPerfil);
        }
    }

    useEffect(() => {
        fetchFonts();
        acessaDadosUsuario();
    }, []);

    const calculateTimeDifference = (timestamp) => {
        const segundos = timestamp.seconds;
        const nanossegundos = timestamp.nanoseconds;
      
        // Crie um objeto Date a partir de segundos e milissegundos
        const targetDate = new Date(segundos * 1000 + nanossegundos / 1000000);
      
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - targetDate.getTime();
        const secondsDiff = Math.floor(timeDiff / 1000);
        const minutesDiff = Math.floor(secondsDiff / 60);
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
        if (daysDiff >= 365) {
          // Mais de 1 ano, retorna o número de anos
          return `há ${Math.floor(daysDiff / 365)} anos`;
        } else if (daysDiff >= 30) {
          // Mais de 30 dias, retorna o número de meses
          return `há ${Math.floor(daysDiff / 30)} meses`;
        } else if (daysDiff >= 7) {
          // Mais de 7 dias, retorna o número de semanas
          return `há ${Math.floor(daysDiff / 7)} semanas`;
        } else if (hoursDiff <= 24) {
          // Mais de 24 horas, retorna o número de horas
          return `há ${hoursDiff} horas`;
        } else if (minutesDiff < 60) {
          // Mais de 60 minutos, retorna o número de minutos
          return `há ${minutesDiff} minutos`;
        } else if (secondsDiff < 60) {
          // Mais de 60 segundos, retorna 'Agora'
          return 'Agora';
        }
    };
      

    return(
        <Card style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imagem }} style={styles.image} />
                <View>
                    <Text style={styles.name}>{nome}</Text>
                    <Text style={{fontFamily: 'CircularSpotifyText-Book',fontSize:12, marginTop: -5, marginLeft:4}}>{calculateTimeDifference(mix.data)}</Text>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={{fontFamily: 'CircularSpotifyText-Light'}}>{mix.texto}</Text>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
        width: 200,
    },
    imageContainer: {
        paddingLeft: 8,
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 35,
        height: 35,
        borderRadius: 25,
    },
    textContainer: {
        flex: 1,
        padding:10
    },
    name: {
        fontFamily: 'CircularSpotifyText-Bold',
        fontSize: 18,
        marginLeft: 2
    },
});
  

export default CardComentario;