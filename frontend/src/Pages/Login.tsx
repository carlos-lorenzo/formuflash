import React, { useState } from 'react'

import { useNavigate } from "react-router-dom";

import axios, { AxiosInstance } from 'axios'


interface ILoginProps {
    client: AxiosInstance
}

export default function Login({ client }: ILoginProps) {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            client.post('/login', { 
                username: email, 
                password: password }
            ).then((response) => {
                axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
                setEmail('');
                setPassword('');
                navigate("/");
            })
            
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label>
                    Password
                    <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

