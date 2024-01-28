import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Amigos from './Amigos';
import { Tab, Text, TabView } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import Redes from '../Redes';
import { Button, IconButton } from 'react-native-paper';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import AtividadesPerfil from '../AtividadesPerfil';

const Perfil = ({ navigation, route }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
      'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
    });
  };
    
  const [usuario, setUsuario] = useState({});

  const [index, setIndex] = React.useState(0);

  const chamaWelcome = ()=>{
    navigation.navigate('Welcome');
  }

  const logOut = async () =>{
    await AsyncStorage.removeItem('user');
    chamaWelcome();
  }
  
  useEffect(() => {
    const constroiUser = async () =>{
      const user =await AsyncStorage.getItem('dadosUserBanco');
      setUsuario(await JSON.parse(user));
      await fetchFonts();
      setFontLoaded(true);
    }

    constroiUser();
    
  }, []);

  if (!fontLoaded) {
    return (null
    );
  }

  return (
    <View style={{marginTop: Constants.statusBarHeight}}>
      <View style={styles.container}>
        <View style={styles.header}>

          <View style={styles.fotoeNome}>
            <Avatar
              size="large"
              rounded
              source={{ uri: usuario.imagemPerfil}}
            />
            <View style={{marginTop: 7}}>
              <Text style={{marginTop: 2, fontFamily: 'CircularSpotifyText-Bold', fontSize: 24}}>
                {usuario.nome}
              </Text>
              <Text style={styles.username}>
                {usuario.username}
              </Text>
            </View>

            <IconButton
              icon="account-edit"
              size={15}
              mode='outlined'
              style={{ marginTop: 12}}
              iconColor='rgba(103, 80, 164, 1)'
              onPress={() => navigation.navigate('EditarPerfil')}
            />
          </View>

          <IconButton
              icon="exit-to-app"
              size={20}
              mode='outlined'
              style={{ marginTop: 12, marginRight:10}}
              iconColor='#fff'
              containerColor='rgba(103, 80, 164, 0.9)'
              onPress={() => navigation.navigate('EditarPerfil')}
          />

        </View>
        <View style={styles.info}>
          <View style={{flexDirection: 'row'}}><Text style={{fontFamily: 'CircularSpotifyText-Bold', fontSize: 14}}>Bio: </Text><Text style={styles.infoText}>{usuario.Bio}</Text></View>
          <View style={{flexDirection: 'row'}}><Text style={{fontFamily: 'CircularSpotifyText-Bold', fontSize: 14}}>Hobbies: </Text><Text style={styles.infoText}>{usuario.Hobbies.join(', ')}</Text></View>
          <View style={{flexDirection: 'row'}}><Text style={{fontFamily: 'CircularSpotifyText-Bold', fontSize: 14}}>Me chame para: </Text><Text style={styles.infoText}>{usuario['Me chame para'].join(', ')}</Text></View>
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
          
        <View>
          <TabView value={index} onChange={setIndex} animationType="timing">
            <TabView.Item style={{flex: 1, flexDirection: 'row', alignItems: 'baseline', width: '100%'}}>
              <AtividadesPerfil idUser={usuario.uid}/>
            </TabView.Item>
            <TabView.Item style={{flex: 1, flexDirection: 'row', alignItems: 'baseline',  width: '100%'}}>
              
              {usuario.amigos!==undefined ? <Amigos navigation={navigation} idAmigos={usuario.amigos}/>
              : null}
            </TabView.Item>
          </TabView>  
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
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
    marginHorizontal: 10,
  },
  infoText: {
    marginBottom: 5,
    fontFamily: 'CircularSpotifyText-Light',
    flexWrap: 'wrap'
  },
});

export default Perfil;