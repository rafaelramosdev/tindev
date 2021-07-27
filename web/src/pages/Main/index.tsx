import { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';

import socketio from 'socket.io-client';

import logoImg from '../../assets/logo.svg';
import itsAMatchImg from '../../assets/itsamatch.png';

import likeIcon from '../../assets/like.svg';
import dislikeIcon from '../../assets/dislike.svg';

import './styles.scss';
import api from '../../services/api';

type MainParams = {
  _id: string;
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
  const params = useParams<MainParams>();

  const { _id } = params;

  const [users, setUsers] = useState<User[]>([]);

  const [matchDev, setMatchDev] = useState<MatchDev | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('devs', {
        headers: {
          user: _id
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [_id]);

  useEffect(() => {
    const socket = socketio('http://localhost:3333', {
      query: {
        user_id: _id
      },
    });

    socket.on('match', (dev: MatchDev) => {
      setMatchDev(dev);
    })
  }, [_id]);

  async function handleLike(id: string) {
    await api.post(`devs/${id}/likes`, null, {
      headers: {
        user: _id,
      }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id: string) {
    await api.post(`devs/${id}/dislikes`, null, {
      headers: {
        user: _id,
      }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logoImg} alt="Tindev" />
      </Link>

      { users.length > 0 ? (
        <ul>
          { users.map(user => {
            return (
              <li key={user._id}>
                <img src={user.avatar} alt={user.name} />

                <footer>
                  <strong>{user.name}</strong>

                  <p>{user.bio}</p>
                </footer>

                <div className="buttons">
                  <button type="button" onClick={() => handleDislike(user._id)}>
                    <img src={dislikeIcon} alt="Dislike" />
                  </button>

                  <button type="button" onClick={() => handleLike(user._id)}>
                    <img src={likeIcon} alt="Like" />
                  </button>
                </div>
              </li>
            )
          }) }
        </ul>
      ) : (
        <div className="empty">Acabou :(</div>
      ) }

      { matchDev && (
        <div className="match-container">
          <img src={itsAMatchImg} alt="It's a match" />

          <img className="avatar" src={matchDev.avatar} alt={matchDev.name} />

          <strong>{matchDev.name}</strong>

          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      ) }
    </div>
  );
}
