import React, {useState, useEffect} from 'react';

import { AxiosInstance } from 'axios';

import DeckEditPreview from './DeckEditPreview';
import CreateCard from './CreateCard';


import ICard from '../../types/Card';
import IDeck from '../../types/Deck';


interface IDeckEdit {
    client: AxiosInstance,
    activeDeck: IDeck,
    activeDeckId: number | undefined,
    activeCardId: number,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>,
    getDeck: () => void
}


export default function DeckEdit({ client, activeDeck, activeDeckId, activeCardId, setActiveCardId, getDeck }: IDeckEdit) {

    
    
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    function handleCardUpdate() {
        client.post('/update_card', {
            deck_id: activeDeckId,
            question: question,
            answer: answer,
            card_id: activeCardId,
        }, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            }
        }).then(() => {
            getDeck();
        })
    }

    useEffect(() => {
        setQuestion(activeDeck.cards[activeCardId].question);
        setAnswer(activeDeck.cards[activeCardId].answer);
    }, [activeCardId])

    return (
        <div id='deck-edit'>
            <div className="whitespace"></div>
            <DeckEditPreview 
                client={client} 
                activeDeck={activeDeck} 
                getDeck={getDeck}
                setActiveCardId={setActiveCardId}
                handleCardUpdate={handleCardUpdate}
            />

            <CreateCard 
                client={client}
                question={question}
                answer={answer}
                setQuestion={setQuestion} 
                setAnswer={setAnswer}
                activeCardId={activeCardId}
                activeDeckId={activeDeckId}
                getDeck={getDeck}
            />
        
        </div>
    )
}
