import React from 'react'

import CardPreview from './CardPreview'


interface IDeck {
    name: string,
    course: string,
    cards: {
        id: number,
        question: string,
        answer: string
    }[]
}

interface IDeckPreviewProps {
    activeDeck: IDeck
}

export default function DeckPreview({ activeDeck }: IDeckPreviewProps) {
    return (
        <div>DeckPreview</div>
    )
}
