import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { socket } from './Socket'
import { URL } from '../constants/constants'

import Feather from 'react-native-vector-icons/Feather'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5c5ca1',
    },
    header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 30,
      paddingBottom: 40
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingVertical: 200,
        paddingTop: 8
    },
    TextInput: {
      flex: 1,
      paddingHorizontal: 20,
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
    text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 25
    },
    text_description: {
        color: '#fff',
        fontSize: 20
    },
    action: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: 'white',
      marginTop: 0,
      borderTopWidth: 1,
      borderTopColor: '#f2f2f2',
      paddingBottom: 0
    },
    chat: {
      backgroundColor: 'white',
      marginBottom: 10,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
})


export default function Room({ route }) {
  const [yourID, setYourID] = useState('');
  const [ID, setID] = useState('');
  const [users, setUsers] = useState({});
  const [getUser, setGetUser] = useState({
    email: route.params.email
  })
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{
    message: '',
    from: ''
  }])

  const [typing, setTyping] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const scrollViewRef = useRef();

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    socket.on("typing", (namee) => {
        if(namee === name) {
          setIsTyping(false)
        }
        else {
          setIsTyping(true)
          setTyping(namee)
        }
    })

    socket.on("notyping", () => {
      setIsTyping(false)
    })
  }, [setTyping])

  useEffect(() => {
    if(message.length > 0)
      socket.emit("typing", name)
    else 
      socket.emit("notyping")
  }, [message])

  useEffect(() => {
      socket.on("yourID", (id) => {
        setYourID(id)
        setID(id)
      })
      
      socket.on("allUsers", (users) => {
        setUsers(users)
      })

      socket.on("message", (message) => {
        setMessages(messages => [...messages, message])
      })

  }, [setUsers, setMessages])

  const checkName = (sockName) => {
    if(sockName === name) {
      return false
    }
    else {
      return true
    }
  }

  const sendMessage = () => {
    if(message.length > 0) {
      socket.emit("message", {message: message, from: name})
      setMessage('')
    }
    else
      console.error("Type message first!")
  }

  const renderMessages = () => {
    return messages.map((function(key, ind) {
      if(key.message.length > 0) {
          return (
          <View style={styles.chat} key={ind}>
            {checkName(key.from) ? 
            (<Text>
              <Text style={{ fontWeight: 'bold' }}>{key.from + ' ' } </Text><Text>{key.message}</Text>
            </Text>) : 
            (<Text style={{ textAlign: 'right' }}>
              <Text>{key.message}</Text><Text style={{ fontWeight: 'bold' }}> You </Text>
            </Text>)
            }
          </View>
          )
          }
      else {
        return null
      }
      })
    )
  }

  const handleTyping = () => {
    if(isTyping && (typing !== name))
      return (
        <View style={{ backgroundColor: 'white', paddingLeft: 20 }}>
          <Text style={{ fontStyle: 'italic' }}>{typing} is typing...</Text>
        </View>
      )
  }

    const getCurrentUser = async () => {
      await fetch(URL + '/auth/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getUser)
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          const { name } = data
          socket.emit("getName", name)
          setName(name)
        }
        else {
          console.error(data.message);
        }
      })
      .catch(err => {
          console.error(err)
      })
      }
      
    return (
        <View style={styles.container}>
          <View style={styles.header}>
                <Text style={styles.text_header}>Welcome to Chat Room!</Text> 
                <Text style={styles.text_description}>Send message to all users in this room</Text>    
          </View>
          <ScrollView style={styles.footer} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({animated: true})}>
              {renderMessages()}
          </ScrollView>
          {handleTyping()}
          <View style={styles.action}>
                  <TextInput placeholder="Type message" style={styles.TextInput} value={message} onChangeText={(val) => setMessage(val)} autoCapitalize="none" />
              <TouchableOpacity onPress={() => sendMessage()}>
                  <Feather name="send" color="grey" size={20} />
              </TouchableOpacity>
              </View>
        </View>
    )
};