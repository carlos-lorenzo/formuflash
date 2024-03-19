import React from 'react'

import { useNavigate } from 'react-router-dom';

import IBriefDeck from '../../types/BriefDeck';

interface IDeckProps {
    deckData: IBriefDeck
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>
}


export default function Deck({ deckData, setActiveDeckId }: IDeckProps) {
    const navigate = useNavigate();

    function handleDeckClick() {
        setActiveDeckId(deckData.deck_id);
        navigate(`/deck-view`);
    }

    return (
        <div className='deck place-center secondary shadow-secondary pointer border' onClick={handleDeckClick}>
            <h2>{deckData.name}</h2>
        </div>
    )
}
