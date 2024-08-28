import MarkdownLatex from './MarkdownLatex'

import ICard from '../../types/Card';

interface ICardPreviewProps {
    card: ICard
}

export default function CardPreview({ card }: ICardPreviewProps) {
    
    enum Confidences {
        NONE = 0,
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3
    }

    function getConfidenceClassName(confidence?: number): string {
        if (confidence === undefined) {
            return "none";
        }

        switch (confidence) {
            case Confidences.LOW:
                return "accent";
            case Confidences.MEDIUM:
                return "primary";
            case Confidences.HIGH:
                return "green";
            default:
                return "none";
        }
    }

    return (

        <div className='card-preview border secondary shadow-secondary'>
            <div className="side-preview text">
                <h4>Q</h4>
                <MarkdownLatex content={card.question} />

            </div>
           
            <div className="side-preview text">
                <h4>A</h4>
                <MarkdownLatex content={card.answer} />

            </div>
            <div id="confidence-marker" className={`shadow-${getConfidenceClassName(card?.confidence)} border ${getConfidenceClassName(card?.confidence)}-bg`}></div>
            


        </div>

    )
}
