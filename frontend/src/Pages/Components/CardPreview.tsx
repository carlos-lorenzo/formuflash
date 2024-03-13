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
        <div>CardPreview</div>
    )
}
