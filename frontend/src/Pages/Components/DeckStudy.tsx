import React from 'react'

import { AxiosInstance } from 'axios'

interface IDeck {
    name: string,
    course: string,
    cards: {
        id: number,
        question: string,
        answer: string,
        confidence: number,
        card_id: number
    }[]
}


interface IDeckStudyProps {
    client: AxiosInstance
    activeDeck: IDeck
}


export default function DeckStudy({ client, activeDeck }: IDeckStudyProps) {
    return (
        <div>{activeDeck.name}</div>
    )
}
