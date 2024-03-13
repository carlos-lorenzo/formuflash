import React, {useState} from 'react';

import { AxiosInstance } from 'axios';

import DeckPreview from './DeckPreview';
import CreateCard from './CreateCard';


interface IDeck 
{
    name: string,
    course: string,
    cards: {
        id: number,
        question: string,
        answer: string,
        confidence: number,
        card_id: number
    }[]
}

interface IDeckEdit {
    client: AxiosInstance,
    activeDeck: IDeck
}


export default function DeckEdit({ client, activeDeck }: IDeckEdit) {

    const [activeCardId, setActiveCardId] = useState(0);
    


    return (
        <div id='deck-edit' className='fill'>
            <DeckPreview activeDeck={activeDeck} full={false} />
            <CreateCard client={client} />
        
        </div>
    )
}
