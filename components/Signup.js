import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, TouchableOpacity } from 'react-native';

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
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10
    },
    signUp: {
        backgroundColor: 'red',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 30
    },
    buttonSignIn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#5c5ca1',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginTop: 20
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'red',
        padding: 10
    }
  });

export default function Signup({navigation}) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    
    const [signupmessage, setSignUpMessage] = useState("")

    const signUp = async() => {
        await fetch(URL + '/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone
            })
        })
        .then(res => res.json())
        .then(data => {
            setSignUpMessage(data.message)
        })
        .catch(err => {
            console.error("error", err)
        })
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text> 
                <Text style={styles.text_description}>Sign Up</Text>    
            </View>
            <View style={styles.footer}>
            <Text style={styles.text_footer}>Name</Text>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color="#05375a" size={20} />
                    <TextInput placeholder="Your Name" style={styles.TextInput} onChangeText={(val) => setName(val)} />
                    {name ? 
                    <Feather name="check-circle" color="green" size={20} /> : null }
                </View>
                <Text style={[styles.text_footer, { marginTop: 25 } ]}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome name="envelope-o" color="#05375a" size={20} />
                    <TextInput placeholder="Your Email" style={styles.TextInput} onChangeText={(val) => setEmail(val)} autoCapitalize="none" />
                    {email ? 
                    <Feather name="check-circle" color="green" size={20} /> : null}
                </View> 
                <Text style={[styles.text_footer, { marginTop: 25 } ]}>Phone Number</Text>
                <View style={styles.action}>
                    <FontAwesome name="phone" color="#05375a" size={20} />
                    <TextInput placeholder="Phone number" style={styles.TextInput} onChangeText={(val) => setPhone(val)} autoCapitalize="none" />
                    {phone ? 
                    <Feather name="check-circle" color="green" size={20} /> : null }
                </View>
                {(signupmessage.length > 0) ? 
                <View>
                    <Text style={styles.error}>{signupmessage}</Text>
                </View> : null}
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => signUp()} >
                        <Text style={[styles.textSign, { color: '#fff' }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View> 

                <View style={styles.buttonSignIn}>
                    <TouchableOpacity onPress={() => navigation.navigate('Log in')}
                    style={styles.textSign}>
                        <Text style={[styles.textSign, { paddingTop: 0, color: '#5c5ca1' }]}>Log In</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        </View>
    );
}