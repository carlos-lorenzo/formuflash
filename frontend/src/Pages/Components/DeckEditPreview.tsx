import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import CardPreview from './CardPreview'
import CardEditPreview from './CardEditPreview'

import IDeck from '../../types/Deck';
import ICard from '../../types/Card';

interface IDeckPreviewProps {
    client: AxiosInstance,
    activeDeck: IDeck,
    getDeck: (newCardId?: number) => void,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>
    handleCardUpdate: () => void
}

export default function DeckEditPreview({ client, activeDeck, getDeck, setActiveCardId, handleCardUpdate }: IDeckPreviewProps) {
    
    function handleCardCreation() {
        client.post('/create_card', 
        {
            deck_id: activeDeck.deck_id,
            question: 'New Question',
            answer: 'New Answer', 
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getDeck(response.data.card.card_id);
        })

    }

    return (
        <div className='fill place-center deck-preview'>
            
            <div className="deck-info">
                <h3>{activeDeck.name}</h3>
                <button id="update-card" onClick={handleCardUpdate} className='green shadow-green border'>Save</button>
            </div>
            
            

            {Object.entries(activeDeck.cards).map(([key, card]) => {
                const i = parseInt(key)

                return (
                    <CardEditPreview key={i} client={client} getDeck={getDeck} card={card} setActiveCardId={setActiveCardId}/>
                )
            })}
            
                
            <div className='border secondary shadow-secondary card-edit-preview place-center pointer' onClick={handleCardCreation}>
                <FontAwesomeIcon icon={faPlusCircle} size='2x'/>
            </div>
            
            


        </div>
    )
}
