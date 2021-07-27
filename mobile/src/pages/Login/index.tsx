import React, { useState, useEffect } from 'react';

import { KeyboardAvoidingView, Text, Image, TextInput, TouchableOpacity, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export function Login() {
  const { navigate } = useNavigation();

  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user)
        navigate('Main', { user });
    });
  }, []);

  async function handleLogin() {
    if (!username)
      return;

    const response = await api.post('devs', { username } );

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id);

    navigate('Main', { _id });
  }

  return (
    <KeyboardAvoidingView 
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}
    >
      <Image source={logoImg} />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário no GitHub"
        placeholderTextColor="#999999"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}