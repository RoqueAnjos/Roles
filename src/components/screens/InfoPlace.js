import React from "react";
import { useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView, FlatList } from "react-native";
import Carousel from "react-native-pager-view";
import { Avatar, Card, Paragraph, Button, IconButton, Text, Surface } from "react-native-paper";
import * as Font from 'expo-font';
import { arrayRemove, arrayUnion, doc, updateDoc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import CardComentario from "../CardComentario";
import VideoPlayer from "../VideoPlayer";

const InfoPlace = ({ route }) => {
    console.log(route.params)

    const { lugar } = route.params;
    const { usuario } = route.params;

    const [videoStatus, setVideoStatus] = useState({});

    useEffect(() => {
      return () => {
        if (videoStatus.isPlaying) {
          videoStatus.stopAsync();
        }
      };
    }, [videoStatus]);

    console.log('comentarios');
    console.log(lugar.comentarios);
    
    const comentarios = lugar.comentarios !==null && lugar.comentarios !==undefined ? Object.values(lugar.comentarios) : undefined;

    console.log(comentarios)

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'maindb');

    const fetchFonts = () => {
    return Font.loadAsync({
      'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
      'CircularSpotifyText-Book': require('../../../assets/fonts/CircularSpotifyText-Book.otf'),
      'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
      'CircularSpotifyText-Medium': require('../../../assets/fonts/CircularSpotifyText-Medium.otf'),
      'CircularSpotifyText-MediumItalic': require('../../../assets/fonts/CircularSpotifyText-MediumItalic.otf'),
      'CircularSpotifyText-BookItalic': require('../../../assets/fonts/CircularSpotifyText-BookItalic.otf'),
      'CircularSpotifyText-BlackItalic': require('../../../assets/fonts/CircularSpotifyText-BlackItalic.otf'),
    });
    };
  
    useEffect(() => {
        fetchFonts();
        if(lugar.curtidas.includes(usuario)){
            setUserLiked(true);
        }
    }, []);
    
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

    return (
        <ScrollView style={styles.container}>
          <Carousel
              height={200}
              delay={2000}
              indicatorSize={20}
              indicatorOffset={-10}
              indicatorColor="#FFFFFF"
              indicatorActiveColor="#4CAF50"
              overScrollMode={"always"}
              overdrag
              initialPage={0}
          >
              {lugar.imagens.map((imagem, index) => (
              <Image key={index} style={styles.carouselImage} source={{ uri: imagem }} />
              ))}
          </Carousel>

          <Avatar.Image
              size={80}
              source={{ uri: lugar.imagens[0] }} // Use a primeira imagem como foto de perfil
              style={styles.avatar}
          />

          <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>

              <View style={styles.titleContainer}>
                  <Text style={styles.title}>{lugar.nome}</Text>
                  <Text style={styles.subtitle}>{lugar.categoria}</Text>
              </View>

              <Button mode="outlined" style={{marginRight:20}} onPress={()=>lidarComToque()} 
                icon={({ size, color }) => (  
                  userLiked ? 
                  <Image
                      source={require('../../images/v-live_21117251111.png')}
                      style={{ width: size-1, height: size-1 }}
                  />
                  :
                  <Image
                      source={require('../../images/v-live_211172511111111.png')}
                      style={{ width: size-1, height: size-1 }}
                  />
                )}                
              >
                <Text style={{fontFamily: 'CircularSpotifyText-Book'}}>{lugar.curtidas.length}</Text>
              </Button>
          </View>

          <Card style={styles.card}>
              <Card.Content>
              <Paragraph >{lugar.descricao}</Paragraph>
              </Card.Content>
          </Card>

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.titleSections}>Comentários</Text>
            <IconButton
                iconColor="#000"
                icon="arrow-right"
                size={30}
                onPress={() => console.log('Pressed')}
            />
          </View>

          {comentarios!==undefined ?
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {
                comentarios.map((comentario, index)=>{
                  return(<CardComentario mix={comentario} index={index} />)
                })
              }
            </ScrollView>
            : <Text style={[styles.subtitle, {marginLeft: 10}]}>Sem comentários ainda.</Text>
          }

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.titleSections}>Imagens</Text>
            <IconButton
                iconColor="#000"
                icon="arrow-right"
                size={30}
                onPress={() => console.log('Pressed')}
            />
          </View>

          {lugar.imagens.length>0 ?
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {lugar.imagens.map(imagem=>
                <Card style={{width:200, marginLeft: 8, marginRight:8}}>
                  <Surface elevation={3}>
                  <Card.Cover source={{uri: imagem }}/>
                  </Surface>
                </Card>
              )
              }
            </ScrollView>
            : <Text style={[styles.subtitle, {marginLeft: 10}]}>Sem imagens.</Text>
          }

          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.titleSections}>Vídeos</Text>
            <IconButton
                iconColor="#000"
                icon="arrow-right"
                size={30}
                onPress={() => console.log('Pressed')}
            />
          </View>

          {lugar.videos.length>0?
            <FlatList
              horizontal
              data={lugar.videos}
              key={lugar.id}
              style={{marginBottom:20}}
              renderItem={({ item }) => <VideoPlayer videoURL={item}/>}
            />
            : <Text style={[styles.subtitle, {marginLeft: 10}]}>Sem vídeos.</Text>
          }

        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    width: '100%',
    height: 200,
  },
  carouselImage: {
    width: "100%",
    height: 200,
  },
  titleSections:{
    fontWeight: 100,
    fontSize: 20,
    padding:12,
    fontFamily: 'CircularSpotifyText-Bold'
  },
  avatar: {
    position: "absolute",
    top: 140,
    left: 20,
    borderColor: "#fff",
    borderWidth: 2,
  },
  titleContainer: {
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CircularSpotifyText-Bold'
  },
  subtitle: {
    fontSize: 16,
    fontFamily:'CircularSpotifyText-Bold',
    color: "#666",
  },
  card: {
    marginHorizontal: 20,
  },
});

export default InfoPlace;
