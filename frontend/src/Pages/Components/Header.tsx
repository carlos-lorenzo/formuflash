import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    return (
        <div id="header" className='border'>
            <h1>Free Flash</h1>
            <FontAwesomeIcon icon={faCircleUser} size='2x' className="icon-user" />
        </div>
    )
}
