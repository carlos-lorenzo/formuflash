import React from 'react'

import { AxiosInstance } from 'axios';

import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import IUser from '../../types/User';


interface ILogoutProps {
    client: AxiosInstance
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    setBack: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Logout({ client, setUser, setBack}: ILogoutProps) {

    function handleLogout() {
        const id = toast.loading("Cerrando sesión");

        client.get(
            '/logout',
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then(() => {
            
            localStorage.removeItem('token');
            setUser({ name: '', email: '', loggedIn: false });
            client.defaults.headers.common['Authorization'] = '';
            setBack(false);
            
            toast.update(id, {
                render: "Sesión cerrada",
                type: "info",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }).catch((_) => {
            toast.update(id, {
                render: "Error logging out",
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
        <Link to={'/'} id="logout" className='pointer hamburger-option' onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} size='lg'/> 
                <p>Salir</p> 
        </Link>
    )
}
