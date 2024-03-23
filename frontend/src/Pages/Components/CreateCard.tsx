import React from 'react'
import { useState } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'




interface ICreateCardProps {
    client: AxiosInstance,
    question: string,
    answer: string,
    activeCardId: number,
    activeDeckId: number | undefined,
    setQuestion: React.Dispatch<React.SetStateAction<string>>,
    setAnswer: React.Dispatch<React.SetStateAction<string>>,
    getDeck: () => void
}

export default function CreateCard({ 
    client, 
    question, 
    answer, 
    activeCardId,
    activeDeckId,
    setQuestion,
    setAnswer,
    getDeck

}: ICreateCardProps) {
    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const authToken = localStorage.getItem('token')

        client.post('/update_card', {
            deck_id: activeDeckId,
            question: question,
            answer: answer,
            card_id: activeCardId,
        }, {
            headers: {
                Authorization: `Token ${authToken}`,
            }
        }).then(() => {
            getDeck();
        })
    }

    

    return (
        <div id="card-creation" className='fill'>
            <form onSubmit={handleSubmit} id="create-card-form" className='fill'> 
                <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className='card-input border text fill secondary shadow-secondary'
                    placeholder='Raw question'
                />
                <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    className='card-input border text fill secondary shadow-secondary'
                    placeholder='Raw answer'
                />  
            </form>

            <div id="formatted-output" className='fill'>
                <div className='formatted border text fill secondary shadow-secondary'>
                    <h4>Q</h4>
                    <MarkdownLatex content={question} />
                </div>
                
                <div className='formatted border text fill secondary shadow-secondary'>
                    <h4>A</h4>
                    <MarkdownLatex content={answer} />
                </div>
            </div>
        </div>
    )
}



