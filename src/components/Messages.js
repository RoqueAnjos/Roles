import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';

const Message = ({ messagesArray, index, nomeUsuario, arroba, text, timestamp, isCurrentUser }) => {
  const messageStyle = isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage;
  
  const [fontLoaded, setFontLoaded] = useState(false);

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Medium': require('../../assets/fonts/CircularSpotifyText-Medium.otf'),
        'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
        'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf')  
        });
    };

  const formataData = (timestamp) =>{

    const segundos = timestamp.seconds;
    const nanossegundos = timestamp.nanoseconds;

    // Crie um objeto Date a partir de segundos e milissegundos
    const data = new Date(segundos * 1000 + nanossegundos / 1000000);

    // Agora você pode formatar a data como desejar
    const dataFormatada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`

    return dataFormatada;
    
  }

  const nomesDosMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const mostraTarja = (timestamp) =>{

    const convertToDate = (variavel) =>{
      const segundos = variavel.seconds;
      const nanossegundos = variavel.nanoseconds;
  
      // Crie um objeto Date a partir de segundos e milissegundos
      return new Date(segundos * 1000 + nanossegundos / 1000000);
    }
    
    const data = convertToDate(timestamp);

    const nomeDoMes = nomesDosMeses[data.getMonth()];

    // Verifica se a mensagem foi enviada hoje
    const hoje = new Date();
    const foiEnviadaHoje = hoje.toDateString() === data.toDateString();

    if(index!==0){
      const dataMensagemAnterior = convertToDate(messagesArray[index-1].timestamp);
      if(
        dataMensagemAnterior.getDate() === data.getDate() &&
        dataMensagemAnterior.getMonth() === data.getMonth() &&
        dataMensagemAnterior.getFullYear() === data.getFullYear() 
      ){
        return null;
      }
    }

    if(foiEnviadaHoje){return 'Hoje'}
    
    if(hoje.getDate() === data.getDate()+1 &&
      hoje.getMonth() === data.getMonth() &&
      hoje.getFullYear() === data.getFullYear()
    ){
      return 'Ontem'
    }
    // Agora você pode formatar a data como desejar
    return `${data.getDate()} de ${nomeDoMes} de ${data.getFullYear()}`;

  }
  useEffect(() => {
    const carregaFontes = async ()=>{
      await fetchFonts();
      setFontLoaded(true);
  }
  carregaFontes();
  }, []);

  return (

    <View>
      {mostraTarja(timestamp)!==null ?
        <View style={styles.dayBannerContainer}>
          <Text style={styles.dayBannerText}>{mostraTarja(timestamp)}</Text>
        </View>
        : null
      }

      <View style={[styles.messageContainer, messageStyle]}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{ fontFamily: 'CircularSpotifyText-Bold'}}>{nomeUsuario}</Text>
          <Text style={{ marginLeft: 5,     fontFamily: 'CircularSpotifyText-Bold', opacity: 0.5,}}>{arroba}</Text>
        </View>
        
        <Text style={styles.messageText}>{text}</Text>
        <Text style={styles.timestampText}>{formataData(timestamp)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(103, 80, 164, 0.4)',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
    marginTop: 2,
    fontFamily: 'CircularSpotifyText-Light'
  },
  timestampText: {
    fontSize: 12,
    color: 'black',
    opacity: 0.5,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    fontFamily: 'CircularSpotifyText-Light'
  },
  dayBannerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dayBannerText: {
    backgroundColor: '#CCCCCC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontFamily: 'CircularSpotifyText-Medium'
  },
});

export default Message;
