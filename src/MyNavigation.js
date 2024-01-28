import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './components/screens/Welcome';
import SignIn from './components/screens/SignIn';
import MainScreen from './components/MainScreen';
import Register from './components/screens/Register';
import PerfilPessoa from './components/screens/PerfilPessoa';

const Stack = createNativeStackNavigator();

export default function MyNavigation() {
    return(
        <NavigationContainer >
            <Stack.Navigator>
                <Stack.Screen name='Welcome' component={Welcome} options={{headerShown: false}}/>
                <Stack.Screen name='SignIn' component={SignIn} options={{headerShown: false}}/>
                <Stack.Screen name='Register' component={Register} options={{headerShown: false}}/>
                <Stack.Screen name='MainScreen' component={MainScreen} options={{headerShown:false}}/>
                <Stack.Screen name='PerfilPessoa' component={PerfilPessoa} options={{headerShown:true}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}