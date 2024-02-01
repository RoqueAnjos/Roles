import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text,TouchableWithoutFeedback } from "react-native";
import { getFirestore } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { doc } from 'firebase/firestore';
import { firebaseConfig } from "../../../firebaseConfig";
import { Avatar } from '@rneui/themed';
import { initializeApp } from "firebase/app";
import DetalhesRole from "../DetalhesRole";
import { Button, IconButton,Modal, FAB, Menu, Divider,SegmentedButtons, ActivityIndicator, Chip, Checkbox} from 'react-native-paper';
import MyCalendar from "../MyCalendar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import Confirmados from "../Confirmados";
import { Image } from "react-native";
import {FontAwesome} from '@expo/vector-icons'

const MeusRoles = ({navigation, route}) => {

    const [fontLoaded, setFontLoaded] = useState(false);

    const [selectedChip, setSelectedChip] = useState('Hoje');

    const [canceladosChecked, setCanceladosChecked] = useState(false);
    const [realizadosChecked, setRealizadosChecked] = useState(false);
    const [combinadosChecked, setCombinadosChecked] = useState(false);
    const [esseAnoChecked, setEsseAnoChecked] = useState(false);
    const [todosChecked, setTodosChecked] = useState(false);

    const handleCheckboxToggle = (checkboxType) => {
        switch (checkboxType) {
        case 'cancelados':
            setCanceladosChecked(!canceladosChecked);
            break;
        case 'realizados':
            setRealizadosChecked(!realizadosChecked);
            break;
        case 'combinados':
            setCombinadosChecked(!combinadosChecked);
            break;
        case 'esseAno':
            setEsseAnoChecked(!esseAnoChecked);
            break;
        case 'todos':
            setTodosChecked(!todosChecked);
            break;
        default:
            break;
        }
    };

    const fetchFonts = () => {
      return Font.loadAsync({
        'CircularSpotifyText-Bold': require('../../../assets/fonts/CircularSpotifyText-Bold.otf'),
        'CircularSpotifyText-Medium': require('../../../assets/fonts/CircularSpotifyText-Medium.otf'),
        'CircularSpotifyText-Light': require('../../../assets/fonts/CircularSpotifyText-Light.otf'),
        'CircularSpotifyText-Book': require('../../../assets/fonts/CircularSpotifyText-Book.otf')  
    });
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'maindb');

    const [modeVisibility, setModeVisibility] = useState('list');
    const [showProgress, setShowProgress] = useState(true);

    const [imagensRoles, setimagensRoles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
  
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);
    const [confirmadosModal, setConfirmadosModal] = useState([]);

    const containerStyle = {borderRadius: 15, backgroundColor: 'white', padding: 10, marginHorizontal: 20, justifyContent: 'center', height: 600};   

    const {usuario} = route.params;

    const mostraConfirmados = (confirmados, org) =>{
        showModal();
        setConfirmadosModal(confirmados);
        setOrganizadores(org);
    }

    const abreChat = (imagem, id, nome, descricao)=>{
        navigation.navigate('ChatRoom', {imagem: imagem, id: id, name: nome, descricao: descricao });
    }

    const amigosUsuario = usuario['amigos'];

    const [roles, setRoles] = useState([]);
    const [imagensAmigos, setImagensAmigos] = useState([]);
    const [organizadores, setOrganizadores] = useState([]);

    useEffect(()=>{
        hideModal();
        // Função para obter os dados do Firestore
        const pegaRoles = async () => {
          try {
            
            const roleStorage = await AsyncStorage.getItem('meusRoles');
          
            if(roleStorage!==null){
                const roleJson = await JSON.parse(roleStorage);
                setRoles(roleJson);
            }

          } catch (error) {
            console.error('Tela MeusRoles. Erro ao buscar os dados do Firestore:', error);
          }
        };
  
        // Chame a função para buscar os roles
        pegaRoles();
          
        const pegaimagensAmigos = async () => {
            const imagensStorage = await AsyncStorage.getItem('imagensAmigos');
            const imagens = await JSON.parse(imagensStorage);

            /*
            // Crie um array de promessas para buscar as imagens
            const promises = amigosUsuario.map(async (amigo) => {
              const documentRef = doc(db, 'users', amigo);
              const documentSnapshot = await getDoc(documentRef);
              const data = documentSnapshot.data().imagemPerfil;
              imagens.push({ id: amigo, imagemPerfil: data });
            });
          
            // Use Promise.all para aguardar a conclusão de todas as chamadas assíncronas
            await Promise.all(promises);
          
            //await AsyncStorage.setItem('imagensAmigos', JSON.stringify(imagens));

            */
            // Após todas as chamadas assíncronas serem concluídas, defina o estado imagensAmigos
            setImagensAmigos(imagens);
        };

        pegaimagensAmigos();

        const carregaFontes = async ()=>{
            await fetchFonts();
            setFontLoaded(true);
        }
        carregaFontes();
          
    }, [])
    
    useEffect(()=>{ 
        const pegaImagens = async () =>{
            const rolesData = await Promise.all(
                roles.map(async (role) => {
                  const documentRef = doc(db, 'roles', role.idRole);
                  const documentSnapshot = await getDoc(documentRef);
                  const data = documentSnapshot.data().imagens[0];
                  return data;
                })
            );
                
            setimagensRoles(rolesData);    
        }

        pegaImagens();
        
    }, [roles])
    

    const [open, setOpen] = useState(false);

    const onStateChange = ({ open }) => setOpen(open);

    const mostraTarja = (timestamp, index) =>{

        // Função auxiliar para adicionar um zero à esquerda, se necessário
        function padZero(value) {
            return value.toString().padStart(2, '0');
        }

        const nomesDosMeses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const convertToDate = (variavel) =>{
          const segundos = variavel.seconds;
          const nanossegundos = variavel.nanoseconds;
      
          // Crie um objeto Date a partir de segundos e milissegundos
          return new Date(segundos * 1000 + nanossegundos / 1000000);
        }
        
        const data = convertToDate(timestamp);
    
        const nomeDoMes = nomesDosMeses[data.getMonth()];
    
        // Verifica se a mensagem foi enviada hoje
        const hoje = new Date();
        const foiEnviadaHoje = hoje.toDateString() === data.toDateString();

        if(index!==-1 && index!==0 && roles[index-1]!==undefined){
          const dataMensagemAnterior = convertToDate(roles[index-1].quando);
          if(
            dataMensagemAnterior.getDate() === data.getDate() &&
            dataMensagemAnterior.getMonth() === data.getMonth() &&
            dataMensagemAnterior.getFullYear() === data.getFullYear() 
          ){
            return null;
          }
        }

        if(index===-1){
            return `${padZero(data.getDate())}/${padZero(data.getMonth() + 1)}/${data.getFullYear()} ${padZero(data.getHours())}:${padZero(data.getMinutes())}`;
        }
    
        if(foiEnviadaHoje){return 'Hoje'}
        
        if(hoje.getDate() === data.getDate()+1 &&
          hoje.getMonth() === data.getMonth() &&
          hoje.getFullYear() === data.getFullYear()
        ){
          return 'Ontem'
        }else if(hoje.getDate() === data.getDate()-1 &&
            hoje.getMonth() === data.getMonth() &&
            hoje.getFullYear() === data.getFullYear()
        ){
            return 'Amanhã'
        }
        // Agora você pode formatar a data como desejar
        return `${data.getDate()} de ${nomeDoMes} de ${data.getFullYear()}`;
    
    }

    const [menuRoleVisible, setMenuRoleVisible] = React.useState(null);
    const [menuFilterVisible, setMenuFilterVisible] = React.useState(false);

    const openMenu = (index) => setMenuRoleVisible(index);

    const closeMenu = () => {
        setMenuRoleVisible(null);
        setMenuFilterVisible(false);
    }

    const [valueButtonSegmented, setValueButtonSegmented] = React.useState('lista');

    useEffect(() => {
        if(roles.length>0)  setShowProgress(false);
    }, [roles]);

    if (!fontLoaded) {
        return (null
        );
    }

    const handleChipPress = (chipName) => {
        setSelectedChip(chipName);
    };

    return(
        <View style={{ flex: 1, marginTop: Constants.statusBarHeight}}>
            <SegmentedButtons
                style={{marginTop:10, marginHorizontal: 10}}
                value={valueButtonSegmented}
                onValueChange={setValueButtonSegmented}
                buttons={[
                {
                    icon: 'format-list-bulleted',
                    value: 'lista',
                    label: 'Lista',
                    labelStyle: {fontFamily: 'CircularSpotifyText-Bold'},
                    onPress: ()=> setModeVisibility('list'),
                },
                {
                    icon: 'calendar',
                    value: 'calendario',
                    label: 'Calendário',
                    labelStyle: {fontFamily: 'CircularSpotifyText-Bold'},
                    onPress: ()=> setModeVisibility('calendar')
                },
                ]}
            />
            {modeVisibility === 'list' ?
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: 5}}>
                        <Menu
                            visible={menuFilterVisible}
                            onDismiss={closeMenu}
                            anchor={<Chip style={{margin:5}} icon={"filter"} textStyle={{fontFamily: 'CircularSpotifyText-Book'}} mode="flat" onPress={() => setMenuFilterVisible(true)}>Filtrar</Chip>}
                        >
                            <Menu.Item trailingIcon={canceladosChecked ? 'check' : null} style={canceladosChecked ? {backgroundColor: 'rgba(103, 80, 164, 0.6)'} : null} titleStyle={[canceladosChecked ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Light'}]} onPress={() => {handleCheckboxToggle("cancelados")}} title="Cancelados" />
                            <Menu.Item trailingIcon={realizadosChecked ? 'check' : null} style={realizadosChecked ? {backgroundColor: 'rgba(103, 80, 164, 0.6)'} : null} titleStyle={[realizadosChecked ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Light'}]}  onPress={() => {handleCheckboxToggle("realizados")}} title="Realizados" />
                            <Menu.Item trailingIcon={combinadosChecked ? 'check' : null} style={combinadosChecked ? {backgroundColor: 'rgba(103, 80, 164, 0.6)'} : null} titleStyle={[combinadosChecked ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Light'}]}  onPress={() => {handleCheckboxToggle("combinados")}} title="Combinados" />
                            <Divider />
                            <Menu.Item trailingIcon={esseAnoChecked ? 'check' : null} style={esseAnoChecked ? {backgroundColor: 'rgba(103, 80, 164, 0.6)'} : null} titleStyle={[esseAnoChecked ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Light'}]}  onPress={() => {handleCheckboxToggle("esseAno")}} title="Esse ano" />
                            <Menu.Item trailingIcon={todosChecked ? 'check' : null} style={todosChecked ? {backgroundColor: 'rgba(103, 80, 164, 0.6)'} : null} titleStyle={[todosChecked ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Light'}]}  onPress={() => {handleCheckboxToggle("todos")}} title="Todos" />
                        </Menu>
                        <Chip style={[selectedChip === 'Semana' && styles.selectedChip, {margin:5}, selectedChip !== 'Semana' ? {backgroundColor: 'transparent'} : null]} mode="outlined" textStyle={[selectedChip === 'Semana' ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Book'}]} onPress={() => handleChipPress('Semana')}>Esta semana</Chip>
                        <Chip style={[selectedChip === 'Mês' && styles.selectedChip, {margin:5}, selectedChip !== 'Mês' ? {backgroundColor: 'transparent'} : null]} mode="outlined" textStyle={[selectedChip === 'Mês' ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Book'}]} onPress={() =>  handleChipPress('Mês')}>Este mês</Chip>
                        <Chip style={[selectedChip === 'Hoje' && styles.selectedChip, {margin:5}, selectedChip !== 'Hoje' ? {backgroundColor: 'transparent'} : null]} mode="outlined" textStyle={[selectedChip === 'Hoje' ? {color: '#fff'} : null, {fontFamily: 'CircularSpotifyText-Book'}]} onPress={() =>  handleChipPress('Hoje')}>Hoje</Chip>
                    </ScrollView>

                    {showProgress?
                        <ActivityIndicator animating={showProgress} size={'large'} />
                        :null
                    }
                    {roles.map((role, index) =>{

                        return(

                        <View style={[styles.container, mostraTarja(role['quando'], index)===null ? {marginTop:3} : null]} key={role.idRole} >
                            {mostraTarja(role['quando'], index)!==null ?
                                    <View style={styles.dayBannerContainer}>
                                        <Text style={styles.dayBannerText}>{mostraTarja(role['quando'], index)}</Text>
                                    </View>
                                    : null
                            }
                            <View style={styles.role}>
                                
                                <View style={styles.info}>
                                    <View style={{ flexDirection: 'row'}}>
                                        <Image
                                            source={{ uri: role.imagens[0] }}
                                            style={{borderRadius:10, height: 100, width: 100, marginTop: 13}}
                                        />
                                        <View style={{marginLeft:10}}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Text style={{ fontFamily: 'CircularSpotifyText-Bold', fontSize:16}}>{role.titulo}</Text>
                                                <Menu
                                                    visible={menuRoleVisible === index}
                                                    onDismiss={closeMenu}
                                                    anchor={<IconButton onPress={()=>openMenu(index)}size={22} style={{marginTop:4}} icon={'dots-horizontal-circle'} iconColor={'rgba(103, 80, 164, 1)'} />                                    }
                                                >
                                                    <Menu.Item leadingIcon={'pencil-outline'} titleStyle={{fontFamily: 'CircularSpotifyText-Light'}} onPress={() => {}} title="Editar" />
                                                    <Divider />
                                                    <Menu.Item leadingIcon={'email-send-outline'} onPress={() => {}} titleStyle={{fontFamily: 'CircularSpotifyText-Light'}} title="Convidar" />
                                                    <Divider />
                                                    <Menu.Item leadingIcon={'exit-run'} onPress={() => {}} titleStyle={{fontFamily: 'CircularSpotifyText-Light'}} title="Desistir" />
                                                    <Divider />
                                                    <Menu.Item leadingIcon={'cancel'} onPress={() => {}} titleStyle={{fontFamily: 'CircularSpotifyText-Light'}} title="Cancelar" />
                                                </Menu>
                                            </View>
             
                                            <View style={{ flexDirection: 'row', marginTop: -10, alignItems: "center"}}>
                                                <FontAwesome name="calendar" size={13} color="black" style={{ marginRight: 8}}/>
                                                <Text style={{fontSize: 13, fontFamily: 'CircularSpotifyText-Book'}}>{mostraTarja(role['quando'], -1)}</Text>
                                            </View>
                                            
                                            <View style={{ flexDirection: 'row', marginTop:1}}>
                                                <FontAwesome name="map-marker" size={20} color="black" style={{ marginRight: 8, marginBottom:2 }}/>
                                                <Text style={{fontFamily: 'CircularSpotifyText-Book', fontSize: 13}}>{role.local}, {role.cidade}-{role.estado}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', marginTop: 5}}>
                                                {role.confirmados.map(pessoaConfirmada =>
                                                    amigosUsuario.includes(pessoaConfirmada) ?
                                                        <Avatar
                                                            rounded
                                                            source={{ uri: imagensAmigos.find(item => item.id === pessoaConfirmada)?.imagemPerfil }}
                                                            containerStyle={styles.avatarAmigos}
                                                            key={pessoaConfirmada}
                                                        />
                                                        :
                                                        null
                                                )}
                                                <Text style={{ paddingRight: '10px', marginTop: 2, fontFamily: 'CircularSpotifyText-Light', fontSize: 13 }}>{role.confirmados.length > 0 ? `${role.confirmados.length} pessoas` : 'Nenhuma pessoa confirmada' } </Text>
                                                {role.confirmados.length > 0 ?
                                                    <TouchableWithoutFeedback onPress={() => mostraConfirmados(role.confirmados, role.organizadores)}>
                                                        <Text style={{ color: 'gray', marginLeft: 10, marginTop: 2, fontFamily: 'CircularSpotifyText-Bold', fontSize: 13}}>Ver todos</Text>
                                                    </TouchableWithoutFeedback>
                                                    :
                                                    null
                                                }
                                            </View>  

                                        </View>

                                        <Button style={{alignSelf: "center"}} textColor="black" mode="outlined" onPress={()=>console.log('Press')} 
                                            icon={({ size, color }) => (  
                                                role.curtidas.includes(usuario.uid) ? 
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
                                            <Text style={{fontFamily: 'CircularSpotifyText-Book', fontSize: 13}}>{role.curtidas.length}</Text>
                                        </Button>

                                    </View>
                            
                                    <View >
                                        {role['chatDaGalera'] === true ?
                                            <Button textColor="black" icon="chat-outline" onPress={() => abreChat(imagensRoles[index], role.idRole, role.titulo, role['descrição'])}><Text style={{  fontFamily: 'CircularSpotifyText-Book' }}>Chat da galera</Text> </Button>
                                            :
                                            <Text style={{ marginBottom: '10px'}}>Chat não criado</Text>
                                        }
                                    </View>
                                </View>
                            
                                
                            </View>
                        </View>
                    )})}                    
                </ScrollView>
                :
                <MyCalendar roles={roles} imagensRoles={imagensRoles} imagensAmigos={imagensAmigos} amigosUsuario={amigosUsuario}/>
            }

            <FAB.Group
                open={open}
                modalVisible
                icon={open ? 'chevron-down' : 'chevron-up'}
                actions={[
                    { 
                        icon: 'plus',
                        label: 'Novo rolê', 
                        onPress: () => console.log('Pressed add') },
                    {
                        icon: 'email',
                        label: 'Convites',
                        onPress: () => console.log('Pressed convites'),
                    },
                ]}
                onStateChange={onStateChange}
                onPress={() => {
                    if (open) {
                    // do something if the speed dial is open
                    }
                }}
            />

            <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <Confirmados navigation={navigation} idAmigos={confirmadosModal} organizadores={organizadores}/>
            </Modal>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginHorizontal: 5,
    },
    info: {
        paddingLeft: 10,
    },
    role:{
        marginTop: 8,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderStyle: 'solid'
    },  
    avatarAmigos: {
        borderWidth: 1,
        borderColor: 'white',
        height:20,
        width:20
    },
    pessoa:{
        flexDirection: 'row',
        margin: 10,
        padding: 5,
        borderColor: 'rgba(103, 80, 164, 1)',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth:1
    },
    dayBannerContainer: {
        alignItems: 'center',
    },
    dayBannerText: {
        backgroundColor: 'rgba(103, 80, 164, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        fontFamily: 'CircularSpotifyText-Book'
    },
    selectedChip: {
        backgroundColor: 'rgba(103, 80, 164, 0.9)', // Altere a cor desejada
    },
})

export default MeusRoles;