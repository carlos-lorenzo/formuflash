import React from 'react';

import { AxiosInstance } from 'axios';

import CreateDeck from './CreateDeck';

import Deck from './Deck';

import IBriefDeck from '../../types/BriefDeck';

enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IDecksProps {
    client: AxiosInstance,
    activeCourseId: number | undefined,
    decks: IBriefDeck[],
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    getCourseDecks: (courseId: number | undefined) => void,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    activeCourseName: string
}

export default function Decks({ client, activeCourseId, decks, setActiveDeckId, getCourseDecks, setDeckAction, activeCourseName }: IDecksProps) {


    return (
        <div id='decks'>
            <h3 style={{textAlign: 'right'}}>{activeCourseName}</h3>
            {
                decks.map((deck) => (
                    <Deck
                    key={deck.deck_id}
                    deckData={deck}
                    setActiveDeckId={setActiveDeckId}
                    setDeckAction={setDeckAction}
                    />
                ))
            }

            {
                activeCourseId ? 
                <CreateDeck client={client} activeCourseId={activeCourseId} getCourseDecks={getCourseDecks}/>
                
                : null
            }
            
            
        </div>
    )
}
