import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import IUser from '../types/User';

import { toast } from 'react-toastify';

interface IProfileProps {
    client: AxiosInstance
    user: IUser,
    setUser: React.Dispatch<React.SetStateAction<IUser>>
}

export default function Profile({ client, user, setUser }: IProfileProps) {
    
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    /**
     * Handles the update of the user profile information.
     *
     * @param {React.FormEvent} e - The event triggering the profile update.
     * @return {void} No return value.
     */
    function handleProfileUpdate(e: React.FormEvent) {
        e.preventDefault();

        const id = toast.loading("Actualizando información");

        client.post('/update_user', {
            name: name,
            email: email
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }
        
        ).then((response) => {
            setUser({
                name: response.data.user.name,
                email: response.data.user.email,
                loggedIn: true
            })

            toast.update(id, {
                render: response.data.message,
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }).catch((error) => {
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
    
    function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();

        const id = toast.loading("Cambiando contraseña");

        client.post('/change_password', {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }
        
        ).then((response) => {
            console.log(response)
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            toast.update(id, {
                render: response.data.message,
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }).catch((error) => {
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

    return (
        <div id='profile-page' className='fill'>
            <h1>Editar Perfil</h1>
            <form id='profile-form' onSubmit={(e) => handleProfileUpdate(e)}>
                <h4>Actualizar Información</h4>
                <div className="login-input border secondary shadow-secondary">
                    <input id="name" className="input" placeholder="Nombre" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="login-input border secondary shadow-secondary">
                    <input id="email" className="input" placeholder="Email" type="email" autoComplete="none" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                   
                <button type="submit" className='shadow-accent accent border' id='login-submit'><b>Actualizar Perfil</b></button>

            </form>

            <form id='profile-form' onSubmit={(e) => handlePasswordChange(e)}>
                <h4>Cambiar contraseña</h4>

                <div className="login-input border secondary shadow-secondary">
                    <input id="current-password-input" className="input" placeholder="Contraseña actual" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                </div>

                <div className="login-input border secondary shadow-secondary">
                    <input id="new-password-input" className="input" placeholder="Contraseña nueva" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                </div>

                <div className="login-input border secondary shadow-secondary">
                    <input id="confirm-password-input" className="input" placeholder="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </div>
                   
                <button type="submit" className='shadow-accent accent border' id='login-submit'><b>Cambiar Contraseña</b></button>
            </form>
        </div>
    )
}
