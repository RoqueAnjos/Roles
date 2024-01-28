import React from "react";

import {
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({navigation}) =>{

    const checkUser = async () => {

        const userString = await AsyncStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            console.log(user);
            navigation.navigate('MainScreen');
        }
    };

    checkUser();

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.container}>
                    
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Chama a galera</Text>
                        <Text style={styles.title}>Pro rolê</Text>
                        <Text style={styles.body}>
                            Faz o seu rolê e chama a tropa para os seus lugares preferidos.
                            Receba convites de rolês dos seus amigos. 
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button1} onPress={()=> navigation.navigate('Register')}>
                            <Text style={styles.buttonsText}>Criar conta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=> navigation.navigate('SignIn')} style={styles.button2}>
                            <Text style={styles.buttonsText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    contentContainer: {
        paddingHorizontal: 30,

        paddingTop: 150
    },
    title:{
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 35,
        textAlign: 'center',
        color: '#353147'
    },
    body:{
        paddingTop: 20,
        fontSize: 16,
        lineHeight: 23,
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
        borderRadius: 6
    },
    button2:{
        flex:1,
        alignItems: 'center',
        padding: 16,
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        borderWidth:2,
        borderColor: 'white',
        borderRadius:16,
        backgroundColor: '#dfe3e630',
        marginTop:40
    }
})