import React, { useState, useEffect } from 'react'

import { AxiosInstance } from 'axios'

import DeckPreview from './Components/DeckPreview';
import DeckEdit from './Components/DeckEdit';
import DeckStudy from './Components/DeckStudy';
interface IDeckViewProps {
    client: AxiosInstance,
    activeDeckId: number,
}

export default function DeckView({ client, activeDeckId }: IDeckViewProps) {
    
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
    
    enum DeckAction {
        PREIVEW = 'PREIVEW',
        EDIT = 'EDIT',
        STUDY = 'STUDY',
    }

    const [activeDeck, setActiveDeck] = useState<IDeck | null>(null);
    const [deckAction, setDeckAction] = useState(DeckAction.PREIVEW);


    useEffect(() => {
        client.get(
            `/fetch_deck?deck_id=${activeDeckId}`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            
            setActiveDeck(response.data);
            
        })
    }, [])
    
    if (!activeDeck) {
        return <div>Loading...</div>
    }
    
    return (
        <div id="deck-view" className='full place-center'>
            <h1>{activeDeck.name} - {activeDeck.course}</h1>
            <div id='option-selector'>
                <button onClick={(e) => setDeckAction(DeckAction.PREIVEW)}>Preview</button>
                <button onClick={(e) => setDeckAction(DeckAction.STUDY)}>Study</button>
                <button onClick={(e) => setDeckAction(DeckAction.EDIT)}>Edit</button>

            </div>

            {
                deckAction === DeckAction.EDIT ? <DeckEdit client={client} activeDeck={activeDeck} /> : <DeckPreview activeDeck={activeDeck} full={true} />
            }

           
        </div>
    )
}
