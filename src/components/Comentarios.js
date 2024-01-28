import { Text, IconButton } from 'react-native-paper';
import { FlatList, View, StyleSheet, Image,TextInput } from 'react-native';
import { Avatar } from '@rneui/themed';
import { useState } from 'react';

const Comentarios = (props) =>{

    const idPost = props.idPost;
    const usuario = props.usuario;
    const comentarios = props.comentarios;
    const [newMessage, setNewMessage] = useState('');
    
    const formataData = (timestamp) =>{

        const segundos = timestamp.seconds;
        const nanossegundos = timestamp.nanoseconds;
    
        // Crie um objeto Date a partir de segundos e milissegundos
        const data = new Date(segundos * 1000 + nanossegundos / 1000000);
    

        if(new Date().getFullYear()!==data.getFullYear()){
            return (`${new Date().getFullYear() - data.getFullYear()} a`);
        }else{
            if(new Date().getDate()===data.getDate()){
                return (``);
            }
            else if(new Date().getDate()===data.getDate()+1){
                return (`Ontem às ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`);
            }
            return (`${data.getDate()} de ${nomeDoMes} às ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`);
        }
    }

    const handleButtonPress = () => {
        
    };
    
    return (
        <View style={{flex:1}}>
            {
                comentarios.length > 0 ?
                    <FlatList
                        data={comentarios}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                                
                                <View style={styles.pessoa}>
                                    
                                    <View style={{flexDirection: 'row'}}>
                                        <Avatar
                                            rounded
                                            source={{ uri: item.imagemUser}}
                                            containerStyle={styles.avatarContainer}
                                        />
                                        
                                        <View style={styles.info}>
                                            <Text style={styles.nomeText}>
                                                {item.nomeUser}
                                            </Text>
                                            <Text style={styles.texto}>{item.texto}</Text>
                                            <Text style={{ color: 'gray', marginLeft: 10, marginTop: 2, fontWeight: 700 }}>
                                                Responder
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                                        <IconButton size={20} icon={({ size, color }) => (
                                            <Image
                                                source={require('../images/v-live_21117251111.png')}
                                                style={{ width: size, height: size }}
                                            />
                                        )}/>
                                        <Text style={{marginTop: -12}}>100</Text>
                                    </View>
                                    
                                </View>
                        )}
                    />
                    :
                
                <Text style={{flex: 1,fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>Sem comentários ainda.</Text>
            }

            <View style={styles.containerEnviar}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Mensagem"
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <IconButton size={30} mode='contained' icon='send' style={{marginRight: -10, marginBottom: -10}} onPress={() => handleButtonPress()}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pessoa:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:20
    },
    avatarContainer:{
        height: 30,
        width: 30,
    },
    nomeText:{
        fontWeight: 'bold',
        marginLeft:10,
        fontSize: 16,
        color:'black' 
    },
    timestampText: {
        fontSize: 12,
        color: 'black',
        marginLeft:10,
    },
    info:{
        flexDirection: 'column',     
    },
    texto:{
        marginLeft:10
    },
    containerEnviar:{
        flexDirection: 'row',
    },  
    textInput:{
        flex: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 50,
        height: 45,
        borderColor: '#000',
        backgroundColor: '#fff',
        paddingLeft: 20,
        marginBottom: -15
    },
    containerEnviar:{
        flexDirection: 'row',
        alignItems: 'center',  // Alinha os itens verticalmente
    },  
})
export default Comentarios;