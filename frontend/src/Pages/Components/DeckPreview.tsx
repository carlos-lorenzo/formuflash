import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import CardPreview from './CardPreview'
import CardEditPreview from './CardEditPreview'

import IDeck from '../../types/Deck';
import ICard from '../../types/Card';

interface IDeckPreviewProps {
    activeDeck: IDeck,
}

export default function DeckPreview({ activeDeck }: IDeckPreviewProps) {
    

    return (
        <div className='fill place-center deck-preview'>
            
            <div id="deck-info">
                <h3>{activeDeck.name}</h3>
                
            </div>
            
            

            {Object.entries(activeDeck.cards).map(([key, card]) => {
                const i = parseInt(key)

                return (
                    <CardPreview key={i} card={card} />
                )
            })}
        </div>
    )
}
