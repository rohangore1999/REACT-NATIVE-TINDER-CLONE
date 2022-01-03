import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import tw from 'tailwind-rn'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import ChatRow from './ChatRow'

const ChatList = () => {
    const { user } = useAuth()
    const [matches, setMatches] = useState([])

    useEffect(() => {
        // from matches db where user.uid contain in array, it will take the snapshot (id)
        const unsubscribe = onSnapshot(query(collection(db, "matches"), where("usersMatched", "array-contains", user.uid)), (snapshot) => setMatches(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))))

        return unsubscribe
    }, [user])

    console.log("matches >>>", matches)

    return matches.length > 0 ? (
            <FlatList //it is bydefault the scrollable list
                style={tw('h-full')}
                data={matches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ChatRow matchDetails={item} />}
            />
        ) : (
            <View style={tw('p-5')}>
                <Text style={tw('text-center text-lg')}>No matches at the moment...</Text>
            </View>
        )
}

export default ChatList

const styles = StyleSheet.create({})
