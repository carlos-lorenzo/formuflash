import React, { useState, useEffect } from 'react'

import { useNavigate } from "react-router-dom";

import { AxiosInstance } from 'axios'

import DeckPreview from './Components/DeckPreview';
import DeckEdit from './Components/DeckEdit';
import DeckStudy from './Components/DeckStudy';


import IDeck from '../types/Deck';
import IUser from '../types/User';

interface IDeckViewProps {
    client: AxiosInstance,
    activeDeckId: number | undefined,
    user: IUser
}

export default function DeckView({ client, activeDeckId, user }: IDeckViewProps) {
    
    const navigate = useNavigate();

    if (!user.loggedIn) {
        navigate('/login');
        
    }

    if (!activeDeckId) {
        navigate('/home');
    }

    
    enum DeckAction {
        PREIVEW = 'PREIVEW',
        EDIT = 'EDIT',
        STUDY = 'STUDY',
    }

    const [activeDeck, setActiveDeck] = useState<IDeck | null>(null);
    const [deckAction, setDeckAction] = useState(DeckAction.EDIT);
    const [activeCardId, setActiveCardId] = useState(0);

    

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

    function getDeck(newCardId?: number) {
        client.get(
            `/fetch_deck?deck_id=${activeDeckId}`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setActiveDeck(response.data);

            if (newCardId) {
                setActiveCardId(newCardId);
            }
        })
    }
    
    if (!activeDeck) {
        return navigate("/home");
    }
    /*

    <div id='deck-view-header' className='fill place-center'>
                <h1>{activeDeck.name} - {activeDeck.course}</h1>
                <div id='deck-options' className='fill'>
                    <button className="border shadow-accent deck-option" onClick={(e) => setDeckAction(DeckAction.PREIVEW)}>Preview</button>
                    <button className="border shadow-accent deck-option" onClick={(e) => setDeckAction(DeckAction.STUDY)}>Study</button>
                    <button className="border shadow-accent deck-option" onClick={(e) => setDeckAction(DeckAction.EDIT)}>Edit</button>

                </div>
            </div>
    */
    return (
        <div id="deck-view" className=''>
            
            

            {
                deckAction === DeckAction.EDIT ? 
                <DeckEdit getDeck={getDeck} client={client} activeDeck={activeDeck} activeDeckId={activeDeckId} activeCardId={activeCardId} setActiveCardId={setActiveCardId}/> : 

                deckAction === DeckAction.STUDY ? 
                <DeckStudy client={client} activeDeck={activeDeck}/> :
                
                deckAction === DeckAction.PREIVEW ?
                <DeckPreview client={client} activeDeck={activeDeck} full={true} getDeck={getDeck} setActiveCardId={setActiveCardId}/>

                :
                <div>Loading...</div>
            }

           
        </div>
    )
}

