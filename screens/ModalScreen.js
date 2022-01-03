import { useNavigation } from '@react-navigation/native'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import tw from 'tailwind-rn'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import { SafeAreaView } from "react-native-safe-area-context";



const ModalScreen = () => {
    const { user } = useAuth()

    const [image, setImage] = useState("")
    const [job, setJob] = useState("")
    const [age, setAge] = useState("")

    // Form is incomplete
    const incompleteForm = !image || !job || !age

    // for navigation
    const navigation = useNavigation()

    const updateUserProfile = () => {
        // as I've the user ID from useAuth so we use SetDoc instead of addDoc
        // in DOC >> in DB >> name of collection>> >> name of document, {data}
        setDoc(doc(db, 'user', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(() => {
            navigation.navigate('Home')
        }).catch(error => {
            alert(error.message)
        })
    }


    return (
        <SafeAreaView style={tw('flex-1 items-center pt-1')}>
            <Image style={tw('h-20 w-full')} resizeMode="contain" source={{ uri: "https://links.papareact.com/2pf" }} />

            <Text style={tw('text-xl text-gray-500 font-bold p-2')}>Welcome {user.displayName}</Text>

            {/* Inputs */}
            <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 1: The Profile Pic</Text>
            <TextInput value={image} onChangeText={(text) => setImage(text)} style={tw("text-center text-xl pb-2")} placeholder='Enter a Profile Pic URL' />

            <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 2: The Job</Text>
            <TextInput value={job} onChangeText={(text) => setJob(text)} style={tw("text-center text-xl pb-2")} placeholder='Enter a Job' />

            <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 3: The Age</Text>
            <TextInput value={age} onChangeText={(text) => setAge(text)} style={tw("text-center text-xl pb-2")} placeholder='Enter a Age' maxLength={2} keyboardType='numeric' />

            {/* BUTTONS */}
            {/* adding for incompleteform true styling */}
            <TouchableOpacity onPress={updateUserProfile} disabled={incompleteForm} style={[tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-400"), incompleteForm ? tw("bg-gray-400") : tw('bg-red-400')]}>

                <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ModalScreen

const styles = StyleSheet.create({})
