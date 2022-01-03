import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from '../hooks/useAuth'
import tw from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons"
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const DUMMY_DATA = [
    {
        id: 1,
        firstName: "Rohan",
        lastName: "Gore",
        job: "Software Developer",
        photoURL: "https://avatars.githubusercontent.com/u/39983195?v=4",
        age: 23
    },
    {
        id: 2,
        firstName: "Rohan",
        lastName: "Gore",
        job: "Software Developer",
        photoURL: "https://avatars.githubusercontent.com/u/39983195?v=4",
        age: 23
    },
    {
        id: 3,
        firstName: "Rohan",
        lastName: "Gore",
        job: "Software Developer",
        photoURL: "https://avatars.githubusercontent.com/u/39983195?v=4",
        age: 23
    }
]

const HomeScreen = () => {
    // use to navigator to another screen
    const navigation = useNavigation()

    useLayoutEffect(() => {
        // navigation.setOptions({
        //     headerShown: false
        // })
    }, [])

    // taking logout from useAuth file
    const { user, logout } = useAuth()

    // useRef for swipe left and swipe right functionlity onPress button
    const swipeRef = useRef(null)


    // to store profies >> empty array
    const [profiles, setProfiles] = useState([])

    useLayoutEffect(() => {
        // onSnapshot >> real time database listener
        // goal of this function is go to the user's database and if there were no users then open our Model screen
        // it will go in docs inside users >>> used the uid of the user who is logged in
        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
            // if there is no db in users then navigate to ModalScreen
            if (!snapshot.exists()) {
                navigation.navigate('Modal')
            }
        })
        // cleanup
        // if you dont clean this then there will be several listener for that use effect
        return unsubscribe()
    }, [])

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {

            // in passes it will store all the ID's of the passed user
            // in db user >> it will go to a particular user.id >>> in passes collection >>> take snapshot(not realtime one as we are using getDocs not onSnapshot) return the id's
            const passes = await getDocs(collection(db, "user", user.uid, "passes")).then((snapshot) => snapshot.docs.map((doc) => doc.id))


            // same for swipes
            const swipes = await getDocs(collection(db, "user", user.uid, "swipes")).then((snapshot) => snapshot.docs.map((doc) => doc.id))

            // checking if any passes id are present and storing
            const passedUserIds = passes.length > 0 ? passes : ['test']
            const swipedUserIds = swipes.length > 0 ? swipes : ['test']


            console.log("passedUserIds >>> ", passedUserIds)

            // as we have array of collection >>> go to users collection setProfiles will the all the users profile
            // .filter will restrict to show the owns profile image

            // we are querying that: if the id's under the users which are not present in passes id... show that only. Such that the one which are passed will not shown

            // concatenate >>> [...passedUserIds, ...swipedUserIds]
            unsub = onSnapshot(query(collection(db, 'user'), where("id", "not-in", [...passedUserIds, ...swipedUserIds])), (snapshot) => {
                setProfiles(snapshot.docs.filter((doc) => doc.id !== user.uid).map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })))
            })
        }

        //  if you want the useEffect to be the async then create the async func inside then return that function 


        fetchCards()
        return unsub
    }, [db])

    // console.log("profiles >>> ", profiles)

    const swipeLeft = (cardIndex) => {
        // it will handle the empty card
        if (!profiles[cardIndex]) return;

        // it will store the card data which swipe left
        const userSwiped = profiles[cardIndex]
        console.log(`You swiped PASS on ${userSwiped.displayName}`)

        // it will go to user db into the user.id >> into passes >> in userSwiped.id >> store the data of that person
        setDoc(doc(db, 'user', user.uid, 'passes', userSwiped.id), userSwiped)
    }


    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        // it will store the card data which swipe left
        const userSwiped = profiles[cardIndex]

        // to get complete data of the user who loggedin 
        const loggedInprofile = await (await getDoc(doc(db, 'user', user.uid))).data()


        // Check if the other user is SWIPED ON YOU...
        // it will go to user >>> userSwiped.id(person which you swiped will store in you db it will go to that person's collection and check that persion) >> inside swipes collection >> taking YOUR id inside that persons db which you swiped.
        // and check if such id exist 
        getDoc(doc(db, 'user', userSwiped.id, 'swipes', user.uid)).then((documentSnapshot) => {
            // 
            if (documentSnapshot.exists()) {
                // user has swiped on you before you swiped on them
                // CREATE a MATCH
                console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`)

                setDoc(doc(db, "user", user.uid, "swipes", userSwiped.id), userSwiped)

                // CREATE A MATCHED
                // here we are storing it into other db

                // creating a fuction to concat
                setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
                    users: {
                        // it will store data in array
                        [user.uid]: loggedInprofile,
                        [userSwiped.id]: userSwiped
                    },

                    usersMatched: [user.uid, userSwiped.id],
                    timestamp: serverTimestamp()
                })

                navigation.navigate('Match', {
                    loggedInprofile, userSwiped
                })

            } else {
                // if no such data found then Its first interaction with that person

                console.log(`You SWIPED on ${userSwiped.displayName} (${userSwiped.job}) `)

                // it will set in your collection that you swipe that person
                setDoc(doc(db, "user", user.uid, "swipes", userSwiped.id), userSwiped)
            }
        })


        console.log(`You swiped SWIPED on ${userSwiped.displayName}`)

        // it will go to user db into the user.id >> into passes >> in userSwiped.id >> store the data of that person
        setDoc(doc(db, 'user', user.uid, 'swipes', userSwiped.id), userSwiped)
    }

    return (
        <SafeAreaView style={tw('flex-1')}>
            <StatusBar style="auto" />

            {/* Header */}
            <View style={tw('flex-row px-5 justify-between items-center relative')}>
                {/* left header */}
                <TouchableOpacity onPress={logout}>
                    <Image style={tw('h-10 w-10 rounded-full')} source={{ uri: user.photoURL }} />
                </TouchableOpacity>

                {/* middle header */}
                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                    <Image style={tw('h-20 w-20')} source={require('../tinder-logo.png')} />
                </TouchableOpacity>

                {/* right header */}
                {/* navigate to Chat Screen */}
                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
                </TouchableOpacity>
            </View>
            {/* End of Header */}


            {/* Card Deck Swiper */}
            <View style={tw('flex-1 -mt-6')}>
                <Swiper
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: "transparent" }}
                    stackSize={5} //to show the stacks
                    cardIndex={0} //card must be start from 0 index
                    verticalSwipe={false}
                    animateCardOpacity // it will animate while swiping
                    cards={profiles}
                    onSwipedLeft={(cardIndex) => {
                        // it will tell you on which card you swipe
                        console.log("SWIPE PASS")
                        swipeLeft(cardIndex)
                    }}

                    onSwipedRight={(cardIndex) => {
                        // it will tell you on which card you swipe
                        console.log("SWIPE MATCH")
                        swipeRight(cardIndex)
                    }}

                    backgroundColor={'#4FD0E9'}
                    overlayLabels={{
                        // it will tell that on swipe what text you want
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red"
                                },
                            },
                        },

                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4DED30",
                                }
                            }
                        }
                    }}
                    // while rendering if card present then show directly else show the not found
                    renderCard={(card) => card ? (
                        <View style={tw('bg-white h-3/4 relative rounded-xl')}>
                            <Image style={tw('top-0 absolute h-full w-full rounded-xl')} source={{ uri: card.photoURL }} />

                            {/* white box for details */}
                            <View style={[tw(' absolute bottom-0 flex-row bg-white w-full h-20 justify-between px-6 py-2 rounded-b-xl items-center'), styles.cardShadow]}>
                                <View>
                                    <Text style={tw('text-xl font-bold')}>{card.displayName}</Text>
                                    <Text>{card.job}</Text>
                                </View>

                                <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"), styles.cardShadow]}>
                            <Text style={tw('font-bold pb-5')}>No more Profiles</Text>
                            <Image style={tw('h-20 w-20')} height={100} width={100} source={{ uri: "https://links.papareact.com/6gb" }} />
                        </View>
                    )}
                />
            </View>

            <View style={tw('flex flex-row justify-evenly')}>
                {/* in Swiper inBuilt functionality to swipeLeft using useRef */}
                <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()} style={tw('items-center justify-center rounded-full w-16 h-16 bg-red-200 mb-5')}>
                    {/* Entypo is Icon library */}
                    <Entypo name='cross' size={24} color={'red'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => swipeRef.current.swipeRight()} style={tw('items-center justify-center rounded-full w-16 h-16 bg-green-200 mb-5')}>
                    {/* Entypo is Icon library */}
                    <AntDesign name='heart' size={24} color={'green'} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen

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
