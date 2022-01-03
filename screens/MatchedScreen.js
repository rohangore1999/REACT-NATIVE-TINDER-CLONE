import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Image, TouchableOpacity } from 'react-native'
import tw from 'tailwind-rn'

const MatchedScreen = () => {
    const navigation = useNavigation()

    // destructuring the route and take params
    const { params } = useRoute()

    // as we passed loggedInprofile,userSwiped in HomeScreen.js as a params, so here we are destructuring 
    const { loggedInprofile, userSwiped } = params

    return (
        <View style={[tw('h-full bg-red-500 pt-20'), { opacity: 0.89 }]}>
            <View style={tw('justify-center px-10 pt-20')}>
                <Image style={tw('h-20 w-full')} source={{ uri: 'https://links.papareact.com/mg9' }} />
            </View>

            <Text style={tw("text-white text-center mt-5")}>You and {userSwiped.displayName} have liked each other.
            </Text>

            <View style={tw('flex-row justify-evenly mt-5')}>
                <Image style={tw('h-32 w-32 rounded-full')} source={{ uri: loggedInprofile.photoURL }} />
                <Image style={tw('h-32 w-32 rounded-full')} source={{ uri: userSwiped.photoURL }} />
            </View>

            <TouchableOpacity style={tw('bg-white m-5 px-10 py-8 rounded-full mt-20')} onPress={() => {
                // it will close the transparent screen and then it will navigate to ChatScreen
                navigation.goBack()
                navigation.navigate('Chat')

            }}>
                <Text style={tw('text-center')}>Send a Message</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MatchedScreen

const styles = StyleSheet.create({})
