import React from 'react'
import { useState } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'




interface ICreateCardProps {
    client: AxiosInstance,
    question: string,
    answer: string,
    activeCardId: number,
    activeDeckId: number,
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

        client.post('/create_card', {
            deck_id: activeDeckId,
            question: question,
            answer: answer,
            card_id: activeCardId
        }).then(() => {
            
        })
    }

    

    return (
        
        <div id="card-creation" className='fill'>
            <form onSubmit={handleSubmit} id="create-card-form"> 
              
                <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className='border text shadow'
                    placeholder='Enter raw question'
                />
                <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    className='border text shadow'
                    placeholder='Enter raw answer'
                />  
                <button type="submit" className='shadow-accent border'>Save</button>

            </form>

            <div id="formatted-output">
                <div className='formatted border shadow text'>
                    <h4>Q</h4>
                    <MarkdownLatex content={question} />
                </div>
                
                <div className='formatted border shadow text'>
                    <h4>A</h4>
                    <MarkdownLatex content={answer} />
                </div>
                
                

            </div>
        </div>
    )
}



