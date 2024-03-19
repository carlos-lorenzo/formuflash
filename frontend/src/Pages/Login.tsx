import React, { useState } from 'react'

import { useNavigate } from "react-router-dom";

import axios, { AxiosInstance } from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import IUser from '../types/User';


interface ILoginProps {
    client: AxiosInstance
    setUser: React.Dispatch<React.SetStateAction<IUser>>
}

export default function Login({ client, setUser }: ILoginProps) {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

    
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
        }).catch((error) => {
            console.log(error);
        })
            
        
    }

    const togglePasswordVisiblity = () => {
        setShowPassword((showPassword) => !showPassword);
    }

    return (
        <div id='login' className='full place-center'>
            <form onSubmit={handleSubmit}>
                    <div className="login-input">
                        <input placeholder="Email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                   
                    <div className="login-input">
                        <input placeholder="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="password-toggle" onClick={togglePasswordVisiblity} />
                    </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

