import React, { useState, useEffect } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';

import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import socketio from 'socket.io-client';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import likeImg from '../../assets/like.png';
import dislikeImg from '../../assets/dislike.png';
import itsamatchImg from '../../assets/itsmatch.png';

import styles from './styles';

type MainRouteParams = {
  id: string;
}

type User = {
  _id: string;
  user: string;
  name: string;
  bio: string;
  avatar: string;
  likes: [string] ;
  dislikes: [string];
}

type MatchDev = {
  name: string;
  bio: string;
  avatar: string;
}

export function Main() {
  const { navigate } = useNavigation();
  const route = useRoute();

  const params = route.params as MainRouteParams;

  const id = params.id;

  const [users, setUsers] = useState<User[]>([]);
  const [matchDev, setMatchDev] = useState<MatchDev | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        }
      });

      setUsers(response.data);
    };

    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = socketio('http://localhost:3333', {
      query: { user_id: id }
    });

    socket.on('match', (dev: MatchDev) => {
      setMatchDev(dev);
    })
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id },
    })

    setUsers(rest);
  };

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id },
    })

    setUsers(rest);
  };

  async function handleLogout() {
    await AsyncStorage.clear();

    navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logoImg} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        { users.length === 0
          ? <Text style={styles.empty}>Acabou :(</Text>
          : (
            users.map((user, index) => (
              <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />

                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>

                  <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                </View>
              </View>
            ))
          ) }
      </View>

      { users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislikeImg} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={likeImg} />
          </TouchableOpacity>
        </View>
      ) }

      { matchDev && (
        <View style={styles.matchContainer}>
          <Image style={styles.matchImage} source={itsamatchImg} />

          <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />

          <Text style={styles.matchName}>{matchDev.name}</Text>

          <Text style={styles.matchBio}>{matchDev.bio}</Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      ) }
    </SafeAreaView>
  );
}