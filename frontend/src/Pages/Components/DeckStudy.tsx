import React, { useState, useEffect } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'

import ICard from '../../types/Card';
import IDeck from '../../types/Deck';

declare interface IDeckStudyProps {
    client: AxiosInstance
    activeDeck: IDeck
} 

export default function DeckStudy({ client, activeDeck }: IDeckStudyProps) {
    enum Confidences {
        NONE = 0,
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3
    }

    interface IContent {
        content: string,
        questionShown: boolean
    }

    const [content, setContent] = useState<IContent>({
        content: "",
        questionShown: true
    });

   
    const [card, setCard] = useState<ICard | null>(null);
    

    function handleSwap() {
        if (!card) {
            return;
        }

        if (content.questionShown) {
            setContent({
                content: card.answer,
                questionShown: false
            })
        } else {
            setContent({
                content: card.question,
                questionShown: true
            })
        }
    }

    function handleConfidenceUpdate(confidence: Confidences) {

        if (!card) {
            return;
        }
        client.post(
            "/update_confidence",
            {
                card_id: card.card_id,
                confidence: confidence
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            getCard();
        })
    }

    function getCard() {
        client.get(
            `/fetch_deck_card?deck_id=${activeDeck.deck_id}`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response.data)
            setCard(response.data.card);
            setContent({
                content: response.data.card.question,
                questionShown: true
            });
            
        })
    }

    useEffect(() => {
        getCard();
    }, [])


    function getConfidenceClassName(confidence?: number): string {
        if (confidence === undefined) {
            return "none";
        }

        switch (confidence) {
            case Confidences.LOW:
                return "accent";
            case Confidences.MEDIUM:
                return "primary";
            case Confidences.HIGH:
                return "green";
            default:
                return "none";
        }
    }



    return (
        <div id='study' className='fill place-center'>
            <div id="study-content" className='text card border fill place-center shadow-secondary' onClick={() => handleSwap()}>
                <div id="confidence-marker" className={`shadow-${getConfidenceClassName(card?.confidence)} border ${getConfidenceClassName(card?.confidence)}`}></div>
                <MarkdownLatex content={content.content}/>
            </div>
            <div id='study-options' className='fill'>   
                <button className='shadow-accent border deck-option' onClick={handleSwap}>Turn Around</button>
                <button className='shadow-accent border deck-option' onClick={() => handleConfidenceUpdate(Confidences.LOW)}>LOW</button>
                <button className='shadow-primary border deck-option primary' onClick={() => handleConfidenceUpdate(Confidences.MEDIUM)}>MEDIUM</button>
                <button className='shadow-green border deck-option green' onClick={() => handleConfidenceUpdate(Confidences.HIGH)}>HIGH</button>
            </div>
            
        </div>
    )
}

