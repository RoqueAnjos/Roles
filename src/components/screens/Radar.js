import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {FAB} from 'react-native-paper';
import { Button, MD3Colors, Text, IconButton } from 'react-native-paper';
import { Avatar, Badge, Banner, Icon, Surface } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import Atividades from "../Atividades";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import CardLugar from "../CardLugar";
import { FlatList } from "react-native";
import CardRole from "../CardRole";
import { firebaseConfig } from "../../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, collection, query, getDocs, where} from "firebase/firestore";
import * as Location from 'expo-location';
import axios from 'axios';

const Radar = ({navigation, route}) => {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const apiKey = 'AIzaSyCYdpUN-cqPxtKuUalYay4v_GdKZi-I2ns';

    const [fontLoaded, setFontLoaded] = useState(false);
    const [visible, setVisible] = React.useState(false);

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Book': require('../../../assets/fonts/CircularSpotifyText-Book.otf'),
        'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
        'CircularSpotifyText-Medium': require('../../../assets/fonts/CircularSpotifyText-Medium.otf'),
      });
    };
    
    const [usuario, setUsuario] = useState(null);

    const [rolesRecomendados, setRolesRecomendados]= useState([]);

    const [localAtual, setLocalAtual] = useState({cidade :'', estado: ''});

    const [selectedButton, setSelectedButton] = useState('Feed');

    const [lugaresMaisVisitados, setLugaresMaisVisitados] = useState([]);
    const [lugaresRecomendados, setLugaresRecomendados] = useState([]);

    const handleButtonPress = (buttonName) => {
      setSelectedButton(buttonName);
    };

    const abrePerfil = () =>{
      navigation.navigate('Perfil');
    }

    const [errorMsg, setErrorMsg] = useState(null);

    const obterLocalizacao = async () => {

        const cidadeStorage = await AsyncStorage.getItem('cidade');
        const estadoStorage = await AsyncStorage.getItem('estado');

        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permissão para acessar a localização foi negada');
            setVisible(true);
            setLocalAtual({cidade: cidadeStorage, estado: estadoStorage});
            return;
          }

          setVisible(false);

          const location = await Location.getCurrentPositionAsync({});

          const resposta = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${apiKey}`
          );
      
          const resultados = resposta.data.results;
          var cidade = '';
          var estado = '';

          const setCidadeeEstado = async ()=>{
            console.log('setCidadeeEstado');

            if (resultados.length > 0) {
              for (const componente of resultados[0].address_components) {
                if (componente.types.includes('administrative_area_level_2')) {
                  cidade = componente.long_name;
                  setLocalAtual((estadoAtual) => ({ ...estadoAtual, cidade }));
                }
        
                if (componente.types.includes('administrative_area_level_1')) {
                  estado = componente.short_name;
                  setLocalAtual((estadoAtual) => ({ ...estadoAtual, estado }));
                }
              }
            }
          }

          await setCidadeeEstado();

          await AsyncStorage.setItem('cidade', `${cidade}`)
          await AsyncStorage.setItem('estado', `${estado}`)          
                   
        } catch (error) {
          //console.error('Erro ao obter a localização:', error);
          setLocalAtual({cidade: cidadeStorage, estado: estadoStorage});
        }
      
    };
    
    useEffect(() => {
      const acoesAberturaTela = async () =>{
        const user =await AsyncStorage.getItem('dadosUserBanco');
        setUsuario(await JSON.parse(user));
        await fetchFonts();
        setFontLoaded(true);
        await obterLocalizacao();
      }

      acoesAberturaTela();

      
    }, []);

    useEffect(() => {
      const recuperaLugaresMaisVisitados = async () => {
        const lugaresVisitadosRef = doc(db, 'lugaresVisitados', usuario.uid);
        const docSnap = await getDoc(lugaresVisitadosRef);
    
        if (docSnap.exists()) {
          const dadosDoDocumento = docSnap.data();
          const camposOrdenados = Object.keys(dadosDoDocumento).map(campo => ({
            campo,
            valor: dadosDoDocumento[campo]
          }));
    
          camposOrdenados.sort((a, b) => a.valor - b.valor);
    
          
          const promessas = camposOrdenados.map(async (item, index) => {
            const lugarRef = doc(db, 'lugares', item.campo);
            const lugarSnapshot = await getDoc(lugarRef);
            const lugarData = lugarSnapshot.data();
    
            return {
              id: item.campo,
              imagens: lugarData.imagens,
              videos: lugarData.videos,
              nome: lugarData.nome,
              categoria: lugarData.categoria,
              descricao: lugarData.descricao,
              curtidas: lugarData.curtidas,
              cidade: lugarData.cidade,
              estado: lugarData.estado,
              comentarios: lugarData.comentarios
            };
          });
    
          // Aguarde até que todas as promessas sejam resolvidas
          const lugares = await Promise.all(promessas);
          
          setLugaresMaisVisitados(lugares);
        } else {
          console.log('O documento não existe.');
        }
      };
      
      if (usuario != null) {
        recuperaLugaresMaisVisitados();
        // Crie uma função para recomendar encontros a um usuário.
      }

    }, [usuario]);

    // Função para ordenar os rolês com base nas curtidas e confirmados
    const ordenarRolesPorRelevancia = (roles) => {
      // Ordenar os roles com base na soma de curtidas e confirmados em ordem decrescente
      const rolesOrdenados = roles.sort((a, b) => {
          const relevanciaA = a.curtidas.length + a.confirmados.length;
          const relevanciaB = b.curtidas.length + b.confirmados.length;

          return relevanciaB - relevanciaA;
      });

      return rolesOrdenados;
    };

    // Função para obter os 10 principais roles com base nas curtidas e confirmados
    const obterTop10Roles = (roles) => {
      // Obter os roles ordenados por relevância
      const rolesOrdenados = ordenarRolesPorRelevancia(roles);

      // Retornar os 10 primeiros roles (ou menos se houver menos de 10 roles)
      const top10Roles = rolesOrdenados.slice(0, 10);

      return top10Roles;
    };

    useEffect(() => {

      // Crie uma função para obter as preferências de um usuário.
      const getPreferences = () => {
        // Obtenha o documento do usuário.
        const hobbiesUser = usuario.Hobbies;
        const meChamePara = usuario['Me chame para'];

        const preferencias = hobbiesUser.concat(meChamePara);

        // Retorne as preferências do usuário.
        return preferencias;
      }

      console.log('localAtual');
      console.log(localAtual);

      /////if(localAtual!==null && usuario!==null) recomendarRoles();
    }, [usuario, localAtual]);

    useEffect(() => {

      ////if(usuario!==null)recuperaLugaresRecomendados();

    }, [localAtual]);

    if (!fontLoaded) {
      return (null
      );
    }

    return(
      <>   

        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, marginTop: Constants.statusBarHeight}}>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <TouchableOpacity onPress={()=>abrePerfil()}>
              <View style={{position: 'relative'}}>
                <Avatar.Image style={{marginLeft: 10}} size={41} source={{uri: usuario.imagemPerfil}} />
              </View>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{flexDirection:'row', paddingLeft: 5}}
              >
              <Button style={[styles.button, selectedButton === 'Bombando' && styles.selectedButton]} 
                labelStyle={[styles.buttonLabel, selectedButton === 'Bombando' && styles.selectedButtonLabel]} 
                mode="outlined" 
                onPress={() => handleButtonPress('Bombando')}>
                Bombando
              </Button>
              <Button style={[styles.button, selectedButton === 'Feed' && styles.selectedButton]} 
                labelStyle={[styles.buttonLabel, selectedButton === 'Feed' && styles.selectedButtonLabel]} 
                mode="outlined" 
                onPress={() => handleButtonPress('Feed')}>
                Feed
              </Button>  
              <Button style={[styles.button, selectedButton === 'Lugares' && styles.selectedButton]} 
                labelStyle={[styles.buttonLabel, selectedButton === 'Lugares' && styles.selectedButtonLabel]}  
                mode="outlined" 
                onPress={() => handleButtonPress('Lugares')}>
                Lugares
              </Button>  
              <Button style={[styles.button, selectedButton === 'Roles' && styles.selectedButton]} 
                labelStyle={[styles.buttonLabel, selectedButton === 'Roles' && styles.selectedButtonLabel]}  
                mode="outlined" 
                onPress={() => handleButtonPress('Roles')}
                >
                Rolês
              </Button>
            </ScrollView>
            
          </View>
          
          <Surface style={styles.surface} elevation={1} mode="flat">
            <View style={{flexDirection: "row"}}>
              <Icon size={15} source="map-marker-radius-outline"/>
              <Text style={styles.buttonLabel}>{localAtual.cidade} - {localAtual.estado}</Text>
            </View>
          </Surface>

          <Banner
            style={{backgroundColor: 'transparent'}}
            visible={visible}
            actions={[
              {
                label: 'Ativar',
                onPress: () => setVisible(false),
              },
              {
                label: 'Negar',
                onPress: () => setVisible(false),
              },
            ]}
            icon={({size}) => (
              <Icon
                source="map-marker-radius-outline"
                color={MD3Colors.primary50}
                size={35}
              />
            )}
            >
              <Text numberOfLines={2}>
                Ative a sua localização para ter acesso a conteúdo da sua cidade.
              </Text>
          </Banner>

          {selectedButton==='Bombando' ?
              <View>
                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.titleSections}>Rolando agora</Text>
                    <IconButton
                        iconColor="#000"
                        icon="arrow-right"
                        size={30}
                        onPress={() => console.log('Pressed')}
                    />
                  </View>

                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.titleSections}>Em breve</Text>
                    <IconButton
                        iconColor="#000"
                        icon="arrow-right"
                        size={30}
                        onPress={() => console.log('Pressed')}
                    />
                  </View>

                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.titleSections}>Lugares bombando</Text>
                    <IconButton
                        iconColor="#000"
                        icon="arrow-right"
                        size={30}
                        onPress={() => console.log('Pressed')}
                    />
                  </View>
              
                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.titleSections}>Amigos seus confirmaram</Text>
                    <IconButton
                        iconColor="#000"
                        icon="arrow-right"
                        size={30}
                        onPress={() => console.log('Pressed')}
                    />
                  </View>
              </View>
              : null
          }

          {selectedButton==='Lugares' ?
            <View>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Seus lugares recentes</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>

              <View style={{marginLeft: 3}}>
                <FlatList
                  data={lugaresMaisVisitados}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) =>{
                    return <CardLugar navigation={navigation} mix={item} usuario={usuario.uid} tela={'radar'}/>}
                  }    
                />
              </View>
              
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Lugares recomendados</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>

              <View style={{marginLeft: 3}}>
                <FlatList
                  data={lugaresRecomendados}
                  keyExtractor={(item) => item.id}
                  horizontal= {selectedButton==='Lugares' ? true : false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <CardLugar navigation={navigation} mix={item} usuario={usuario.uid} tela={'radar'}/>}
                />
              </View>

              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Tops do momento</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>

              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Para seus hobbies</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>

              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Seus amigos frequentam</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>

            </View>
            :
            null
          }

          {selectedButton==='Roles' ?
            <View>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Seus últimos rolês</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>
              
              <View style={{marginLeft: 3}}>
                <FlatList
                  data={rolesRecomendados}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <CardRole mix={item} usuario={usuario.uid}/>}
                />
              </View>

              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={styles.titleSections}>Rolês recomendados</Text>
                <IconButton
                    iconColor="#000"
                    icon="arrow-right"
                    size={30}
                    onPress={() => console.log('Pressed')}
                />
              </View>

              {rolesRecomendados.length>0 ?
                <View style={{marginLeft: 3}}>
                  <FlatList
                    data={rolesRecomendados}
                    keyExtractor={(item) => item.idRole}
                    horizontal= {selectedButton==='Roles' ? true : false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <CardRole mix={item} tela={selectedButton}/>}
                  />
                </View>
              :null
              }
            </View>
            :
            null
          }
            
          {selectedButton==='Feed' ?
            <Atividades idUser={''}/>     
            :
            null
          }
        </ScrollView>

        <Badge style={styles.badge}>3</Badge>
    
        <FAB
            icon="bell-ring"
            style={styles.fab}
        >
        </FAB>        

      </>
    )
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      zIndex:1
    },
    surface: {
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal:10,
      marginTop:5,
      backgroundColor: 'rgba(103, 80, 164, 0.1)',
      borderRadius: 50
    },
    badge: {
      position: 'absolute',
      margin: 16,
      right: 5,
      bottom: 30,
      zIndex:2
    },
    button:{
      marginLeft:5
    },
    buttonBombando:{
      backgroundColor: '#fff',
      borderColor: 'transparent',
    },
    selectedButton: {
      backgroundColor: 'rgba(103, 80, 164, 0.9)', // Altere a cor desejada
    },
    buttonLabel: {
      fontSize: 12,
      fontFamily: 'CircularSpotifyText-Medium'
    },
    selectedButtonLabel: {
      color: 'white', // Altere a cor do texto quando selecionado
    },
    titleSections:{
      fontWeight: 100,
      fontSize: 22,
      padding:12,
      fontFamily: 'CircularSpotifyText-Bold'
    },
})

export default Radar;