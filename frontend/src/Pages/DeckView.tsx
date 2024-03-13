import React, { useState, useEffect } from 'react'

import { AxiosInstance } from 'axios'

interface IDeckViewProps {
    client: AxiosInstance,
    activeDeckId: number,
}

export default function DeckView({ client, activeDeckId }: IDeckViewProps) {
    
    interface IDeck {
        name: string,
        description: string,
        cards: {
            id: number,
            question: string,
            answer: string
        }[]
    }
    
    const [activdeDeck, setActiveDeck] = useState({} as IDeck);
    
    useEffect(() => {
        client.get(
            `/fetch_deck?deck_id=${activeDeckId}`,
        ).then((response) => {
            setActiveDeck(response.data.deck);
            
        })
    }, [])

    return (
        <div>DeckView</div>
    )
}
