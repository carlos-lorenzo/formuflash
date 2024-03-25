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
    

    

    

    return (
        <div id="card-creation" className='fill'>
            <form id="create-card-form" className='fill'> 
                <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className='card-input border text fill secondary shadow-secondary'
                    autoComplete="off"
                    placeholder='Raw question'
                />
                <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    className='card-input border text fill secondary shadow-secondary'
                    autoComplete="off"
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



