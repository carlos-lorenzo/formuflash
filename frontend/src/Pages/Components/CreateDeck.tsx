import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

import ToolTip from './ToolTip';

interface ICreateDeckProps {
    client: AxiosInstance
    activeCourseId: number
    getCourseDecks: (courseId: number) => void
}

export default function CreateDeck({ client, activeCourseId, getCourseDecks }: ICreateDeckProps) {

    const [deckName, setDeckName] = useState<string>('');
    const [promptActive, setPromptActive] = useState<boolean>(false);

    function handleCreateClick() {
        setPromptActive(!promptActive);
    }

    function handleError(error: any): string {
        if(error.response.data.error) {
            return error.response.data.error
        }
        return "Error inesperado"
    }

    function handleDeckCreation(e: React.FormEvent) {
        e.preventDefault();

        const id = toast.loading("Creando mazo");

        client.post('/create_deck',
        {
            name: deckName,
            course_id: activeCourseId
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((_) => {

            toast.update(id, {
                render: "Mazo creado",
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            getCourseDecks(activeCourseId);
            setPromptActive(false);
            setDeckName('');
        }).catch((error) => {
            toast.update(id, {
                render: handleError(error),
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    return (
        <>
            <div id="create-deck-button" className='create place-center secondary shadow-secondary pointer border shadow-margin' onClick={handleCreateClick}>
                <ToolTip text="Crear Mazo">
                    <FontAwesomeIcon icon={faCirclePlus} size='2x'/>
                </ToolTip>
            </div>

            {
                promptActive ?
                <>
                    <div className="screen-cover"></div>
                    <div id="create-deck-prompt" className="create-prompt secondary shadow-accent border">
                        <FontAwesomeIcon icon={faXmark} size='2x' className='pointer close-prompt' onClick={() => setPromptActive(false)}/>
                        <form onSubmit={(e) => handleDeckCreation(e)} className='create-prompt-form'>
                            <label htmlFor="create-deck-input">Crear Mazo</label>
                            <input id="create-deck-input" maxLength={50} className="create-input" type="text" autoComplete="off" value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder='Nombre'/>
                            <button type="submit" className='shadow-accent accent border'>Crear</button>
                        </form>
                        
                    </div> 
                
                </>
                
                
                
                : null
            }
        </>
        

        
    )
}
