import React, { useState } from 'react'

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import axios, { AxiosInstance } from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';



interface IRegisterProps {
    client: AxiosInstance
}

export default function Register({ client }: IRegisterProps) {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const id = toast.loading("Creating account");

    
        client.post('/register', { 
            name: name,
            email: email, 
            password: password 
        }).then((response) => {
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
            

            toast.update(id, {
                render: "Confirmation email sent",
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
            navigate("/login");
                
                
            }).catch((error) => {
                console.error(error);
            
                toast.update(id, {
                    render: error.response.data.error,
                    
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
        <div id='register' className='fill place-center'>
            <form onSubmit={handleSubmit} className='login-register-form'>
                    <div className="login-input border secondary shadow-secondary">
                        <input id="name" className="input" placeholder="Nombre" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>

                    <div className="login-input border secondary shadow-secondary">
                        <input id="email" className="input" placeholder="Email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                   
                    <div className="login-input border secondary shadow-secondary" id='password-input'>
                        <input id="password" className="input" placeholder="Contraseña" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="password-toggle pointer" onClick={togglePasswordVisiblity} size='xl'/>
                    </div>
                
                <button type="submit" className='shadow-accent accent border' id='login-submit'><b>Regístrate</b></button>
                <div id='no-account'>
                    <p>¿Ya tienes cuenta?</p><Link to="/login" className='redirect-link'><p><b>Inciar sesión</b></p></Link>
                </div>
            </form>
        </div>
    )
}

