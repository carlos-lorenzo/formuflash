import React from 'react'

import CardPreview from './CardPreview'
import CardEditPreview from './CardEditPreview'

import IDeck from '../../types/Deck';
import ICard from '../../types/Card';

interface IDeckPreviewProps {
    activeDeck: IDeck,
    full: boolean,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>
}

export default function DeckPreview({ activeDeck, full, setActiveCardId }: IDeckPreviewProps) {
    
    return (
        <div id='deck-edit-preview' className='card'>
            {Object.entries(activeDeck.cards).map(([key, card]) => {
                const i = parseInt(key)

                return (
                    full ? 
                    <CardPreview key={i} card={card} /> : 
                    <CardEditPreview key={i} card={card} setActiveCardId={setActiveCardId}/>
                )
            })}
        </div>
    )
}
