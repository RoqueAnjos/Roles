// ItemCard.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font';
import {Card, Text, Button, Icon} from 'react-native-paper';
import { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { arrayRemove, arrayUnion, doc, updateDoc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { FontAwesome } from '@expo/vector-icons';

const CardLugar = ({ navigation, mix, usuario, tela }) => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    var lugar = mix;

    const [fontLoaded, setFontLoaded] = useState(false);
    const [userLiked, setUserLiked] = useState(false);

    const [ultimoToque, setUltimoToque] = useState(0);

    const atualizaCurtidas = async () =>{

      const lugarDocRef = doc(db, 'lugares', lugar.id);

      // Se você quiser adicionar o ID do usuário ao array 'curtidas'
      async function adicionarCurtida() {
        await updateDoc(lugarDocRef, {
          curtidas: arrayUnion(usuario),
        });
        console.log('Curtida adicionada com sucesso!');
        lugar.curtidas.push(usuario);
      }

      // Se você quiser remover o ID do usuário do array 'curtidas'
      async function removerCurtida() {
        await updateDoc(lugarDocRef, {
          curtidas: arrayRemove(usuario),
        });
        const index = lugar.curtidas.indexOf(usuario);
        lugar.curtidas.splice(index, 1);
        console.log('Curtida removida com sucesso!');
      }
    
      const userLikedAtual = userLiked;

      if(userLiked){
          await removerCurtida();
      }else{
          await adicionarCurtida();
      }

      setUserLiked(!userLikedAtual)
  }

    const lidarComToque = () => {
      const agora = new Date().getTime();
      const diferencaTempo = agora - ultimoToque;
  
      // Verifica se o tempo desde o último toque é maior que 2000 milissegundos (2 segundos)
      if (diferencaTempo > 2000) {
        // Realiza a ação
        console.log('Toque aceito!');
        // Atualiza o timestamp do último toque
        setUltimoToque(agora);

        atualizaCurtidas();
      } else {
        // Ainda dentro do período de espera, ignora o toque
        console.log('Aguarde 2 segundos antes de tocar novamente.');
      }
    };

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

        if(lugar.curtidas.includes(usuario)){
          setUserLiked(true);
        }

    }, []);

    if (!fontLoaded) {
        return (null
        );
    }

    const iconeCategoria = ()=>{
      switch(lugar.categoria){
        case 'Bar e restaurante':
          return <FontAwesome5 name={"utensils"} size={16} color="black" />
        case 'Conveniência':
          return <FontAwesome5 name={"glass-cheers"} size={16} color="black" />
        case 'Parque de diversões':
          return <Icon source="ferris-wheel" size={16} color="black" />
        case 'Bosques e Parques':
          return <Foundation name="trees" size={16} color="black" />
        case 'Centro Turístico':
          return <FontAwesome5 name={"camera-retro"} size={16} color="black" />
        case 'Lanchonete':
          return <FontAwesome5 name={"hamburger"} size={16} color="black" />
        case 'Esporte e Lazer':
          return <FontAwesome5 name={"swimmer"} size={16} color="black" />
        case 'Sorveteria e Bebidas Geladas':
          return <Icon source="ice-cream" size={16} color="black" />
        case 'Academia':
          return <FontAwesome5 name={"dumbbell"} size={16} color="black" />
        case 'Cafeteria':
          return <FontAwesome5 name={"mug-hot"} size={16} color="black" />
        case 'Pizzaria':
          return <FontAwesome5 name={"pizza-slice"} size={16} color="black" />
        case 'Clubes e Resorts':
          return <FontAwesome5 name={"cocktail"} size={16} color="black" />
        case 'Chácaras e Sítios':
          return <MaterialCommunityIcons name="tree" size={16} color="black" />
      }

    }

    const abreInfoPlace = (lugar)=>{
      console.log(usuario);
      navigation.navigate('InfoPlace', {lugar: lugar, usuario:usuario})
    }

    return (
      <Card style={[tela==='radar'? {width: 300, marginHorizontal: 8} : {width: 180, marginHorizontal:5}]} mode="contained">
        <Card.Cover style={[{margin:15}, tela==='pesquisa' ? {width:150, height: 120} : null]} source={lugar.image!==undefined? { uri: lugar.image }: {uri: lugar.imagens[0]}} />
        <Card.Title style={{marginTop: -20}} titleStyle={{fontFamily:'CircularSpotifyText-Bold'}} title={lugar.nome} />
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -15 }}>
              <FontAwesome name="map-marker" size={20} color="black" style={{ marginRight: 8, marginBottom:2 }} />
              <Text style={[styles.name, {fontSize: 13}]}>{lugar.cidade} - {lugar.estado}</Text>
          </View>
            {
              lugar.categoria !== undefined && lugar.categoria !== ''?
            
              <View style={{ flexDirection: 'row', alignItems: 'center',  justifyContent: 'center'}}>
                <Button
                  icon={({ color }) => iconeCategoria()}
                >
                  <Text style={[styles.name, {fontSize: 13}]}>{lugar.categoria}</Text>
                </Button>
              </View>
              : 
              null
            }
            {tela==='radar' ? <Text style={[styles.name, {marginTop:2}]}>{lugar.descricao}</Text> : null}
            
        </Card.Content>
        
        <Card.Actions style={{alignSelf: 'center'}}>
          {tela==='radar' ? 
            <Button onPress={()=>lidarComToque()} 
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
              <Text style={styles.name}>{lugar.curtidas.length}</Text>
            </Button>
            : null
          }

          <Button onPress={()=>abreInfoPlace(lugar)}>Abrir</Button>
        </Card.Actions>
      </Card>
    );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  name: {
    fontFamily: 'CircularSpotifyText-Book'
  },
});

export default CardLugar;
