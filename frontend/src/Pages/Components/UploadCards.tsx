import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faXmark } from '@fortawesome/free-solid-svg-icons';

import ToolTip from './ToolTip';

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

        handleFileUpload(file);
    }

    function handleFileUpload(fileToUpload: File | null = file) {
        const id = toast.loading("Uploading file");
        
        if (!fileToUpload) {
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
        formData.append('file', fileToUpload as Blob);
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

    function handleClosePrompt() {
        setFile(null);
        setShowUpload(false);
    }

    return (
        <div>
            <ToolTip text='Upload Deck'>
                <FontAwesomeIcon className='pointer grow transition-to-primary' icon={faFileImport} onClick={() => setShowUpload(true)} size='xl'/>
            </ToolTip>
            {
                showUpload ? 
                <div className='screen-cover'>
                    <div id='upload-popup' className="upload-prompt secondary shadow-accent border place-center">
                        <FontAwesomeIcon icon={faXmark} className='pointer delete-card' onClick={() => handleClosePrompt()} size='xl'/>

                        <label className='file-lable pointer' htmlFor='file'>
                            <p>Select <b>.csv</b> file to upload</p>
                            <p><em>column format: question,answer</em></p>
                            <p><b>{file?.name}</b></p>
                        </label>
                        <input onChange={(e) => handleFileSubmit(e)} id="file" className="file-input" type="file" accept=".csv"/>
                    </div>
                </div> :
                null
            }
            
            
        </div>
    )
}
