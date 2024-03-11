import React from 'react'
import { useState } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'




interface ICreateCardProps {
    client: AxiosInstance
}

export default function CreateCard( {client}: ICreateCardProps) {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        client.post('/create_card', {
            deck_id: 1,
            question: question,
            answer: answer
        }).then(() => {
            setQuestion('')
            setAnswer('')
        })
    }

    

    return (
        <div className='full place-center'>
            <div id="card-creation" className='card'>
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
                    className='border text'
                    placeholder='Enter raw answer'
                />  
                <button type="submit">Create</button>

            </form>

            <div id="formatted-output">
                <div className='formatted border text'>
                    <MarkdownLatex content={question} />
                </div>
                
                <div className='formatted border text'>
                    <MarkdownLatex content={answer} />
                </div>
                
            </div>
        </div>
        </div>
        
        
    )
}



