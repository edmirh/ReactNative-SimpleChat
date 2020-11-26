import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'

import { URL } from '../constants/constants'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5c5ca1',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_description: {
        color: '#fff',
        fontSize: 20
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    TextInput: {
        flex: 1,
        paddingTop: 10,
        marginTop: Platform.OS  === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a'
    },
    button: {
        backgroundColor: '#5c5ca1',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginTop: 50
    },
    buttonSignUp: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#5c5ca1',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginTop: 20
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'red',
        padding: 10
    },
  });

export default function Login({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(true)
    const [loginmessage, setLoginMessage] = useState("")
    const [success, setSuccess] = useState(false)

    const updateSecureText = () => {
        setSecure(!secure)
    }

    const signIn = async() => {
        await fetch(URL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            setLoginMessage(data.message)
            if(data.success) {
                navigation.navigate("Video Room", { email: email || false } )
            }
        })
        .catch(err => {
            console.error("error", err)
        })
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text> 
                <Text style={styles.text_description}>Log In</Text>    
            </View>
            <View style={styles.footer}>
                <Text style={[styles.text_footer, { marginTop: 25 } ]}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome name="envelope-o" color="#05375a" size={20} />
                    <TextInput placeholder="Your Email" style={styles.TextInput} onChangeText={(val) => setEmail(val)} autoCapitalize="none" />
                    {email ? 
                    <Feather name="check-circle" color="green" size={20} /> : null}
                </View> 
                <Text style={[styles.text_footer, { marginTop: 25 } ]}>Password</Text>
                <View style={styles.action}>
                    <FontAwesome name="key" color="#05375a" size={20} />
                    <TextInput placeholder="Password" secureTextEntry={secure ? true : false} style={styles.TextInput} onChangeText={(val) => setPassword(val)} autoCapitalize="none" />
                    
                    <TouchableOpacity onPress={() => updateSecureText()}>
                        {secure ?
                        <Feather name="eye-off" color="grey" size={20} />
                        : <Feather name="eye" color="grey" size={20} />}
                    </TouchableOpacity>
                </View>
                {(loginmessage.length > 0) ? 
                <View>
                    <Text style={styles.error}>{loginmessage}</Text>
                </View> : null}
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => signIn()} >
                        <Text style={[styles.textSign, { color: '#fff' }]}>Log In</Text>
                    </TouchableOpacity>
                </View> 

                <View style={styles.buttonSignUp}>
                    <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}
                    style={styles.textSign}>
                        <Text style={[styles.textSign, { paddingTop: 0, color: '#5c5ca1' }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        </View>
    );
}