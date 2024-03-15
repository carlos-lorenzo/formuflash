import React, { useState, useEffect } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'

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


interface IDeckStudyProps {
    client: AxiosInstance
    activeDeck: IDeck
}


interface ICard {
    question: string
    answer: string
    confidence: number
    card_id: number
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

    let [content, setContent] = useState<IContent>({
        content: "",
        questionShown: true
    });

    let [confidence, setConfidence] = useState(Confidences.MEDIUM);
    let [card, setCard] = useState<ICard | null>(null);
    

    function getCard() {
        client.get(
            "/fetch_deck_card?deck_id=1",
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setCard(response.data.card);
            setContent({
                content: response.data.card.answer,
                questionShown: true
            });
            
        })
    }

    useEffect(() => {
        getCard();
    }, [])


    function handleKeys(e: KeyboardEvent) {
        if (e.key === " ") {
            if (!card) {
                return;
            } else {
                setContent({
                    content: content.questionShown ? card.question : card.answer,
                    questionShown: false
                });
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        handleKeys(e);
    })
    return (
        <div id='study'>
            <div id="study-content">
                <MarkdownLatex content={content.content}/>
            </div>
            <div id='study-options'>

            </div>
            
        </div>
    )
}
1