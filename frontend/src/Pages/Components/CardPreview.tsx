import React from 'react'

import MarkdownLatex from './MarkdownLatex'

import ICard from '../../types/Card';

interface ICardPreviewProps {
    card: ICard
}

export default function CardPreview({ card }: ICardPreviewProps) {
    return (

        <div className='card-preview border secondary shadow-secondary fill'>
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
