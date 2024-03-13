import React from 'react'

import CardPreview from './CardPreview'
import CardEditPreview from './CardEditPreview'

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

interface IDeckPreviewProps {
    activeDeck: IDeck,
    full: boolean
}

export default function DeckPreview({ activeDeck, full }: IDeckPreviewProps) {
    return (
        <div id='deck-edit-preview' className='card'>
            {activeDeck.cards.map((card, i) => {
                return (
                    full ? <CardPreview key={i} card={card} /> : <CardEditPreview key={i} card={card} />
                )
            })}
        </div>
    )
}
