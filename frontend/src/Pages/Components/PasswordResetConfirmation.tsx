import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';


interface IPasswordResetConfirmation {
    client : AxiosInstance
}

export default function PasswordResetConfirmation({ client }: IPasswordResetConfirmation) {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handlePasswordChange() {
        const id = toast.loading("Resetting Password");

        const queryString = window.location.search;
        const parameters = new URLSearchParams(queryString);

        const uidb64 = parameters.get("uidb64");
        const token = parameters.get("token");

        client.post("reset-password", { 
            uidb64: uidb64, 
            token: token })
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
            });

            navigate("/register");
        })

    }


    return (
        <div id="register-confirmation" className='fill place-center'>
            <form id='profile-form' onSubmit={(_) => handlePasswordChange()}>
                <h4>Change Password</h4>

                <div className="login-input border secondary shadow-secondary">
                    <input id="new-password-input" className="input" placeholder="New Password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                </div>

                <div className="login-input border secondary shadow-secondary">
                    <input id="confirm-password-input" className="input" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </div>
                   
                <button type="submit" className='shadow-accent accent border' id='login-submit'><b>Reset Password</b></button>
            </form>
        </div>
    )
}
