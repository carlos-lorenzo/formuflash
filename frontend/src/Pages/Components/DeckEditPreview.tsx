import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowRotateLeft, faFloppyDisk, faFileExport } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import UploadCards from './UploadCards';
import CardEditPreview from './CardEditPreview'
import ToolTip from './ToolTip';

import IDeck from '../../types/Deck';



interface IDeckPreviewProps {
    client: AxiosInstance,
    activeDeck: IDeck,
    getDeck: (newCardId?: number) => void,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>
    handleCardUpdate: () => void,
    handleCardCreation: () => void,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeckEditPreview({ client, activeDeck, getDeck, setActiveCardId, handleCardUpdate, handleCardCreation, setEditing }: IDeckPreviewProps) {
    
    function resetConfidences() {

        const id = toast.loading("Reiniciando confidencias");

        client.post("/reset_confidences",
        {
            deck_id: activeDeck.deck_id
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getDeck();

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
            });
        }) 
    }

    function exportDeckAsCsv() {

        const id = toast.loading("Exportando");

        client.get(`/export_deck?deck_id=${activeDeck.deck_id}`,
            {
                responseType: 'blob',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }

        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${activeDeck.name}.csv`);
            document.body.appendChild(link);
            link.click();
            // Delete the temporary URL
            window.URL.revokeObjectURL(url);


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
            });
        })
    }

    return (
        <div className='fill place-center deck-preview'>
            
            <div className="deck-info">
                <h3>{activeDeck.name}</h3>
                <div className="deck-info-actions">
                    <UploadCards client={client} deckId={activeDeck.deck_id} getDeck={getDeck}/>
                    <ToolTip text='Exportar Mazo'>
                        <FontAwesomeIcon icon={faFileExport} size='xl' onClick={exportDeckAsCsv} className='pointer grow transition-to-primary'/>
                    </ToolTip>

                    <ToolTip text='Reiniciar Confidencias'>
                        <FontAwesomeIcon icon={faArrowRotateLeft} size='xl' onClick={resetConfidences} className='pointer grow transition-to-primary'/>
                    </ToolTip>

                    <ToolTip text='Guardar'>
                        <FontAwesomeIcon icon={faFloppyDisk} size='xl' onClick={handleCardUpdate} className='pointer grow transition-to-primary'/>
                    </ToolTip>
                </div>
                
            </div>
            
            
            

            {Object.entries(activeDeck.cards).map(([key, card]) => {
                const i = parseInt(key)

                return (
                    <CardEditPreview key={i} client={client} getDeck={getDeck} card={card} setActiveCardId={setActiveCardId} setEditing={setEditing}/>
                )
            })}
            
                
            <div className='border secondary shadow-secondary card-edit-preview place-center pointer' onClick={handleCardCreation}>
                <ToolTip text='Nueva Tarjeta'>
                    <FontAwesomeIcon icon={faPlusCircle} size='2x'/>
                </ToolTip>
            </div>
            
            


        </div>
    )
}
