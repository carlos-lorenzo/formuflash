import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowRotateLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import UploadCards from './UploadCards';
import CardEditPreview from './CardEditPreview'

import IDeck from '../../types/Deck';


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
    
    function resetConfidences() {

        const id = toast.loading("Resetting confidences");

        client.post("/reset_confidences",
        {
            deck_id: activeDeck.deck_id
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getDeck();

            toast.update(id, {
                render: response.data.message,
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }).catch((error) => {
            toast.update(id, {
                render: error.response.data.error,
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }) 
    }

    return (
        <div className='fill place-center deck-preview'>
            
            <div className="deck-info">
                <h3>{activeDeck.name}</h3>
                <div className="deck-info-actions">
                    <FontAwesomeIcon icon={faArrowRotateLeft} size='xl' onClick={resetConfidences} className='pointer grow transition-to-primary'/>
                    <UploadCards client={client} deckId={activeDeck.deck_id} getDeck={getDeck}/>
                    <FontAwesomeIcon icon={faFloppyDisk} size='xl' onClick={handleCardUpdate} className='pointer grow transition-to-primary'/>
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
