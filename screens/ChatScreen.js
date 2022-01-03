import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import ChatList from '../components/ChatList';
import Header from '../components/Header';


const ChatScreen = () => {
    return (
        <SafeAreaView>
            <Header title="Chat" />

            {/* it will show the list of chats which are matched with you */}
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({})
