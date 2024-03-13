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
                <button type="submit" className='shadow border'>Create</button>

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



