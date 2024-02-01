import React from "react";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';
import { Searchbar } from 'react-native-paper';
import * as Font from 'expo-font';
import { StyleSheet } from "react-native";
import {IconButton } from 'react-native-paper';
import { FlatList } from "react-native";
import { doc, getDoc, getFirestore, collection, query, getDocs, where} from "firebase/firestore";
import { firebaseConfig } from "../../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { ScrollView } from "react-native";
import {Card, Text, Button, Icon} from 'react-native-paper';
import CardLugar from "../CardLugar";
import CardRole from "../CardRole";
import CardPessoa from "../CardPessoa";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Explorar = ({props, navigation}) =>{
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResultsPeople, setSearchResultsPeople] = useState([]);
    const [searchResultsPlaces, setSearchResultsPlaces] = useState([]);
    const [searchResultsRoles, setSearchResultsRoles] = useState([]);

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'maindb');

    const [usuario, setUsuario] = useState('');

    useEffect(() => {
        const getUsuario = async ()=>{
            const user =await AsyncStorage.getItem('dadosUserBanco');
            setUsuario(await JSON.parse(user));        
        }

        getUsuario();
    }, []);

    const fetchFonts = () => {
        return Font.loadAsync({
          'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
          'CircularSpotifyText-Book': require('../../../assets/fonts/CircularSpotifyText-Book.otf'),
          'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
          'CircularSpotifyText-Medium': require('../../../assets/fonts/CircularSpotifyText-Medium.otf'),
        });
    };

    const [categorias, setCategorias] = useState([
        "Sorveterias e Bebidas Geladas",
        "Parques de diversão",
        "Esportes e lazer",
        "Conveniências",
        "Clubes e Resorts",
        "Chácaras e Sítios",
        "Centros turísticos",
        "Cafeterias e Lanchonetes",
        "Bosques e Parques",
        "Bares e Restaurantes",
        "Academias",
    ])

    const [hobbies, setHobbies] = useState([
        "Musculação",
        "Beach Tennis",
        "Futebol",
        "Vôlei",
        "Handebol",
        "Praia",
        "Parques",
        "Jogos Online",
        "Leitura",
        "Cinema",
        "Jogos ao ar livre",
        "Acampamentos",
        "Pesca",
        'Ciclismo',
        "Jogos de tabuleiro",
        "Videogame",
        'Jogos RPG',
        "Basquete",
        "Tênis",
        "Esportes",
        "Encontrar amigos",
        "Passeio ao ar livre",
        "Piquenique",
        "Futsal",
        "Boxe",
        "Artes Marciais",
    ]);

    const searchInFirestore = async (pesquisa) => {
        try {
            const usersRef = collection(db, 'users');
            const lugaresRef = collection(db, 'lugares');
            const rolesRef = collection(db, 'roles');

            const usersQuery = query(usersRef, where('nome', '>=', pesquisa), where('nome', '<=', pesquisa+'\uf8ff'));
            const usersSnapshot = await getDocs(usersQuery)

            const lugaresQuery = query(lugaresRef, where('nome', '>=', pesquisa), where('nome', '<=', pesquisa+'\uf8ff'));
            const lugaresSnapshot = await getDocs(lugaresQuery);

            const rolesQuery = query(rolesRef, where('titulo', '>=', pesquisa), where('titulo', '<=', pesquisa+'\uf8ff'));
            const rolesSnapshot = await getDocs(rolesQuery)

            const usersData = usersSnapshot.docs.map((doc) => doc.data());
            const lugaresData = lugaresSnapshot.docs.map((doc) => doc.data());
            const rolesData = rolesSnapshot.docs.map((doc) => doc.data());
            
            setSearchResultsPeople(usersData);
            setSearchResultsPlaces(lugaresData);
            setSearchResultsRoles(rolesData);

        } catch (error) {
            console.error('Error searching Firestore:', error);
        }
    };

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        searchInFirestore(query);
    };

    const getRandomColor = () => {
        const baseColors = ['#3498db', '#e74c3c', '#e67e22', '#9b59b6', '#6750a4']; // Azul, vermelho, laranja, roxo, lilás
        const randomBaseColor = baseColors[Math.floor(Math.random() * baseColors.length)];
      
        // Converter cor hexadecimal para RGB
        const hexToRgb = (hex) => {
          const bigint = parseInt(hex.slice(1), 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;
          return [r, g, b];
        };
      
        // Obter a versão mais escura da cor
        const darkenColor = (color, factor) => {
          const [r, g, b] = hexToRgb(color);
          const darkenedR = Math.floor(r * factor);
          const darkenedG = Math.floor(g * factor);
          const darkenedB = Math.floor(b * factor);
          return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
        };
      
        const darkenedColor = darkenColor(randomBaseColor, Math.random()+0.3); // Fator de escurecimento (ajustável)
      
        return darkenedColor;
    };

    const handleClick = (array) => {
        // Aqui você pode adicionar lógica adicional antes de mostrar ListasProcuras, se necessário
        // Por exemplo, você pode filtrar o array antes de passá-lo para ListasProcuras
    
        // Abra o componente ListasProcuras
        // Este é um exemplo simples, você pode precisar ajustar isso com base na estrutura do seu projeto
        navigation.navigate('ListasProcuras', { array: array });
    };    

    const [colorsHobbies, setColorsHobbies] = useState([]);
    const [colorsCategorias, setColorsCategorias] = useState([]);

    useEffect(() => {
        fetchFonts();
        setHobbies(hobbies.sort((a, b) => b.localeCompare(a)));
        setCategorias(categorias.sort((a, b) => b.localeCompare(a)));

        var generatedColors = [];

        generatedColors = Array.from({ length: hobbies.length }, () => getRandomColor());
        setColorsHobbies(generatedColors);

        generatedColors = Array.from({ length: categorias.length }, () => getRandomColor());
        setColorsCategorias(generatedColors);

    }, []);

    return(
        <ScrollView style={{marginTop: Constants.statusBarHeight}} showsVerticalScrollIndicator={false}>

            <Text style={styles.title}>Explorar</Text>

            <Searchbar
                style={{marginTop:5, marginHorizontal: 10}}
                placeholder="Procurar"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />

            {searchResultsPeople.length>0 && searchQuery.length>0? 
                <View style={{marginLeft:5}}>
                    <Text style={styles.titleSections}>Pessoas</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        
                        {searchResultsPeople.map(item=>
                            <CardPessoa mix={item} navigation={navigation}/>
                            )
                        } 
                    </ScrollView>
                </View>
                :
                null
            }

            {searchResultsPlaces.length>0 && searchQuery.length>0 && usuario!==''? 
                <View style={{marginLeft:5}}>
                    <Text style={styles.titleSections}>Lugares</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        
                        {searchResultsPlaces.map(item=>
                            { 
                                return <CardLugar navigation={navigation} mix={item} usuario={usuario.uid} tela={'pesquisa'} />
                            })
                            
                        } 
                    </ScrollView>
                </View>
                :
                null
            }

            {searchResultsRoles.length>0 && searchQuery.length>0 ? 
                <View style={{marginLeft:5}}>
                    <Text style={styles.titleSections}>Rolês</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {searchResultsRoles.map(item=>
                            <CardRole mix={item} usuario={''} tela={'pesquisa'}/>
                            )
                        } 
                    </ScrollView>
                </View>
                :
                null
            }

            {searchQuery.length<=0?
                <View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.titleSections}>Procurar por hobbies</Text>
                        <IconButton
                            style={{paddingTop:8}}
                            iconColor="#000"
                            icon="arrow-right"
                            size={30}
                            onPress={()=>handleClick(hobbies)}                />
                    </View>

                    <FlatList
                        data={hobbies}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        flexDirection="row"
                        flexWrap="wrap" // This enables wrapping to multiple lines
                        scrollOffset={[0, 250 / 12]}
                        renderItem={({ item, index }) =>{
                            if(index===0){

                            return(
                                <View>
                                    <TouchableOpacity style={[styles.item, { backgroundColor: colorsHobbies[hobbies.length-1] }]}>
                                        <Text style={styles.text}>{hobbies[hobbies.length-1]}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.item, { backgroundColor:  colorsHobbies[hobbies.length-2] }]}>
                                        <Text style={styles.text}>{hobbies[hobbies.length-2]}</Text>
                                    </TouchableOpacity>
                                </View>
                            )   
                            }
                            else if(index<=12){
                                return(
                                    <View>
                                        <TouchableOpacity style={[styles.item, { backgroundColor:  colorsHobbies[hobbies.length-(2*index)-1] }]}>
                                            <Text style={styles.text}>{hobbies[hobbies.length-(2*index)-1]}</Text>
                                        </TouchableOpacity>
            
                                        <TouchableOpacity style={[styles.item, { backgroundColor:  colorsHobbies[hobbies.length-(2*index)-2] }]}>
                                            <Text style={styles.text}>{hobbies[hobbies.length-(2*index)-2]}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )   
                            }
                        }
                        }
                    />

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.titleSections}>Lugares por categoria</Text>
                        <IconButton
                            style={{paddingTop:8}}
                            iconColor="#000"
                            icon="arrow-right"
                            size={30}
                            onPress={()=>handleClick(categorias)}
                            />
                    </View>

                    <FlatList
                        data={categorias}
                        keyExtractor={(item) => item}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        flexDirection="row"
                        flexWrap="wrap" // This enables wrapping to multiple lines
                        scrollOffset={[0, 250 / 12]}
                        renderItem={({ item, index }) =>{
                            if(index===0){

                            return(
                                <View>
                                    <TouchableOpacity style={[styles.item, { backgroundColor:  colorsCategorias[categorias.length-1] }]}>
                                        <Text style={styles.text}>{categorias[categorias.length-1]}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.item, { backgroundColor:  colorsCategorias[categorias.length-2]}]}>
                                        <Text style={styles.text}>{categorias[categorias.length-2]}</Text>
                                    </TouchableOpacity>
                                </View>
                            )   
                            }
                            else if(index<=5){
                                return(
                                    <View>
                                        <TouchableOpacity style={[styles.item, { backgroundColor:  colorsCategorias[categorias.length-(2*index)-1] }]}>
                                            <Text style={styles.text}>{categorias[categorias.length-(2*index)-1]}</Text>
                                        </TouchableOpacity>
            
                                        <TouchableOpacity style={[styles.item, { backgroundColor:  colorsCategorias[categorias.length-(2*index)-2] }]}>
                                            <Text style={styles.text}>{categorias[categorias.length-(2*index)-2]}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )   
                            }
                        }
                        }
                    />

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.titleSections}>Novo na cidade</Text>
                        <IconButton
                            style={{paddingTop:8}}
                            iconColor="#000"
                            icon="arrow-right"
                            size={30}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.titleSections}>Rolês do momento</Text>
                        <IconButton
                            style={{paddingTop:8}}
                            iconColor="#000"
                            icon="arrow-right"
                            size={30}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.titleSections}>Recomendações da galera</Text>
                        <IconButton
                            style={{paddingTop:8}}
                            iconColor="#000"
                            icon="arrow-right"
                            size={30}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>
                </View>
                : null
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title:{
        fontWeight: 100,
        fontSize: 30,
        padding:12,
        fontFamily: 'CircularSpotifyText-Bold'
    },

    titleSections:{
        fontWeight: 100,
        fontSize: 22,
        padding:12,
        paddingTop: 20,
        fontFamily: 'CircularSpotifyText-Bold'
    },
    item: {
        width: 170,
        height: 50,
        borderRadius: 5,
        margin: 10,
        justifyContent: 'center'
    },
    text: {
        fontSize: 15,
        fontFamily: 'CircularSpotifyText-Bold',
        textAlign: "center",
        color: 'white',
        paddingHorizontal:15
    },
    textCardResultado:{
        fontFamily: 'CircularSpotifyText-Book',
        color: '#000',
        fontSize: 13
    }
});

export default Explorar;
