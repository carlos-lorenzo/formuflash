import React from 'react'

import { AxiosInstance } from 'axios';


interface ILandingPageProps {
    client: AxiosInstance
}

export default function LandingPage({ client }: ILandingPageProps) {

    const [file, setFile] = React.useState<File | null>(null);

    function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file as Blob);
        formData.append('deck_id', '4');

        client.put(
            "upload_cards_csv",
            formData,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        })
    }

    function handleFileSubmit(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (!e.target.files) {
            return;
        }
        
        if(e.target.files[0].size > 100000) {
            alert("File too big");
            return;
        }
        setFile(e.target.files[0]);
    }
    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                Landing Page
            </h1>
            
            <form onSubmit={(e) => handleFileUpload(e)}>
                <input id="file" type="file" accept=".csv" onChange={(e) => handleFileSubmit(e)}/>
                <button type='submit'><h3>Upload</h3></button>
            </form>
            
        </>
        

    )
}
