import React from 'react';

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import Deck from './Deck';

import IBriefDeck from '../../types/BriefDeck';

interface IDecksProps {
    client: AxiosInstance,
    activeCourseId: number | undefined,
    decks: IBriefDeck[],
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    getCourseDecks: (courseId: number | undefined) => void,
}

export default function Decks({ client, activeCourseId, decks, setActiveDeckId, getCourseDecks }: IDecksProps) {

    function handleDeckCreation() {
        client.post('/create_deck',
        {
            name: 'New Deck 2',
            course_id: activeCourseId
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getCourseDecks(activeCourseId);
        })
    }

    return (
        <div id='decks'>
            {
                decks.map((deck) => (
                    <Deck
                    key={deck.deck_id}
                    deckData={deck}
                    setActiveDeckId={setActiveDeckId}
                    />
                ))
            }
            <div id="create-deck-button" className='create place-center secondary shadow-secondary pointer border' onClick={handleDeckCreation}>
                <FontAwesomeIcon icon={faCirclePlus} size='2x'/>
            </div>
        </div>
    )
}
