import React from 'react'

import { AxiosInstance } from 'axios';

import UploadCards from './Components/UploadCards';

interface ILandingPageProps {
    client: AxiosInstance
}

export default function LandingPage({ client }: ILandingPageProps) {

   
    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                Landing Page
            </h1>
            
            <UploadCards client={client} deckId={6}/>
            
        </>
        

    )
}
