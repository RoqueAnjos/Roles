import React from "react";
import { useState, useEffect } from "react";

import {
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    Alert
} from 'react-native'

import {initializeAuth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    getReactNativePersistence, setPersistence, browserLocalPersistence, inMemoryPersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeApp} from 'firebase/app'
import { firebaseConfig } from "../../../firebaseConfig";

const SignIn = ({navigation}) =>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    if(auth.currentUser!=null) console.log(auth.currentUser.email);
    else console.log('no users');

    const handleSignIn = ()=>{
        setPersistence(auth, browserLocalPersistence).then(
            signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential)=>{
                // Após o login bem-sucedido
                const user = auth.currentUser;
                if (user) {
                    // Armazenar informações do usuário no estado global
                    //dispatch({ type: 'LOGIN', payload: user });

                    // Armazenar informações do usuário no AsyncStorage
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                    navigation.navigate('MainScreen');   
                }
            })
            .catch(error=>{
                console.log(error);
                Alert.alert(error.message);
            })
        )
        
    }


    const {height} = Dimensions.get('window');

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.container}>
                    
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Olá de novo!</Text>
                        <Text style={styles.body}> Bem vindo de volta! </Text>
                    
                        <TextInput 
                            style={styles.input}
                            onChangeText={(text)=> setEmail(text)}
                            placeholder="usuario@gmail.com"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoCorrect={false}
                        />

                        <TextInput 
                            style={styles.input}
                            onChangeText={(text)=> setPassword(text)}
                            placeholder="Senha"
                            autoCorrect={false}
                            secureTextEntry={true}
                        />

                        <TouchableOpacity>
                            <Text style={[styles.buttonsText, {fontWeight: 'bold', lineHeight: 30, textAlign:'right' }]}>
                                Esqueci a senha
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                                Entrar
                            </Text>
                        </TouchableOpacity>

                        <Text style={{textAlign: 'center'}}>Ou continue com</Text>

                        <View style={styles.buttonContainer}>

                            <TouchableOpacity style={styles.button1}>
                                <Image 
                                    source={{uri: 'https://logopng.com.br/logos/google-37.png'}}
                                    style={{width:40, height:40}}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button1}>
                                <Image 
                                    source={{uri: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c516.png'}}
                                    style={{width:40, height:40}}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button1}>
                                <Image 
                                    source={{uri: 'https://www.gov.br/mre/pt-br/delbrasupa/facebook-logo-blue-circle-large-transparent-png.png'}}
                                    style={{width:40, height:40}}
                                />
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    contentContainer: {
        paddingHorizontal: 30,
    },
    title:{
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 35,
        textAlign: 'center',
        color: '#353147'
    },
    body:{
        padding: 20,
        fontSize: 30,
        lineHeight: 35,
        marginBottom: 20,
        fontWeight: '400',
        textAlign: 'center',
        color: '#353147'
    },
    buttonsText:{
        fontWeight: '500',
        color: '#353147'
    },
    button1:{
        flex:1,
        alignItems: 'center',
        backgroundColor: '#ffffff70',
        padding: 16,
        borderWidth:2,
        borderColor: 'white',
        borderRadius:16,
        marginHorizontal: 10,
    },
    button2:{
        flex:1,
        alignItems: 'center',
        padding: 16,
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#dfe3e630',
        marginTop:40
    },
    input:{
        backgroundColor: '#f7f7f7',
        padding: 20,
        borderRadius: 16,
        marginBottom: 10,
    },
    signInButton:{
        backgroundColor: '#fd6d6a',
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',
        marginVertical: 30,
        shadowColor: '#fd6d6a',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: .44,
        shadowRadius: 10.32,
    }
})