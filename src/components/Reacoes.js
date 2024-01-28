import { Button } from "@rneui/themed";
import { View,Text, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { doc,getDocs, collection, getFirestore, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { FontAwesome } from "@expo/vector-icons";
import {IconButton } from 'react-native-paper';
import { useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

const Reacoes = (props) =>{
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const usuario = props.usuario;

    const idPost = props.idPost;

    const [comentarios, setComentarios] = useState([]);
    const [likes, setLikes] = useState([]);

    const [qtdLikes, setQtdLikes] = useState(null);
    const [userLiked, setUserLiked] = useState(null);

    const [ultimoToque, setUltimoToque] = useState(0);

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

    const retornaComentários = async () =>{
        const chatRef = doc(db, 'atividades', idPost);

        // Referência à coleção 'messages' dentro do documento
        const commentsCollectionRef = collection(chatRef, 'comentários');

        // Recuperar os documentos da coleção 'messages'
        const querySnapshot = await getDocs(commentsCollectionRef);

        const comm = [];
        // Iterar sobre os documentos e acessar seus dados
        querySnapshot.forEach((doc) => {
            comm.push({ id: doc.id, ...doc.data() });
        });

        comm.sort((a, b) => a.timestamp - b.timestamp);

        setComentarios(comm);
    }

    const retornaLikes = async () =>{
        const chatRef = doc(db, 'atividades', idPost);

        // Referência à coleção 'messages' dentro do documento
        const likesCollectionRef = collection(chatRef, 'curtidas');

        // Recuperar os documentos da coleção 'messages'
        const querySnapshot = await getDocs(likesCollectionRef);

        const curtidas = [];
        // Iterar sobre os documentos e acessar seus dados
        querySnapshot.forEach((doc) => {
            curtidas.push({ id: doc.id, ...doc.data() });
        });
            
        setLikes(curtidas);
        setQtdLikes(curtidas.length);
        
        const indiceEncontrado = curtidas.findIndex(objeto => objeto.idUser === usuario.uid);
        
        if(indiceEncontrado!==-1)   setUserLiked(true);
        else setUserLiked(false);
    }

    const atualizaCurtidas = async () =>{

        const userLikedAtual = userLiked;

        if(userLiked){
            setQtdLikes(qtdLikes-1);
        }else{
            setQtdLikes(qtdLikes+1);
        }

        setUserLiked(!userLikedAtual)
        
        const indiceEncontrado = likes.findIndex(objeto => objeto.idUser === usuario.uid);

        const atividadeDocRef = doc(db, 'atividades', idPost);
        const curtidasCollectionRef =  collection(atividadeDocRef, 'curtidas');

        if(indiceEncontrado!==-1){

            const curtidasDocRef =  doc(curtidasCollectionRef, likes[indiceEncontrado].id);

            deleteDoc(curtidasDocRef)
            .then(() => {
                console.log('Documento excluído com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao excluir o documento:', error);
            });

            var fer = likes.splice(indiceEncontrado, 1);
            
            setLikes(fer);

            retornaLikes();
        }else{
            const novoDocumento = {
                idUser: usuario.uid,
                imagemUser: usuario.imagemPerfil,
                user: usuario.nome
                // Adicione outros campos conforme necessário
            };

            addDoc(curtidasCollectionRef, novoDocumento)
            .then((docRef) => {
                console.log(docRef);
                console.log('Novo documento adicionado com ID:', docRef.id);
                
                retornaLikes();

                //{ id: doc.id, ...doc.data() }
            })
            .catch((error) => {
                console.error('Erro ao adicionar novo documento:', error);
            });
        }
    }

    const abreModal = props.abreComentarios;

    useFocusEffect(

        useCallback(() => {

            retornaComentários();
            retornaLikes();
        }, [])
    );

    return(
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: -15}}>

            <IconButton size={20} color={'rgba(103, 80, 164, 1)'} onPress={()=>lidarComToque()} 
                icon={({ size, color }) => (
                    
                    userLiked ? 
                        <Image
                            source={require('../images/v-live_21117251111.png')}
                            style={{ width: size, height: size }}
                        />
                        :
                        <Image
                            source={require('../images/v-live_211172511111111.png')}
                            style={{ width: size, height: size }}
                        />   
                )}                
            />

            <Text style={{color: 'black', fontSize: 15, marginRight: 20, marginLeft: -8}}>{qtdLikes}</Text>

            <IconButton iconColor={'rgba(215, 185, 255, 1)'} onPress={()=> abreModal(comentarios)} 
                icon={({ size, color }) => (
                    <Image
                        source={require('../images/5338282.png')}
                        style={{ width: size, height: size }}
                    />
                )}
            />

            <Text style={{color: 'black', fontSize: 15, marginLeft: -7}}>{comentarios.length}</Text>

        </View>
    )
}

export default Reacoes;