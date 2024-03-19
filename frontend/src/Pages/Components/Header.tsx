import React from 'react';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

import IUser from '../../types/User';

interface IHeaderProps {
    user: IUser
}


export default function Header({ user }: IHeaderProps) {

    function profileClickLink(): string {

        if (user.loggedIn) {
            return '/home';
        } else {
            return '/login';
        }
    }


    return (
        <div id="header" className='border'>
            <h1>Free Flash</h1>
            <Link to={profileClickLink()} className='pointer'>
                <FontAwesomeIcon icon={faCircleUser} size='2x'/>
            </Link>
        </div>
    )
}
