import React from 'react'

import { AxiosInstance } from 'axios';


interface ILandingPageProps {
    client: AxiosInstance
}

export default function LandingPage({ client }: ILandingPageProps) {
    function handleFileSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(e.target);
        return;
        client.put(
            "upload_cards_csv",
            
        ).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error(error)
        })
    }
    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                Landing Page
            </h1>
            
            <form onSubmit={(e) => handleFileSubmit(e)}>
                <input type="file" accept=".csv" />
                <button type='submit'><h3>Upload</h3></button>
            </form>
            
        </>
        


    )
}
