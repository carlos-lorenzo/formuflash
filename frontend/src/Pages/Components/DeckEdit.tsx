import React, {useState, useEffect} from 'react';

import { AxiosInstance } from 'axios';

import DeckPreview from './DeckPreview';
import CreateCard from './CreateCard';


interface IDeck {
    name: string,
    course: string,
    cards: {
        [cardId: number]: {
            id: number,
            question: string,
            answer: string,
            confidence: number
        }
    }
}

interface IDeckEdit {
    client: AxiosInstance,
    activeDeck: IDeck,
    activeDeckId: number,
    activeCardId: number,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>,
    getDeck: () => void
}


export default function DeckEdit({ client, activeDeck, activeDeckId, activeCardId, setActiveCardId, getDeck }: IDeckEdit) {

    
    
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        setQuestion(activeDeck.cards[activeCardId].question);
        setAnswer(activeDeck.cards[activeCardId].answer);
    }, [activeCardId])

    return (
        <div id='deck-edit' className='fill'>
            <DeckPreview activeDeck={activeDeck} full={false} setActiveCardId={setActiveCardId}/>

            <CreateCard 
            client={client}
            question={question}
            answer={answer}
            setQuestion={setQuestion} 
            setAnswer={setAnswer}
            activeCardId={activeCardId}
            activeDeckId={activeDeckId}
            getDeck={getDeck}/>
        
        </div>
    )
}
