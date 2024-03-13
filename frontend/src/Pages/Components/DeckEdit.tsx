import React, {useState} from 'react'

import { AxiosInstance } from 'axios'

import MarkdownLatex from './MarkdownLatex'
import CreateCard from './CreateCard'


interface IDeckEdit {
    client: AxiosInstance
}


export default function DeckEdit({ client }: IDeckEdit) {

    const [activeCardId, setActiveCardId] = useState(0);
    


    return (
        <div id='deck-edit' className='full'>
            <div id='active-deck' className='fill'>
                <h1>some cards</h1>
            </div>
            <CreateCard client={client} />
        
        </div>
    )
}
