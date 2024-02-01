import React from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Avatar } from '@rneui/themed';
import { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { doc } from 'firebase/firestore';
import { firebaseConfig } from "../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { FlatList } from "react-native";
import * as Font from 'expo-font';

const Confirmados = ({navigation, idAmigos, organizadores}) => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'maindb');

    const [fontLoaded, setFontLoaded] = useState(false);

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Medium': require('../../assets/fonts/CircularSpotifyText-Medium.otf'),
        'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
        'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf')  
        });
    };
    
    const [amigos, setAmigos] = useState([]);

    const abrePerfilPessoa = (idPessoa)=>{
        navigation.navigate('PerfilPessoa', {idPessoa: idPessoa});
    }

    useEffect(()=>{
        // Função para obter os dados do Firestore
        const fetchUserData = async () => {
          try {

            const amigosData = await Promise.all(
                idAmigos.map(async (pessoa) => {
                  const documentRef = doc(db, 'users', pessoa);
                  const documentSnapshot = await getDoc(documentRef);
                  const userData = documentSnapshot.data();
                  return userData;
                })
            );
                        
            setAmigos(amigosData);

          } catch (error) {

            console.error('tela confirmados. Erro ao buscar os dados do Firestore:', error);
          }
        };
  
        // Chame a função para buscar os dados
        fetchUserData();

        const carregaFontes = async ()=>{
            await fetchFonts();
            setFontLoaded(true);
        }
        carregaFontes();
            
        console.log(organizadores);
    }, [])


    if (!fontLoaded) {
        return (null
        );
    }

    return(
        <FlatList
            data={ amigos}
            style={{marginTop: 10}}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => {

                if(!amigos) {
                    return null;
                }

                if(organizadores.includes(item.uid)){
                    return(
                        <TouchableWithoutFeedback  onPress={()=>abrePerfilPessoa(item.uid)} key={item.uid}> 
                            <View style={styles.pessoa}>
                                <Avatar
                                    rounded
                                    source={{ uri: item.imagemPerfil}}
                                    containerStyle={styles.avatarContainer}
                                />
                                <View style={styles.info}>
                                    <Text style={styles.nomeText}>{item.nome}</Text>
                                    <Text style={styles.organizadores}>Organizador</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }
                
                return(
                <TouchableWithoutFeedback  onPress={()=>abrePerfilPessoa(item.uid)} key={item.uid}> 
                    <View style={styles.pessoa}>
                        <Avatar
                            rounded
                            source={{ uri: item.imagemPerfil}}
                            containerStyle={styles.avatarContainer}
                        />
                        <View style={styles.info}>
                            <Text style={styles.nomeText}>{item.nome}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>)
            }
            }
        />   
    )
}

const styles = StyleSheet.create({
    infoText: {
        marginBottom: 10,
        marginTop:10,
        color:'black'
    },
    pessoa:{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 5,
        borderColor: 'rgba(103, 80, 164, 1)',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth:1
    },  
    info: {
        paddingHorizontal: 20,
        justifyContent: "center"
    },
    nomeText:{
        fontSize: 16,
        fontFamily: 'CircularSpotifyText-Medium'
    },
    organizadores:{
        fontSize: 13,
        fontFamily: 'CircularSpotifyText-Light'
    },
    avatarContainer:{
        alignSelf: "center",
        height: 30,
        width: 30,
    }
})

export default Confirmados;