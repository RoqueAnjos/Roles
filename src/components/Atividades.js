import { getDocs, collection } from "firebase/firestore";
import { Avatar, Button } from '@rneui/themed';
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Reacoes from "./Reacoes";
import Comentarios from "./Comentarios";
import { Portal, Modal, Text, IconButton,ActivityIndicator } from 'react-native-paper';
import { FullWindowOverlay } from "react-native-screens";
import db from "./banco";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";
import * as Font from 'expo-font';

const Atividades = (props) =>{

    const idUser = props.idUser;
    const [user, setUser] = useState({});

    const [fontLoaded, setFontLoaded] = useState(false);

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Medium': require('../../assets/fonts/CircularSpotifyText-Medium.otf'),
        'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
        'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf')
      });
    };
    
    const [posts, setPosts] = useState([]);
    const [portalVisible, setPortalVisible] = useState(false);
    const [comentarios, setComentarios] = useState([]);

    const nomesDosMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const loadAllPosts = async () => {
            
        const userString = await AsyncStorage.getItem('dadosUserBanco');
        const us = await JSON.parse(userString);

        setUser(us);

        try{
            const querySnapshot = await getDocs(collection(db, 'atividades'));
            const loadedAllPosts = [];
            querySnapshot.forEach((doc) => {
                loadedAllPosts.push({ id: doc.id, ...doc.data() });
            });

            //await AsyncStorage.setItem('allPosts', JSON.stringify(loadedPosts));
            //await AsyncStorage.setItem('ownPosts', JSON.stringify(loadedOwnPosts));

            setPosts(loadedAllPosts);
        }catch (err){
            console.error('Tela Atividades. Erro ao buscar os dados do Firestore:', err);
        }
    };    

    useFocusEffect(
        useCallback(()=>{
        
            if(idUser==='')loadAllPosts();
            else{
                
                const loadOwnPosts = async ()=>{

                    console.log('loadOwnPosts')

                    const userString = await AsyncStorage.getItem('dadosUserBanco');
                    const us = await JSON.parse(userString);

                    setUser(us);

                    try{
                        const querySnapshot = await getDocs(collection(db, 'atividades'));
                        const loadedOwnPosts = [];
                        querySnapshot.forEach((doc) => {        
                            if(doc.data().user===us.uid) loadedOwnPosts.push({ id: doc.id, ...doc.data() });
                        });
                        console.log(loadedOwnPosts)
                        setPosts(loadedOwnPosts);
                    }catch (err){
                        console.error('Tela Atividades. Erro ao buscar os dados do Firestore:', err);
                    }
                }
                loadOwnPosts();
            }
        
        }, [])
    );

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
     

    const hidePortal = () => {
        setPortalVisible(false);
    };

    const abreComentarios = (comm) =>{
        setComentarios(comm);
        setPortalVisible(true);
    }
    
    const [showProgress, setShowProgress] = useState(true);

    useEffect(() => {
        if(posts.length>0)  setShowProgress(false);
    }, [posts]);

    useEffect(() => {
        const carregaFontes = async ()=>{
            await fetchFonts();
            setFontLoaded(true);
        }
        carregaFontes();
    }, []);

    if (!fontLoaded) {
        return (null
        );
    }

    return(
        <>
        {posts !== undefined ?
            posts.map(item =>
                <View style={styles.role} key={item.id}>
                    {showProgress?
                        <ActivityIndicator animating={showProgress} size={'large'} />
                        :null
                    }
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <Avatar
                            size="small"
                            rounded
                            source={{ uri: item['imagemUser']}}
                            containerStyle={styles.avatarContainer}
                        />
                        <View style={styles.info} >
                            {item['descrição'] !== '' ?
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontFamily: 'CircularSpotifyText-Medium'}}>{item['nomeUser']}</Text>
                                    <Text style={{fontFamily: 'CircularSpotifyText-Light'}}> {item['descrição']}</Text>
                                </View>
                                :
                                <Text style={{fontFamily: 'CircularSpotifyText-Medium'}}>{item['nomeUser']}</Text>
                            }
                            <Text style={styles.timestampText}>{calculateTimeDifference(item['timestamp'])}</Text>
                        </View>
                        {
                            user.uid===item.user || user.amigos.includes(item.user) ? null
                            :
                            <Button mode="outlined" color={'white'} ><Text style={{fontSize: 11}}>Adicionar</Text></Button>
                        }
                    </View>
                    <Text style={styles.infoText}>{item['texto']}</Text>

                    <Reacoes idPost={item.idDoc} usuario={user} abreComentarios={abreComentarios}/>

                    <Portal>
                        <Modal  visible={portalVisible} onDismiss={hidePortal}>
                            <View style={{padding: 20, backgroundColor: 'white', height:'100%' }}>
                                <View style={styles.textoComentario}>
                                    <IconButton icon='arrow-left' size={25} onPress={hidePortal} />
                                    <Text style={styles.comentarios}>
                                        Comentários
                                    </Text>
                                </View>
                                <Comentarios idPost={item.idDoc} usuario={user} comentarios={comentarios}/>

                            </View>
                        </Modal>
                    </Portal>
                    
                </View>
            )
            : null
        }
        </>
            
    )
}

const styles = StyleSheet.create({
    info: {
        paddingHorizontal: 10,
    },
    infoText: {
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding:10,
        fontFamily: 'CircularSpotifyText-Light'
    },
    role:{
        margin: 10,
        borderRadius: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: 'rgba(103, 80, 164, 0.7)',
        width: FullWindowOverlay,
        padding: 10,
    },  
    timestampText: {
        fontSize: 12,
        color: 'black',
        fontFamily: 'CircularSpotifyText-Book'
    },
    avatarContainer:{
        marginLeft: 5,
        marginTop: 2,
    },
    comentarios:{
        fontSize: 18,
        fontWeight: 'bold',
    },
    textoComentario:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -15,
        marginLeft: -15,
    }
})

export default Atividades;