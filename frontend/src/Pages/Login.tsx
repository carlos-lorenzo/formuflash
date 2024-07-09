import React, { useState
 } from 'react'

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import axios, { AxiosInstance } from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

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

    function handleErrorMessage(error: any): string {        
        if (error.response.data.username || error.response.data.password) {
            return "Los campos no pueden estar vacíos";
        }

        if (error.response.data.non_field_errors) {
            return "Credenciales inválidas";
        }

        return "Error al iniciar sesión";

    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const id = toast.loading("Iniciando sesión");

    
        client.post('/login', { 
            username: email, 
            password: password 
        }).then((response) => {
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
            

            localStorage.setItem('token', response.data.token);
            
            client.get('/get_user',
                {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                })
            .then((response) => {
                
                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    loggedIn: true
                });

                toast.update(id, {
                    render: "Sesión iniciada",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setEmail('');
                setPassword('');
                navigate("/home");
            })
        }).catch((error) => {
            toast.update(id, {
                render: handleErrorMessage(error),
                
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }) 
    }

    const togglePasswordVisiblity = () => {
        setShowPassword((showPassword) => !showPassword);
    }

    return (
        <div id='login' className='fill place-center'>
            <form onSubmit={handleSubmit} className='login-register-form'>
                    <div className="login-input border secondary shadow-secondary">
                        <input id="email" className="input" placeholder="Email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                   
                    <div className="login-input border secondary shadow-secondary" id='password-input'>
                        <input id="password" className="input" placeholder="Contraseña" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="password-toggle pointer" onClick={togglePasswordVisiblity} size='xl'/>
                    </div>
                
                <button type="submit" className='shadow-accent accent-bg border' id='login-submit'><b>Iniciar sesión</b></button>
                <div id='login-options'>
                    <div id='forgot-password'>
                        <p></p><Link to="/reset-password" className='redirect-link'><p><b>Olvidaste tu contrseña?</b></p></Link>
                    </div>
                    
                    <div id='no-account'>
                        <p>¿No tienes cuenta? </p><Link to="/register" className='redirect-link'><p><b>Regístrate</b></p></Link>
                    </div>
                   
                </div>
                
            </form>
           
        </div>
    )
}

