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


    function handleErrorResponse(error: any): string {
        if (!error.response.data.error) {
            return "Unexpected error"
        }

        return error.response.data.error
    }


    function handleCardDeletion() {

        const id = toast.loading("Deleting card...");

        client.post("/delete_card",
        {
            card_id: card.card_id
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }

        }).then((response) => {
            toast.update(id, 
                { 
                render: "Card deleted", 
                type: "info", 
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            getDeck();
            setActiveCardId(response.data.new_card_id);

        }).catch((error) => {
           
            toast.update(id, 
            { 
                render: handleErrorResponse(error), 
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
        <div className='border secondary shadow-secondary card-edit-preview place-center pointer' onClick={() => setActiveCardId(card.card_id)}>
            <p><MarkdownLatex content={card.question ? card.question : 'New Card'}/></p>
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={handleCardDeletion}/>
        </div>
    )
}
