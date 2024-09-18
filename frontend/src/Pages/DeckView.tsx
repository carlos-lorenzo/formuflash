import { useState, useEffect, lazy, useRef } from 'react'

import { useNavigate } from "react-router-dom";

import { AxiosInstance } from 'axios'

const DeckPreview = lazy(() => import('./Components/DeckPreview'));
const DeckEdit = lazy(() => import('./Components/DeckEdit'));
const DeckStudy = lazy(() => import('./Components/DeckStudy'));


import IDeck from '../types/Deck';
import IUser from '../types/User';

enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IDeckViewProps {
    client: AxiosInstance,
    user: IUser,
    activeDeckId: number | undefined,
    deckAction: DeckAction
    
}

export default function DeckView({ client, user, activeDeckId, deckAction }: IDeckViewProps) {
    
    const navigate = useNavigate();
    const deckPreviewRef = useRef<HTMLDivElement>(null);


    function scrollToBottom() {
        if (deckPreviewRef.current) {
            deckPreviewRef.current.scrollTo({ top: deckPreviewRef.current.scrollHeight, behavior: 'smooth' });
        }
    }

    if (!user.loggedIn) {
        navigate('/login');
        
    }

    if (!activeDeckId) {
        navigate('/home');
    }

    
    
    const [activeDeck, setActiveDeck] = useState<IDeck | null>(null);
    
    const [activeCardId, setActiveCardId] = useState(0);

    

    useEffect(() => {
        if (!activeDeckId) {
            return;
        }
        client.get(
            `/fetch_deck?deck_id=${activeDeckId}`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setActiveCardId(Number(Object.keys(response.data.cards)[Object.keys(response.data.cards).length - 1]));
            setActiveDeck(response.data);
            scrollToBottom();
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
        return <h3 className='place-center'>Cargando</h3>;
    }
    
    return (
        <div id="deck-view" >
            
            

            {
                deckAction === DeckAction.EDIT ? 
                <DeckEdit getDeck={getDeck} client={client} activeDeck={activeDeck} activeDeckId={activeDeckId} activeCardId={activeCardId} deckPreviewRef={deckPreviewRef} setActiveCardId={setActiveCardId} scrollToBottom={scrollToBottom}/> : 

                deckAction === DeckAction.STUDY ? 
                <DeckStudy client={client} activeDeck={activeDeck}/> :
                
                deckAction === DeckAction.PREIVEW ?
                <DeckPreview activeDeck={activeDeck}/>

                :
                <div className='place-center'><h3>Cargando...</h3></div>
            }

           
        </div>
    )
}

