import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'

export default function Login(){
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();

        const response = await api.post('/sessions', { email })

        const { _id } = response.data;

        localStorage.setItem('user', _id);

        navigate('/dashboards');
    }
    return (
        <>
            <p>
            Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa
            </p>

            <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-MAIL *</label>
            <input 
                type="email" 
                id="email" 
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={event => setEmail(event.target.value) }
            />
            <button type="Submit" className="btn">Entrar</button>
            </form>
        </>
    )
}