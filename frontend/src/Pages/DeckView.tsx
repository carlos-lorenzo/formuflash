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
            [cardId: number]: {
                id: number,
                question: string,
                answer: string,
                confidence: number
            }
        }
    }
    
    enum DeckAction {
        PREIVEW = 'PREIVEW',
        EDIT = 'EDIT',
        STUDY = 'STUDY',
    }

    const [activeDeck, setActiveDeck] = useState<IDeck | null>(null);
    const [deckAction, setDeckAction] = useState(DeckAction.PREIVEW);
    const [activeCardId, setActiveCardId] = useState(0);

    function getDeck() {
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
    }

    useEffect(() => {
        client.get(
            `/fetch_deck?deck_id=${activeDeckId}`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setActiveCardId(Number(Object.keys(response.data.cards)[0]));
            setActiveDeck(response.data);
            
        })
    }, [])
    
    if (!activeDeck) {
        return <div>Loading...</div>
    }
    
    return (
        <div id="deck-view" className='place-center'>
            <div id='deck-view-header' className='fill place-center'>
                <h1>{activeDeck.name} - {activeDeck.course}</h1>
                <div id='deck-options' className='fill'>
                    <button className="border shadow-accent deck-option" onClick={(e) => setDeckAction(DeckAction.PREIVEW)}>Preview</button>
                    <button className="border shadow-accent deck-option" onClick={(e) => setDeckAction(DeckAction.STUDY)}>Study</button>
                    <button className="border shadow-accent deck-option" onClick={(e) => setDeckAction(DeckAction.EDIT)}>Edit</button>

                </div>
            </div>
            

            {
                deckAction === DeckAction.EDIT ? 
                <DeckEdit getDeck={getDeck} client={client} activeDeck={activeDeck} activeDeckId={activeDeckId} activeCardId={activeCardId} setActiveCardId={setActiveCardId}/> : 
                deckAction === DeckAction.STUDY ? 
                <DeckStudy client={client} activeDeck={activeDeck}/> : 
                <DeckPreview activeDeck={activeDeck} full={true} setActiveCardId={setActiveCardId}/>
            }

           
        </div>
    )
}

