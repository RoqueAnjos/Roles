import React, { useState, useEffect , useRef  } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { firebaseConfig } from '../../../firebaseConfig';
import { addDoc, getDocs, getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { doc, collection, onSnapshot } from 'firebase/firestore';
import Message from '../Messages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IconButton, Surface} from 'react-native-paper';
import DetalhesRole from '../DetalhesRole';
import { Dimensions,Animated,Easing } from 'react-native';
import { Avatar } from '@rneui/themed';
import { Audio } from 'expo-av';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import * as Font from 'expo-font';

const ChatRoom = ({ route }) => {
    const { imagem, id, name, descricao } = route.params;
    const flatListRef = useRef(null);

    const [fontLoaded, setFontLoaded] = useState(false);

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Medium': require('../../../assets/fonts/CircularSpotifyText-Medium.otf'),
        'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
        'CircularSpotifyText-Book': require('../../../assets/fonts/CircularSpotifyText-Book.otf')  
        });
    };
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [user, setUser] = useState();

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [timerId, setTimerId] = useState(null);

    const isMessageEmpty = newMessage.trim() === '';
    const icon = recording ? 'send' : isMessageEmpty ? 'microphone' : 'send'; // Altere para o ícone desejado quando houver texto

    console.log(icon);

    const recordingObjectRef = useRef(null);

    const cancelarAudio = async () => {
        setRecording(false);

        if (recordingObjectRef.current && recordingObjectRef.current.getStatusAsync) {
            const status = await recordingObjectRef.current.getStatusAsync();

            if (status.isRecording) {
                await recordingObjectRef.current.stopAndUnloadAsync();
                clearInterval(timerId);
                setTimerId(null);
                setSeconds(0);

                recordingObjectRef.current = null; // Limpar a referência
            }
        }
    }

    const toggleRecording = async () => {
        const uploadAudio = async (audioFile) => {
            const storage = getStorage();
            const storageRef = ref(storage, 'audios/audio.mp3');
        
            try {
                await uploadBytes(storageRef, audioFile);
                console.log('Upload de áudio concluído!');
            } catch (error) {
                console.error('Erro ao fazer upload do áudio:', error);
            }
        };

        if (recording) {

            if (recordingObjectRef.current && recordingObjectRef.current.getStatusAsync) {
                const status = await recordingObjectRef.current.getStatusAsync();

                if (status.isRecording) {
                    await recordingObjectRef.current.stopAndUnloadAsync();
                    setRecording(false);
                    
                    clearInterval(timerId);
                    setTimerId(null);

                    await uploadAudio(recordingObjectRef.current.getURI());

                    recordingObjectRef.current = null; // Limpar a referência
                }
            }

        } else {
            try {
                await Audio.requestPermissionsAsync();

                if (recordingObjectRef.current) {
                    const status = await recordingObjectRef.current.getStatusAsync();

                    if (status.canRecord) {
                        await recordingObjectRef.current.stopAndUnloadAsync();
                    }
                }

                recordingObjectRef.current = new Audio.Recording();
                await recordingObjectRef.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await recordingObjectRef.current.startAsync();

                const timerId = setInterval(() => {
                    setSeconds((prevSeconds) => prevSeconds + 1);
                }, 1000);

                setRecording(true);
                setTimerId(timerId);

            } catch (error) {
                console.error('Erro ao iniciar a gravação:', error);
            }
        }
    };

    useEffect(()=>{

        const geraUsuario = async() =>{
            const userString = await AsyncStorage.getItem('dadosUserBanco');
            const usuario = await JSON.parse(userString);
            setUser(usuario);
        }
        geraUsuario();

        const setupMessageListener = async () =>{
            const chatRef = doc(db, 'chatRooms', id);

            // Referência à coleção 'messages' dentro do documento
            const messagesCollectionRef = collection(chatRef, 'messages');
    
            // Configurar um ouvinte para receber atualizações em tempo real
            const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
                const msgs = [];

                // Iterar sobre os documentos e acessar seus dados
                querySnapshot.forEach((doc) => {
                    msgs.push({ id: doc.id, ...doc.data() });
                });

                // Ordenar as mensagens pelo timestamp
                msgs.sort((a, b) => a.timestamp - b.timestamp);

                // Atualizar o estado com as mensagens
                setMessages(msgs);
            });
            return unsubscribe;

        }

        const carregaFontes = async ()=>{
            await fetchFonts();
            setFontLoaded(true);
        }
        carregaFontes();

        const unsubscribe = setupMessageListener();

    }, [])

    const getItemHeight = (item) => {
        const maxWidthPercentage = 0.7; // Largura máxima de 70%
      
        // Suponha que o item tenha uma propriedade 'conteudo' que contém o texto
        const texto = item.conteudo;
      
        const larguraDaTela = Dimensions.get('window').width;

        // Largura máxima com base na largura da tela ou contêiner pai
        const maxWidth = larguraDaTela * maxWidthPercentage;
      
        // Suponha que o estilo do Texto inclua uma fonte específica e tamanho
        const textStyle = { fontFamily: 'SuaFonte', fontSize: 16 /* Tamanho da fonte */ };
      
        // Use o Texto como componente temporário para medir a altura
        const temporaryTextComponent = (
          <Text style={[textStyle, { maxWidth }]}>{texto}</Text>
        );
      
        // Renderize temporariamente o componente em um contêiner invisível
        const container = (
          <View style={{ width: maxWidth, position: 'absolute', opacity: 0 }}>
            {temporaryTextComponent}
          </View>
        );
      
        // Renderize o contêiner temporário para obter as dimensões
        // Pode ser necessário medir no layout ou usar uma biblioteca como 'react-native-text-size'
        // para obter a altura do texto de maneira mais precisa
        // Aqui, estou usando uma estimativa fixa para fins de exemplo
        const estimatedHeight = 100;
      
        return estimatedHeight;
    };

    const getItemLayout = (data, index) => {
        // Retorna a altura total até o índice desejado e o índice real
        const totalHeight = data
          .slice(0, index + 1)
          .reduce((sum, item) => sum + getItemHeight(item), 0);
    
        return { length: totalHeight, offset: totalHeight, index };
    };
        
    useEffect(() => {
        const lastIndex = messages.length - 1;

        // Defina o índice do último item na FlatList usando o ref
        if (flatListRef.current && lastIndex >= 0) {
            flatListRef.current.scrollToIndex({ index: lastIndex, animated: false });
        }

    }, [messages]);

    const sendMessage = async () => {

        const chatRef_ =  doc(db, 'chatRooms', id);//.collection('messages');
        const chatRef = collection(chatRef_, 'messages');

        const novaMensagem = {
            nomeUser: user.nome,
            texto: newMessage,
            timestamp: new Date(),
            user: user.uid,
            arroba: user.username
        };

        addDoc(chatRef, novaMensagem);
        setNewMessage('');
    }

    const handleButtonPress = (icon) => {
        if ((!recording && icon==='microphone') || (recording && icon==='send') ) {
          // Lógica para lidar com o ícone do microfone
          toggleRecording();
          
        } else {
          // Lógica para lidar com o ícone de enviar
          sendMessage();
          
        }
    };

    function formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        const segundosFormatados = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes;
        return `${minutos}:${segundosFormatados}`;
    }

    return (
        <View style={styles.container}>
            <Surface style={styles.header} elevation={5}>
                <Avatar
                    size="medium"
                    rounded
                    source={{ uri: imagem}}
                    containerStyle={styles.avatarContainer}
                />
                <View style={{flex:1, marginLeft: 10}}>
                    <Text style={styles.headerText}>{name}</Text>
                    <Text style={styles.descriptionText}>{descricao}</Text>
                </View>
                <View style={{marginTop:6}}>
                    <DetalhesRole />
                </View>
                
            </Surface>
            
            <FlatList
                ref={flatListRef}
                style={{paddingHorizontal: 10}}
                data={messages}
                keyExtractor={(item) => item.id}
                getItemLayout={getItemLayout} // Adicione esta linha
                renderItem={({ item, index }) =>{ 
                    if (!user) {
                        // Se o usuário ainda não foi carregado, evite a renderização
                        return null;
                    }
            
                    return(
                        <Message
                            key={item.id}
                            messagesArray={messages}
                            index={index}
                            nomeUsuario={item.nomeUser}
                            arroba={item.arroba}
                            text={item.texto}
                            timestamp={item.timestamp}
                            isCurrentUser={item.user === user.uid} // Verifique se o usuário atual é o remetente
                        />
                    )
                }}
            />
            {
                !recording ? 
                    <View style={styles.containerEnviar}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Mensagem"
                            value={newMessage}
                            onChangeText={setNewMessage}
                        />
                        <IconButton size={30} mode='contained' icon={icon} onPress={() => handleButtonPress(icon)}  />
                    </View>
                :
                    <View style={styles.containerEnviar}>
                        <IconButton size={30} mode='contained' icon={'trash-can-outline'} onPress={()=>cancelarAudio()}/>
                        <Text style={styles.contagemTempo}>{formatarTempo(seconds)}</Text>
                        <Text style={{fontSize:16}}>Gravando</Text>
                        <IconButton size={30} icon={'record'} iconColor='red' style={{marginLeft: -10}}/>
                        <IconButton size={30} mode='contained' icon={icon} onPress={() => handleButtonPress(icon)}  />
                    </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    textInput:{
        flex: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 50,
        height: 45,
        borderColor: '#000',
        backgroundColor: '#fff',
        marginLeft: 10,
        paddingLeft: 20,
        fontFamily: 'CircularSpotifyText-Light'
    },
    contagemTempo:{
        flex: 1,
        height: 45,
        fontSize: 16,
        marginLeft: 10,
        paddingLeft: 20,
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    containerEnviar:{
        flexDirection: 'row',
        alignItems: 'center',  // Alinha os itens verticalmente
    },  
    header: {
      backgroundColor: '#f5f6f7',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontSize: 20,
      color: '#21005d',
      fontFamily: 'CircularSpotifyText-Bold'
    },
    descriptionText: {
      fontSize: 14,
      color: 'gray',
      fontFamily: 'CircularSpotifyText-Light'
    },
});

export default ChatRoom;