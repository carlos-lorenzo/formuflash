import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

interface ICreateDeckProps {
    client: AxiosInstance
    activeCourseId: number
    getCourseDecks: (courseId: number) => void
}

export default function CreateDeck({ client, activeCourseId, getCourseDecks }: ICreateDeckProps) {

    const [deckName, setDeckName] = useState<string>('');
    const [promptActive, setPromptActive] = useState<boolean>(false);

    function handleDeckClick() {
        setPromptActive(!promptActive);
    }

    function handleDeckCreation(e: React.FormEvent) {
        e.preventDefault();

        client.post('/create_deck',
        {
            name: deckName,
            course_id: activeCourseId
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getCourseDecks(activeCourseId);
            setPromptActive(false);
            setDeckName('');
        })
    }

    return (
        <>
            <div id="create-deck-button" className='create place-center secondary shadow-secondary pointer border' onClick={handleDeckClick}>
                <FontAwesomeIcon icon={faCirclePlus} size='2x'/>
            </div>

            {
                promptActive ?
                <>
                    <div className="screen-cover"></div>
                    <div id="create-deck-prompt" className="create-prompt secondary shadow-accent border">
                        <FontAwesomeIcon icon={faXmark} size='2x' className='pointer close-prompt' onClick={() => setPromptActive(false)}/>
                        <form onSubmit={(e) => handleDeckCreation(e)} className='create-prompt-form'>
                            <label htmlFor="create-deck-input">Create Deck</label>
                            <input id="create-deck-input" type="text" value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder='Deck name'/>
                            <button type="submit" className='shadow-accent accent border'>Create</button>
                        </form>
                        
                    </div> 
                
                </>
                
                
                
                : null
            }
        </>
        

        
    )
}
