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
        <form onSubmit={handleSubmit}>
            <label>
                Question
                <MarkdownLatex content={question} />
                <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                />
            </label>
            <label>
                Answer
                <MarkdownLatex content={answer} />
                <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    )
}



