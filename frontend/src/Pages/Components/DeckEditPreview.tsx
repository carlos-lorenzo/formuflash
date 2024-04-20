import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


import UploadCards from './UploadCards';
import CardEditPreview from './CardEditPreview'

import IDeck from '../../types/Deck';
import ICard from '../../types/Card';

interface IDeckPreviewProps {
    client: AxiosInstance,
    activeDeck: IDeck,
    getDeck: (newCardId?: number) => void,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>
    handleCardUpdate: () => void,
    handleCardCreation: () => void,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeckEditPreview({ client, activeDeck, getDeck, setActiveCardId, handleCardUpdate, handleCardCreation, setEditing }: IDeckPreviewProps) {
    
    

    return (
        <div className='fill place-center deck-preview'>
            
            <div className="deck-info">
                <h3>{activeDeck.name}</h3>
                <div className="deck-info-actions">
                    <UploadCards client={client} deckId={activeDeck.deck_id} getDeck={getDeck}/>
                    <button id="update-card" onClick={handleCardUpdate} className='green shadow-green border'>Save</button>
                </div>
                
            </div>
            
            
            

            {Object.entries(activeDeck.cards).map(([key, card]) => {
                const i = parseInt(key)

                return (
                    <CardEditPreview key={i} client={client} getDeck={getDeck} card={card} setActiveCardId={setActiveCardId} setEditing={setEditing}/>
                )
            })}
            
                
            <div className='border secondary shadow-secondary card-edit-preview place-center pointer' onClick={handleCardCreation}>
                <FontAwesomeIcon icon={faPlusCircle} size='2x'/>
            </div>
            
            


        </div>
    )
}
