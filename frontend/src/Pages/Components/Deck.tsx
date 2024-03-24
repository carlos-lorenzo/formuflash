import React from 'react'

import { useNavigate } from 'react-router-dom';

import IBriefDeck from '../../types/BriefDeck';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faPenToSquare, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IDeckProps {
    deckData: IBriefDeck
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>
}


export default function Deck({ deckData, setActiveDeckId, setDeckAction }: IDeckProps) {
    const navigate = useNavigate();

    function handleOptionClick(action: DeckAction) {
        setDeckAction(action);
        setActiveDeckId(deckData.deck_id);
        navigate(`/deck-view`);
    }

    return (
        <div className='deck place-center secondary shadow-secondary border shadow-margin'>
            <h2>{deckData.name}</h2>
            <div className="deck-options">
                <FontAwesomeIcon icon={faGraduationCap} size='2x' className='pointer deck-option' onClick={() => handleOptionClick(DeckAction.STUDY)}/>
                <FontAwesomeIcon icon={faPenToSquare} size='2x' className='pointer deck-option' onClick={() => handleOptionClick(DeckAction.EDIT)}/>
                <FontAwesomeIcon icon={faMagnifyingGlass} size='2x' className='pointer deck-option' onClick={() => handleOptionClick(DeckAction.PREIVEW)}/>
            </div>
        </div>
    )
}
