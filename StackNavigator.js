import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import useAuth from './hooks/useAuth'
import ChatScreen from './screens/ChatScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import ModalScreen from './screens/ModalScreen'

import { TransitionPresets } from '@react-navigation/stack';
import MatchedScreen from './screens/MatchedScreen'
import MessageScreen from './screens/MessageScreen'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
    // useAuth we are getting from useAuth.js
    // and user we are destructuring from value
    const { user } = useAuth()


    return (
        // making default header False
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    {/* Stack.Group >>> is just to group the screens, as we need Modal screen and our Normal screns so that the back functionality should not mixed with model */}
                    <Stack.Group>
                        {/* HomeScreen */}
                        <Stack.Screen name="Home" component={HomeScreen} />

                        {/* ChatScreen */}
                        <Stack.Screen name="Chat" component={ChatScreen} />

                        {/* MessagesScree */}
                        <Stack.Screen name="Message" component={MessageScreen} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        {/* Modal screen for middle header */}
                        <Stack.Screen name="Modal" component={ModalScreen} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
                        {/* Modal screen for middle header */}
                        <Stack.Screen name="Match" component={MatchedScreen} />
                    </Stack.Group>
                </>
            ) : (
                < Stack.Screen name="Login" component={LoginScreen} />
            )
            }



        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})
