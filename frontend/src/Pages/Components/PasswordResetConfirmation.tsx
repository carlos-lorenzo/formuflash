import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';


interface IPasswordResetConfirmation {
    client : AxiosInstance
}

export default function PasswordResetConfirmation({ client }: IPasswordResetConfirmation) {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();
        const id = toast.loading("Reiniciando contraseña");

        if (newPassword !== confirmPassword) {
            toast.update(id, {
                render: "Las contraseñas no coinciden",
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const queryString = window.location.search;
        const parameters = new URLSearchParams(queryString);

        const uidb64 = parameters.get("uidb64");
        const token = parameters.get("token");

        client.post("password_reset", { 
            uidb64: uidb64, 
            token: token,
            password: newPassword
        })
        .then((response) => {
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
            });
        })

    }


    return (
        <div id="register-confirmation" className='fill place-center'>
            <form id='profile-form' onSubmit={(e) => handlePasswordChange(e)}>
                <h4>Cambiar Contraseña</h4>

                <div className="login-input border secondary shadow-secondary">
                    <input id="new-password-input" className="input" placeholder="Contraseña nueva" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                </div>

                <div className="login-input border secondary shadow-secondary">
                    <input id="confirm-password-input" className="input" placeholder="Confirmar contraseña" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </div>
                   
                <button type="submit" className='shadow-accent accent border' id='login-submit'><b>Reiniciar Contrseña</b></button>
            </form>
        </div>
    )
}
