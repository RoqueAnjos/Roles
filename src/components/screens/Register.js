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

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {initializeApp} from 'firebase/app'
import { firebaseConfig } from "../../../firebaseConfig";

const Register = ({navigation}) =>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleCreateAccount = () =>{
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            console.log('Conta criada');
            const user = userCredential (user);
            console.log(user);
            navigation.navigate('MainScreen')
        })
        .catch(error=>{
            console.log(error)
        })
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.container}>
                    
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Criar Conta</Text>
                    
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

                        <TouchableOpacity onPress={handleCreateAccount} style={styles.signInButton}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                                Criar
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Register;

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