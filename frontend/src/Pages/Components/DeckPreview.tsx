import CardPreview from './CardPreview'

import IDeck from '../../types/Deck';


interface IDeckPreviewProps {
    activeDeck: IDeck,
}

export default function DeckPreview({ activeDeck }: IDeckPreviewProps) {
    

    return (
        <div className='fill place-center deck-preview'>
            
            <div id="deck-info">
                <h3>{activeDeck.name}</h3>
                
            </div>
            
            

            {Object.entries(activeDeck.cards).map(([key, card]) => {
                const i = parseInt(key)

                return (
                    <CardPreview key={i} card={card} />
                )
            })}
        </div>
    )
}
