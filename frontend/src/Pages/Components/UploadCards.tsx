import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons';

interface IUploadCardsProps {
    client: AxiosInstance,
    deckId: number,
    getDeck: () => void
}

export default function UploadCards({ client, deckId, getDeck}: IUploadCardsProps) {

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
    }

    function handleFileDrag(e: React.DragEvent<HTMLDivElement>) {
        console.log(e);
        const file = e.dataTransfer.files[0];

        if(file.size > 100000) {
            alert("File too big");
            return;
        }

        setFile(file);

        
    }

    function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
            getDeck();
            setShowUpload(false);
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
            <FontAwesomeIcon className='pointer grow transition-to-primary' icon={faUpload} onClick={() => setShowUpload(true)} size='xl'/>
            {
                showUpload ? 
                <div className='screen-cover'>
                    <div id='upload-popup' className="upload-prompt secondary shadow-accent border place-center"
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={(e) => handleFileDrag(e)}>
                        <FontAwesomeIcon icon={faXmark} className='pointer delete-card' onClick={() => setShowUpload(false)} size='xl'/>
                        <form id='upload-form' onSubmit={(e) => handleFileUpload(e)}>
                            <label htmlFor="file">Upload</label>
                            <input onChange={(e) => handleFileSubmit(e)} id="file" className="file-input" type="file" accept=".csv"/>
                            <button type='submit'>Upload</button>
                        </form>
                    </div>
                </div> :
                null
            }
            
            
        </div>
    )
}
