import React from 'react'

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import IBriefDeck from '../../types/BriefDeck';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faPenToSquare, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';


enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IDeckProps {
    client: AxiosInstance
    deckData: IBriefDeck,
    
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteInfo: React.Dispatch<React.SetStateAction<{show: boolean, id: number | undefined}>>,   
}


export default function Deck({ client, deckData, setActiveDeckId, setDeckAction, setShowBack, setDeleteInfo }: IDeckProps) {
    const navigate = useNavigate()

    function handleOptionClick(action: DeckAction) {
        setDeckAction(action);
        setActiveDeckId(deckData.deck_id);
        setShowBack(true);
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
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={() => setDeleteInfo({show: true, id: deckData.deck_id})}/>
        </div>
    )
}
