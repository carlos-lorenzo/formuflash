import React from 'react'

import MarkdownLatex from './MarkdownLatex'

interface ICard {
    question: string,
    answer: string,
    confidence: number,
    card_id: number
}

interface ICardEditPreviewProps {
    card: ICard,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>
}

export default function CardEditPreview({ card, setActiveCardId }: ICardEditPreviewProps) {

    
    return (
        <div className='border shadow card-edit-preview place-center' onClick={() => setActiveCardId(card.card_id)}>
            <p><MarkdownLatex content={card.question}/></p>
        </div>
    )
}
