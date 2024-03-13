import React from 'react'

import MarkdownLatex from './MarkdownLatex'

interface ICard {
    question: string,
    answer: string,
    confidence: number,
    card_id: number
}

interface ICardPreviewProps {
    card: ICard
}

export default function CardPreview({ card }: ICardPreviewProps) {
    return (

        <div className='card-preview border shadow card'>
            <div className="side-preview text">
                <h4>Q</h4>
                <MarkdownLatex content={card.question} />

            </div>
           
            <div className="side-preview text">
                <h4>A</h4>
                <MarkdownLatex content={card.answer} />

            </div>
            


        </div>

    )
}
