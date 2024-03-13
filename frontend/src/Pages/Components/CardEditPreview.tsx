import React from 'react'

import MarkdownLatex from './MarkdownLatex'

interface ICard {
    question: string,
    answer: string,
    confidence: number,
    card_id: number
}

interface ICardEditPreviewProps {
    card: ICard
}

export default function CardEditPreview({ card }: ICardEditPreviewProps) {
    return (
        <div className='border shadow card-edit-preview place-center'>
            <p><MarkdownLatex content={card.question}/></p>
        </div>
    )
}
