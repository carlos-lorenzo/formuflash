import React, { useState } from 'react'

import { useNavigate } from "react-router-dom";

import axios, { AxiosInstance } from 'axios'

import IUser from '../types/User';


interface ILoginProps {
    client: AxiosInstance
    setUser: React.Dispatch<React.SetStateAction<IUser>>
}

export default function Login({ client, setUser }: ILoginProps) {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            client.post('/login', { 
                username: email, 
                password: password 
            }).then((response) => {
                axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
                

                localStorage.setItem('token', response.data.token);
                
                client.get('/get_user')
                .then((response) => {
                    setUser({
                        name: response.data.name,
                        email: response.data.email,
                        loggedIn: true
                    });

                    setEmail('');
                    setPassword('');
                    navigate("/home");
                })
                
                

                
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

