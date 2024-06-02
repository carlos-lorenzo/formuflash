import React, { useState } from 'react'

import { AxiosInstance } from 'axios'

import { toast } from 'react-toastify'

interface IResetPasswordProps {
    client: AxiosInstance
}

export default function ResetPassword({ client }: IResetPasswordProps) {
    
    const [email, setEmail] = useState<string>("");
    
    function handlePasswordChangeQuery(e: React.FormEvent) {
        e.preventDefault();

        const id = toast.loading("Enviando email de recuperación");

        client
            .post("password_reset_query", { 
                email: email 
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
            })
            .catch((error) => {
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
            });
    }

    return (
        <div id='password-reset'>

            <h2>Reiniciar Contraseña</h2>

            <form
                onSubmit={(e) => {
                    handlePasswordChangeQuery(e)
                }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <button type="submit">Reiniciar contraseña</button>
            </form>

        </div>
    )
}
