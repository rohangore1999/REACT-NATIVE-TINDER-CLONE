import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import Header from '../components/Header'
import { SafeAreaView } from "react-native-safe-area-context";
import getMatchUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import tw from 'tailwind-rn'
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';


const MessageScreen = () => {
    const { user } = useAuth()

    // use params as we passed the matchDetails from Navigation
    const { params } = useRoute()

    const { matchDetails } = params

    const [input, setInput] = useState("")

    const [messages, setMessages] = useState([])

    const sendMessage = () => {
        // it will add in matched database under messages collection
        addDoc(collection(db, "matches", matchDetails.id, "messages"), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input
        })

        setInput("")
    }


    // Realtime listener for messages
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")), snapshot => setMessages(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))))

        return unsubscribe
    }, [matchDetails, db])


    return (

        <SafeAreaView style={tw('flex-1')}>
            <Header title={getMatchUserInfo(matchDetails.users, user.uid).displayName} callEnabled />


            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw('flex-1')} keyboardVerticalOffset={10}>

                {/* CHAT MESSAGES */}
                {/* TouchableWithoutFeedback >> this area is touchable and when press in this area we have to hide keyboard */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {/* FlatList of Messages*/}
                    <FlatList
                        keyExtractor={item => item.id}
                        data={messages}
                        inverted={-1} // to start from bottom
                        // renderItem always takes {({ item })} 
                        // item: message >>> renaming the item as message
                        // check if message.id is === userid who logged in then it is sender else receiver
                        renderItem={({ item: message }) =>
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} message={message} />
                            ) : (
                                <ReceiverMessage key={message.id} message={message} />
                            )
                        }
                        style={tw('pl-4')}

                    />
                </TouchableWithoutFeedback>




                {/* BUTTONS */}
                <View style={tw('flex-row bg-white justify-between items-center border-t border-gray-200 px-5 py-2')}>
                    <TextInput style={tw('h-10 text-lg')} placeholder='Send Message...' onChangeText={setInput} onSubmitEditing={sendMessage} value={input} />

                    <Button onPress={sendMessage} title='Send' color="#FF5864" />
                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default MessageScreen

const styles = StyleSheet.create({})
