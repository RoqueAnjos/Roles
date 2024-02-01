import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from '@rneui/themed';
import { ScrollView } from 'react-native';
import { firebaseConfig } from '../../../firebaseConfig';
import { doc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import Redes from '../Redes';
import { Tab, Text, TabView } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import Atividades from '../Atividades';
import Amigos from './Amigos';
import * as Font from 'expo-font';
import AtividadesPerfil from '../AtividadesPerfil';

const PerfilPessoa = ({ navigation, route }) => {

  const [fontLoaded, setFontLoaded] = useState(false);

  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
      'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
    });
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, 'maindb');
  
  const {idPessoa} = route.params;
  const [usuario, setUsuario] = useState({});
  const [index, setIndex] = React.useState(0);

  useEffect(()=>{
      const fetchUserData = async () => {
        try {
            
            const documentRef = doc(db, "users", idPessoa);
            const documentSnapshot = await getDoc(documentRef);

            const userValues = {};

            if (documentSnapshot.exists) {
            // O documento existe, você pode acessar seus campos
            const userData = documentSnapshot.data();
            
            // Adicione os valores ao objeto
            userValues.Bio = userData.Bio;
            userValues.Hobbies = userData.Hobbies;
            userValues['Me chame para'] = userData['Me chame para'];
            userValues['Receber convites de'] = userData['Receber convites de'];
            userValues['meus lugares'] = userData['meus lugares'];
            userValues['meus rolês'] = userData['meus rolês'];
            userValues.Whatsapp = userData.Whatsapp;
            userValues.amigos = userData.amigos;
            userValues.facebook = userData.facebook;
            userValues.idade = userData.idade;
            userValues.instagram = userData.instagram;
            userValues.nome = userData.nome;
            userValues.username = userData.username;
            userValues.twitter = userData.twitter;
            userValues.imagemPerfil = userData.imagemPerfil;

            setUsuario(userValues);

            // Exiba os valores do objeto no console
            } else {
            console.log('O documento não existe.');
            }
        } catch (error) {
          console.error('Tela PerfilPessoa. Erro ao buscar os dados do Firestore:', error);
        }

        await fetchFonts();
        setFontLoaded(true);
      };

      // Chame a função para buscar os dados
      fetchUserData();
  },[])

  if (!fontLoaded) {
    return (null
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.fotoeNome}>
            <Avatar
              size="large"
              rounded
              source={{ uri: usuario.imagemPerfil}}
              containerStyle={styles.avatarContainer}
            />
            <View style={{marginTop: 7}}>
              <Text style={{marginTop: 2, fontFamily: 'CircularSpotifyText-Bold', fontSize: 24}}>
                {usuario.nome}
              </Text>
              <Text style={styles.username}>
                {usuario.username}
              </Text>
            </View>

          </View>

        </View>
        <View style={styles.info}>
          <View style={{flexDirection: 'row'}}><Text style={{fontFamily: 'CircularSpotifyText-Bold', fontSize: 14}}>Bio: </Text><Text style={styles.infoText}>{usuario.Bio}</Text></View>
          <View style={{flexDirection: 'row'}}><Text style={{fontFamily: 'CircularSpotifyText-Bold', fontSize: 14}}>Hobbies: </Text><Text style={styles.infoText}>{usuario.Hobbies.join(', ')}</Text></View>
          <View style={{flexDirection: 'row'}}><Text style={{fontFamily: 'CircularSpotifyText-Bold', fontSize: 14}}>Receber convites de: </Text><Text style={styles.infoText}>{usuario['Receber convites de']}</Text></View>
        </View>

        <Redes twitter={usuario['twitter']} instagram={usuario['instagram']}/>

        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: 'white',
            height: 3,
          }}
          style={{
            backgroundColor: 'rgba(103, 80, 164, 1)'
          }}          
        >
          <Tab.Item
            title="Atividades"
            titleStyle={{ fontSize: 12, color:'white' }}
            icon={<FontAwesome5 name={"home"} style={{ color: 'white', fontSize: 20 }} />}
          />
          <Tab.Item
            title="Amigos"
            titleStyle={{ fontSize: 12, color:'white' }}
            icon={<FontAwesome5 name={"users"} style={{ color: 'white', fontSize: 20 }} />}
          />

        </Tab>
          
        <View className='tabsPerfil' >
          <TabView value={index} onChange={setIndex} animationType="timing">
            <TabView.Item style={{flex: 1, flexDirection: 'row', alignItems: 'baseline', width: '100%'}}>
              <AtividadesPerfil idUser={idPessoa}/>
            </TabView.Item>
            <TabView.Item style={{flex: 1, flexDirection: 'row', alignItems: 'baseline', width: '100%'}}>
              {
                usuario.amigos ? <Amigos navigation={navigation} idAmigos={usuario.amigos}/>
                : null
              }
              
            </TabView.Item>
          </TabView>  
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'column'
  },
  fotoeNome: {
    padding: 10,
    flexDirection: 'row',
  },
  exitButton:{
    marginRight: 20,
    borderRadius: 5,
  },

  header:{
    flexDirection: 'row',
    alignItems:  'center',
    justifyContent: 'space-between'
  },

  avatarContainer: {
    borderWidth: 5,
    borderColor: 'white',
  },
  username: {
    marginTop: 2,
    fontFamily: 'CircularSpotifyText-Light'
  },
  editButton: {
    marginTop: 2,
    backgroundColor: '#3498db',
    borderRadius: 5,
    height: 33,
  },
  editButtonText: {
    color: 'white',
    fontSize: 13,
    alignSelf: 'flex-start'
  },
  info: {
    paddingHorizontal: 20,
  },
  infoText: {
    marginBottom: 5,
    fontFamily: 'CircularSpotifyText-Light',
  },
});

export default PerfilPessoa;