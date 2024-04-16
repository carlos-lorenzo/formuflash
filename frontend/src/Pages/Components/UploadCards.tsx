import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons';

interface IUploadCardsProps {
    client: AxiosInstance,
    deckId: number
}

export default function UploadCards({ client, deckId}: IUploadCardsProps) {

    const [file, setFile] = React.useState<File | null>(null);
    const [showUpload, setShowUpload] = React.useState<boolean>(false);

    function handleFileSubmit(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        if(file.size > 100000) {
            alert("File too big");
            return;
        }
        setFile(file);

        handleFileUpload()
    }

    function handleFileDrag(e: React.DragEvent<HTMLDivElement>) {
        console.log(e);
        const file = e.dataTransfer.files[0];

        if(file.size > 100000) {
            alert("File too big");
            return;
        }

        setFile(file);

        handleFileUpload();
    }

    function handleFileUpload() {

        const id = toast.loading("Uploading file");
        
        if (!file) {
            toast.update(id, {
                render: "No file selected",
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            return;
        }

        const formData = new FormData();
        formData.append('file', file as Blob);
        formData.append('deck_id', deckId.toString());

        client.put(
            "upload_cards_csv",
            formData,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            toast.update(id, {
                render: response.data.message,
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch((error) => {
            toast.update(id, {
                render: error.response.data.error,
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        })
    }

    return (
        <div>
            <FontAwesomeIcon icon={faUpload} onClick={() => setShowUpload(true)} size='2x'/>
            {
                showUpload ? 
                <div className='screen-cover'>
                    <div id='upload-popup' className="upload-prompt secondary shadow-accent border place-center"
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={(e) => handleFileDrag(e)}>
                        <FontAwesomeIcon icon={faXmark} className='pointer delete-card' onClick={() => setShowUpload(false)} size='xl'/>
                        <form id='upload-form'>
                            <label htmlFor="file">Upload</label>
                            <input onChange={(e) => handleFileSubmit(e)} id="file" className="file-input" type="file" accept=".csv"/>
                        </form>
                    </div>
                </div> :
                null
            }
            
            
        </div>
    )
}
