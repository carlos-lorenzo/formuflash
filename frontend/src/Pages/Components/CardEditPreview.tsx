import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import MarkdownLatex from './MarkdownLatex'

import ICard from '../../types/Card';


interface ICardEditPreviewProps {
    client: AxiosInstance,
    getDeck: (newCardId?: number) => void,
    card: ICard,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>
}

export default function CardEditPreview({ client, getDeck, card, setActiveCardId }: ICardEditPreviewProps) {

    function handleCardDeletion() {
        client.post("/delete_card",
        {
            card_id: card.card_id
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }

        }).then((response) => {
            getDeck();
            setActiveCardId(response.data.new_card_id);
        })
    }
    
    return (
        <div className='border secondary shadow-secondary card-edit-preview place-center pointer' onClick={() => setActiveCardId(card.card_id)}>
            <p><MarkdownLatex content={card.question ? card.question : 'New Card'}/></p>
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={handleCardDeletion}/>
        </div>
    )
}
