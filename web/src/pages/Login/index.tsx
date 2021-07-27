import { useState, FormEvent } from 'react';

import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import './styles.scss';

export function Login() {
  const { push } = useHistory();

  const [username, setUserame] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!username) 
      return;

    const response = await api.post('devs', { username });

    const { _id } = response.data;

    push(`/dev/${_id}`);
  }

  return (
    <div className="login-container">
       <img src={logoImg} alt="Tindev" />

       <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite seu usuário no GitHub"
          value={username}
          onChange={event => setUserame(event.target.value)}
        />

        <button type="submit">Entrar</button>
       </form>
    </div>
  );
}
