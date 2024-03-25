import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faArrowLeftLong, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

import Logout from './Logout';

import IUser from '../../types/User';

interface IHeaderProps {
    client: AxiosInstance,
    user: IUser,
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    showBack: boolean,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>
}


export default function Header({ client, user, setUser, showBack, setShowBack }: IHeaderProps) {



    function profileClickLink(): string {

        if (user.loggedIn) {
            return '/home';
        } else {
            return '/login';
        }
    }


    function handleBack() {
        setShowBack(false);
    }

    return (
        <div id="header" className='border'>
            {
                showBack ?
                <Link to={profileClickLink()} className='pointer' id='back' onClick={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeftLong} size='2x'/>
                </Link> : null
            }
            
            
            <Link to={"/"} className='pointer'>
                <h1>Free Flash</h1>
            </Link>

            {
                user.loggedIn ?
                <Logout client={client} setUser={setUser} setBack={setShowBack}/> :
                <Link to={'/login'} className='pointer'>
                    <FontAwesomeIcon icon={faArrowRightToBracket} size='2x'/>
                </Link>
            }
            
            
            
        </div>
    )
}
