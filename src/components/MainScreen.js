import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MeusRoles from "./screens/MeusRoles";
import Radar from "./screens/Radar";
import Perfil from "./screens/Perfil";
import { FontAwesome5 } from '@expo/vector-icons';
import { doc } from 'firebase/firestore';
import { firebaseConfig } from "../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigation } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CommonActions } from "@react-navigation/native";
import ChatRoom from "./screens/ChatRoom";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PerfilPessoa from "./screens/PerfilPessoa";
import * as Font from 'expo-font';
import Explorar from "./screens/Explorar";
import ListasProcuras from "./screens/ListasProcuras";
import InfoPlace from "./screens/InfoPlace";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainScreen = ({navigation}) => {

    const [fontLoaded, setFontLoaded] = useState(false);

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
      });
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'maindb');

    const [userValues, setUserValues] = useState({});

    useEffect(()=>{

      // Função para obter os dados do Firestore
      const fetchUserData = async () => {
        try {
          const userString = await AsyncStorage.getItem('user');
          
          const user = await JSON.parse(userString);

          var documentRef = doc(db, "users", user.uid);
          var documentSnapshot = await getDoc(documentRef);

          if (documentSnapshot.exists) {
            // O documento existe, você pode acessar seus campos
            const userData =  documentSnapshot.data();
            
            // Adicione os valores ao objeto
            userValues.Bio = await userData.Bio;
            userValues.Hobbies = await userData.Hobbies;
            userValues['Receber convites de'] =await userData['Receber convites de'];
            userValues['meus lugares'] =await userData['meus lugares'];
            userValues['meus rolês'] =await userData['meusRoles'];
            userValues.Whatsapp =await userData.Whatsapp;
            userValues.amigos =await userData.amigos;
            userValues.facebook =await userData.facebook;
            userValues.idade =await userData.idade;
            userValues.instagram =await userData.instagram;
            userValues.nome =await userData.nome;
            userValues.twitter =await userData.twitter;
            userValues.imagemPerfil =await userData.imagemPerfil;
            userValues.uid =await userData.uid;
            userValues.username =await userData.username;

            await AsyncStorage.setItem('dadosUserBanco', JSON.stringify(userValues));

            let idRoles = userValues['meus rolês'];

            const rolesData = await Promise.all(
              idRoles.map(async (idRole) => {
                const documentRef = doc(db, 'roles', idRole);
                const documentSnapshot = await getDoc(documentRef);
                const data = documentSnapshot.data();
                return data;
              })
            );

            const imagensAmigos = await Promise.all(
              userValues['amigos'].map(async (amigo) => {
                const documentRef = doc(db, 'users', amigo);
                const documentSnapshot = await getDoc(documentRef);
                const data = documentSnapshot.data();
                const img = data.imagemPerfil;
                return {id: amigo, imagemPerfil: img};
              })
            );

            console.log(imagensAmigos);
            await AsyncStorage.setItem('meusRoles', JSON.stringify(rolesData));
            if(await AsyncStorage.getItem('imagensAmigos')!==null)  await AsyncStorage.setItem('imagensAmigos', JSON.stringify(imagensAmigos));

          } else {
            console.log('O documento não existe.');
          }

        } catch (error) {
          console.error('MainScreen. Erro ao buscar os dados do Firestore:', error);
        }
      };

      // Chame a função para buscar os dados
      fetchUserData();

      const acessaFontes = async () =>{
        await fetchFonts();
        setFontLoaded(true);
      }
  
      acessaFontes();
      
    }, [])

    if (!fontLoaded) {
      return (null
      );
    }

    return(
        <NavigationContainer independent={true} >
          <Stack.Navigator>
            <Stack.Screen
              name="BottomTabNavigator"
              initialParams={{userValues}}
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoom}
              options={{ headerShown: true, headerTitle: 'Chat da galera' }}
            />
            <Stack.Screen
              name="PerfilPessoa"
              component={PerfilPessoa}
              options={{ headerShown: true, headerTitle: 'Stalkeando' }}
            />
            <Stack.Screen
              name="Perfil"
              component={Perfil}
              options={{ headerShown: true, headerTitle: 'Stalkeando' }}
            />
            
            <Stack.Screen
              name="ListasProcuras"
              component={ListasProcuras}
              options={{headerShown: true, headerTitle: 'Procurar'}}
            />

            <Stack.Screen
              name="InfoPlace"
              component={InfoPlace}
              options={{headerShown: true, headerTitle: 'Detalhes'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
    )
}

const BottomTabNavigator = ({ route }) => {
  const { userValues } = route.params;

  return (
    <Tab.Navigator
             initialRouteName="Radar"
             screenOptions={({ route }) => ({
               tabBarActiveTintColor: 'orange',
               tabBarInactiveTintColor: 'gray',
               tabBarLabelStyle: {
                 display: 'none',
               },
               headerShown: false
             })}
             tabBar={({ navigation, state, descriptors, insets }) => (
              <BottomNavigation.Bar
                navigationState={state}
                safeAreaInsets={insets}
                onTabPress={({ route, preventDefault }) => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
      
                  if (event.defaultPrevented) {
                    preventDefault();
                  } else {
                   navigation.dispatch({
                      ...CommonActions.navigate(route.name, route.params),
                      target: state.key,
                    });
                  }
                }}
                renderIcon={({ route, focused, color }) => {
                  const { options } = descriptors[route.key];
                  if (options.tabBarIcon) {
                    return options.tabBarIcon({ focused, color, size: 24 });
                  }
      
                  return null;
                }}
                getLabelText={({ route }) => {
                  const { options } = descriptors[route.key];
                  const label =
                    options.tabBarLabel !== undefined
                      ? options.tabBarLabel
                      : options.title !== undefined
                      ? options.title
                      : route.title;
      
                  return label;
                }}
              />
              )}
          >
            <Tab.Screen
              name="Radar"
              component={Radar}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarLabel: 'Home',
                tabBarLabelStyle:{fontFamily: 'CircularSpotifyText-Bold'},
                tabBarIcon: ({ color, size }) => (
                  <Icon name="home" size={size} color={color}
                    style={{
                      shadowColor: 'blue',
                      shadowOpacity: 0.9,
                      shadowRadius: 10,
                      shadowOffset: {width: 0, height:0},
                      borderRadius:50,
                      marginBottom: 5,
                      width: size, 
                      height: size
                    }} 
                    
                  />
                ),
              }}
            />

            <Tab.Screen
              name="Meus Rolês"
              component={MeusRoles}
              initialParams={{ usuario: userValues}}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarLabel: 'Meus Rolês',
                tabBarLabelStyle:{fontFamily: 'CircularSpotifyText-Bold'},
                tabBarIcon: ({ color, size }) => (
                  <Icon name="shoe-print" size={size} color={color} />
                ),
              }}
            />

            <Tab.Screen
              name="Explorar"
              component={Explorar}
              initialParams={{ usuario: userValues}}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarLabel: 'Explorar',
                tabBarLabelStyle:{fontFamily: 'CircularSpotifyText-Bold'},
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons size={size} name={"explore"} color={color}/>
                ),
              }}
            />
            
            <Tab.Screen
              name="Perfil"
              component={Perfil}
              initialParams={{ usuario: userValues}}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarLabel: 'Perfil',
                tabBarLabelStyle:{fontFamily: 'CircularSpotifyText-Bold'},
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 size={size} name={"user-circle"} color={color}/>
                ),
              }}
            />
    </Tab.Navigator>
  )
}
export default MainScreen;