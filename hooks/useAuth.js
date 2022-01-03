import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "@firebase/auth"
import * as Google from 'expo-google-app-auth'

import { auth } from '../firebase'

// AuthContext is something which will provide you the Authentication slice(like redux)
// and initially it is null/empty
const AuthContext = createContext({})

const config = {
    // from google-serice.json for Android
    androidClientId: '245456058571-bcdmh3ncfp5q2jhhdu51bpoqohdt42ps.apps.googleusercontent.com',
    // from GoogleSerice-Info.plist for IOS
    iosClientId: '245456058571-3vtabhd3pm5tf2lk8atma9rp1cqnnhtv.apps.googleusercontent.com',
    
    androidStandaloneAppClientId: '245456058571-ch2m669m0ricaa9mcaqfjnl0g71h0osu.apps.googleusercontent.com',
    behavior: 'web',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"]
}

// in children is anything which is under <AuthProvider> tag in App.js
export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    // by default it is true so it wil block the UI as the beginning...
    const [loadingInitial, setloadingInitial] = useState(true)

    // loadingState >> any kind of UI blocking logic. for global loading state
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        // it is listening and fire when user change(login/logout)
        // as a response it will give you user
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // user loggedin
                setUser(user)
            } else {
                // not loggedin
                setUser(null)
            }

            // after the user whether set or not, the setloadingInitial will false
            setloadingInitial(false)
        })

        // to cleanup function
        return unsubscribe
    }, [])


    // LOGOUT
    const logout = () => {
        // show loading UI
        setLoading(true)

        // it will signOut the current user who is loggedin
        signOut(auth).catch((error) => setError(error)).finally(() => setLoading(false))
    }

    const signInWithGoogle = async () => {
        // when google login initiated
        setLoading(true)


        await Google.logInAsync(config).then(async (logInResult) => {
            if (logInResult.type === 'success') {
                // login
                // destructure the logInResult which we recevied as a response
                const { idToken, accessToken } = logInResult

                // constructing special credential from that logged in
                const credential = GoogleAuthProvider.credential(idToken, accessToken)

                // Passing the special credential to firebase along with auth which we import from firebase
                // new firebase need auth to pass as 1st arg
                await signInWithCredential(auth, credential)
            }

            // if user cancelled or login failed
            return Promise.reject()
        }).catch(error => setError(error)) //if we get error we store in useState
            .finally(() => setLoading(false))
    }

    // by default, it was rendering all tree everytime with respect to any changes: user,loading,error,logout,signInWithGoogle
    // but with the help of usememo we can render only if some variable changed eg.if user changes, loading, error state changes

    const memoedValue = useMemo(() => ({
        user: user,
        loading: loading,
        error: error,
        logout: logout,
        signInWithGoogle: signInWithGoogle
    }), [user, loading, error])

    return (
        <AuthContext.Provider value={memoedValue}>

            {/* here to access that value by children we will use our custom hooks {/* if no loadingInitial UI then only show children */}
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}

// custom hooks
// so to access the data which is present in the user we will use,
//  const { user } = useAuth()

export default function useAuth() {
    return useContext(AuthContext)
}


const styles = StyleSheet.create({})
