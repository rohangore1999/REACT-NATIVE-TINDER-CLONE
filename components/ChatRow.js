import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useAuth from '../hooks/useAuth'
import getMatchUserInfo from '../lib/getMatchedUserInfo'
import tw from 'tailwind-rn'
import { db } from '../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'


const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation()
    const { user } = useAuth()
    const [matchedUserInfo, setMatchedUserInfo] = useState(null)

    useEffect(() => {
        //  it will take the matchDetails and user(who loggedin) and strip it down to matchDetails with flatterned array
        setMatchedUserInfo(getMatchUserInfo(matchDetails.users, user.uid))
    }, [matchDetails, user])


    // to store last message
    const [lastMessage, setLastMessage] = useState("")

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message))
        // as we have sorted the messages timestamp in desc so taking first element after sorting

        return unsubscribe
    }, [matchDetails, db])


    return (
        <TouchableOpacity onPress={() => navigation.navigate('Message', { matchDetails })} style={[tw('flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg'), styles.cardShadow]}>
            <Image style={tw('rounded-full h-16 w-16 mr-4')} source={{ uri: matchedUserInfo?.photoURL }} />

            <View>
                <Text style={tw('text-lg font-semibold')}>
                    {matchedUserInfo?.displayName}
                </Text>
                {/* if no last message then say hi */}
                <Text>{lastMessage || "Say Hi"}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2
    }
})
