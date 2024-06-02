import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';


interface IRegisterConfirmationProps {
    client : AxiosInstance
}

export default function RegisterConfirmation({ client }: IRegisterConfirmationProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const id = toast.loading("Activando Cuenta");

        const queryString = window.location.search;
        const parameters = new URLSearchParams(queryString);

        const uidb64 = parameters.get("uidb64");
        const token = parameters.get("token");

        client.get(`activate/${uidb64}/${token}`)
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

    })


    return (
        <div id="register-confirmation" className='fill place-center'>
            <h2>Activación de cuenta</h2>
        </div>
    )
}
