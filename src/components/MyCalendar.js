import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, FlatList, Text } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { isSameDay } from 'date-fns';
import { useWindowDimensions } from "react-native";
import { Avatar } from '@rneui/themed';
import DetalhesRole from './DetalhesRole';
import {IconButton, Menu, Divider, Button, ActivityIndicator} from 'react-native-paper';

const MyCalendar = (props) => {
    const [showRole, setShowRole] = useState(false);
    const [showProgress, setShowProgress] = useState(true);

    const windowDimensions = useWindowDimensions();

    const  [rolesEncontrados, setRoleEncontrados] = useState([]);

    const {roles} = props;
    const {imagensAmigos} = props;
    const {imagensRoles} = props;
    const {amigosUsuario} = props;

    const formataData = (timestamp) =>{

        const segundos = timestamp.seconds;
        const nanossegundos = timestamp.nanoseconds;

        // Crie um objeto Date a partir de segundos e milissegundos
        const data = new Date(segundos * 1000 + nanossegundos / 1000000);

        return data
    }

    const todosOsQuandos = roles.map(role => formataData(role.quando));

    // Data atual
    const today = moment();

    const [selectedStartDate, setSelectedStartDate] = useState(today);

    // Array para armazenar estilos personalizados para datas específicas
    const customDatesStyles = todosOsQuandos.map(date => ({
        date: moment(date),
        style: { backgroundColor: '#00b894'},
        textStyle: { color: 'white' },
        containerStyle: [],
        allowDisabled: true,
    }));

    const [menuVisible, setMenuVisible] = useState(null);

    const openMenu = (index) => setMenuVisible(index);

    const closeMenu = () => setMenuVisible(null);
    
    
    useEffect(() => {
        setShowRole(false);
        const fetchData = async () => {
            try {
                // Simulando uma operação assíncrona (por exemplo, uma requisição à API)
                await new Promise(resolve => setTimeout(resolve, 2000));
        
                const dataSelecionada = new Date(selectedStartDate);
                const indicesDosElementos = todosOsQuandos
                    .flatMap((data, index) => isSameDay(data, dataSelecionada) ? [index] : [])

                const objetosSelecionados = indicesDosElementos.map(indice => roles[indice]);

                if (indicesDosElementos.length > 0) {
                    setRoleEncontrados(objetosSelecionados);
                } else {
                    setShowRole(false);
                    setRoleEncontrados([]);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                // Após a conclusão da operação, esconde o ActivityIndicator
                setShowRole(true);
                setShowProgress(false);
            }
        };
    
        fetchData();
      }, [selectedStartDate]);

    useEffect(() => {
        setShowRole(true);
    }, [rolesEncontrados]);

    return(
        <View style={styles.container}>
            <CalendarPicker  
                customDatesStyles={customDatesStyles}
                selectedDayColor='#add8e6' 
                selectedDayTextColor='black'
                todayBackgroundColor='rgba(103, 80, 164, 0.6)'
                todayTextStyle={{color: 'white'}}
                months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                weekdays={['Dom', 'Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sab']}
                previousTitle="Anterior"
                nextTitle="Próximo"
                selectMonthTitle="Mês em "
                selectYearTitle='Ano'
                onDateChange={setSelectedStartDate} 
            />

            {!showProgress && showRole ?
                <FlatList
                    style={{height: windowDimensions.height}}
                    data={rolesEncontrados}
                    keyExtractor={(item) => item.idRole}
                    renderItem={({ item, index }) => {
                        return(
                            <View style={styles.role} key={item.idRole}>           
                                <View style={styles.info}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Avatar
                                                rounded
                                                size={"medium"}
                                                source={{ uri: imagensRoles[index] }}
                                                containerStyle={styles.avatarContainer}
                                            />
                                            <View style={{ marginTop: 5 }}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: 'rgba(103, 80, 164, 1)' }}>{item.titulo}</Text>
                                                    <DetalhesRole />
                                                </View>
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                                    {item.confirmados.map(pessoaConfirmada =>
                                                        amigosUsuario.includes(pessoaConfirmada) ?
                                                            <Avatar
                                                                rounded
                                                                source={{ uri: imagensAmigos.find(i => i.id === pessoaConfirmada)?.imagemPerfil }}
                                                                containerStyle={styles.avatarAmigos}
                                                                key={pessoaConfirmada}
                                                            />
                                                            :
                                                            null
                                                    )}
                                                    <Text style={{ paddingRight: '10px', marginTop: 2 }}>{item.confirmados.length > 0 ? `${item.confirmados.length} pessoas confirmadas` : 'Sem pessoas confirmadas' } </Text>
                                                    {item.confirmados.length > 0 ?
                                                        <TouchableWithoutFeedback onPress={() => mostraConfirmados(item.confirmados)}>
                                                            <Text style={{ color: 'gray', marginLeft: 10, marginTop: 2, fontWeight: 700 }}>Ver todos</Text>
                                                        </TouchableWithoutFeedback>
                                                        :
                                                        null
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    
                                        <Menu
                                            visible={menuVisible === index}
                                            onDismiss={closeMenu}
                                            anchor={<IconButton onPress={()=>openMenu(index)} icon={'dots-vertical'} iconColor={'gray'} />                                    }
                                        >
                                            <Menu.Item leadingIcon={'pencil'} onPress={() => {}} title="Editar" />
                                            <Divider />
                                            <Menu.Item leadingIcon={'alarm-light'} onPress={() => {}} title="Notificações" />
                                            <Divider />
                                            <Menu.Item leadingIcon={'exit-run'} onPress={() => {}} title="Desistir" />
                                            <Divider />
                                            <Menu.Item leadingIcon={'cancel'} onPress={() => {}} title="Cancelar" />
                                        </Menu>
                            
                                    </View>
                            
                                    <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
                                        {item['chatDaGalera'] === true ?
                                            <Button icon="chat-outline" onPress={() => abreChat(imagensRoles[index], item.idRole, item.titulo, item['descrição'])}><Text style={{ color: 'rgba(103, 80, 164, 1)', fontWeight: "700" }}>Chat da galera</Text> </Button>
                                            :
                                            <Text style={{ marginBottom: '10px', color: 'rgba(103, 80, 164, 1)' }}>Chat não criado</Text>
                                        }
                                        {item['conviteAberto'] === true ?
                                            <Button icon="email-send" onPress={() => convidarAmigos(item.idRole)}>
                                                <Text style={{ color: 'rgba(103, 80, 164, 1)', fontWeight: "700" }}>Convidar</Text>
                                            </Button>
                                            :
                                            <Text style={{ marginBottom: '10px', color: 'rgba(103, 80, 164, 1)' }}>O organizador deste rolê não permite convidados</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        );
                    }
                }
                /> 
                : null
            }

            <ActivityIndicator animating={!showRole || showProgress} size={'large'} />
            
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:30
    },
    info: {
        paddingLeft: 10,
    },
    infoText: {
        marginBottom: 8,
    },
    avatarContainer: {
        borderWidth: 1,
        borderColor: 'white',
        height: 58,
        width: 58,
        marginTop: 10,
    },
    role:{
        marginTop: 10,
        marginHorizontal: 5,
        borderWidth: 1,
        borderStyle:"solid",
        borderRadius: 10,
        borderColor: 'rgba(103, 80, 164, 1)',
    },  
    avatarAmigos: {
        borderWidth: 1,
        borderColor: 'white',
        height:25,
        width:25
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
        backgroundColor: '#CCCCCC',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
});

export default MyCalendar;
