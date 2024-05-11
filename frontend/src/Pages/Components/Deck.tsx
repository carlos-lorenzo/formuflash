import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import IBriefDeck from '../../types/BriefDeck';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faPenToSquare, faMagnifyingGlass, faTrashCan, faPen, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import ToolTip from './ToolTip';


enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IDeckProps {
    client: AxiosInstance
    deckData: IBriefDeck,
    
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteInfo: React.Dispatch<React.SetStateAction<{show: boolean, id: number | undefined}>>,   
}


export default function Deck({ client, deckData, setActiveDeckId, setDeckAction, setShowBack, setDeleteInfo }: IDeckProps) {
    const navigate = useNavigate()

    const [renamingDeck, setRenamingDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState(deckData.name);
    const [deckName, setDeckName] = useState(deckData.name);

    function handleOptionClick(action: DeckAction) {
        setDeckAction(action);
        setActiveDeckId(deckData.deck_id);
        setShowBack(true);
        navigate(`/deck-view`);
    }


    function handleDeckRename() {
        const id = toast.loading("Renaming deck");

        client.post(
            '/rename_deck',
            {
                deck_id: deckData.deck_id,
                name: newDeckName
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setRenamingDeck(false);
            setDeckName(response.data.name);
            toast.update(id, {
                render: "Deck renamed",
                
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

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
        <div className='deck place-center secondary shadow-secondary border shadow-margin'>
            {
                renamingDeck ? 
                <div className="rename">
                    <input type='text' maxLength={50} className="rename-input" value={newDeckName} onChange={(event) => setNewDeckName(event.target.value)}/>
                    <ToolTip text="Confirm Rename">
                        <FontAwesomeIcon icon={faCircleCheck} size='lg' className='pointer deck-option' onClick={() => handleDeckRename()}/>
                    </ToolTip>
                    
                    <ToolTip text="Cancel Rename">
                        <FontAwesomeIcon icon={faCircleXmark} size='lg' className='pointer deck-option' onClick={() => setRenamingDeck(false)}/>
                    </ToolTip>
                </div>
                
                : 

                <div className="current-name">
                    <h3>{deckName}</h3>

                    <ToolTip text="Rename Deck">
                        <FontAwesomeIcon icon={faPen} size='lg' className='pointer deck-option' onClick={() => setRenamingDeck(true)}/>
                    </ToolTip>
                </div>
            }
            
            <div className="deck-options">
                
                <ToolTip text="Study Deck">
                    <FontAwesomeIcon icon={faGraduationCap} size='2x' className='pointer deck-option' onClick={() => handleOptionClick(DeckAction.STUDY)}/>
                </ToolTip>

                <ToolTip text="Edit Deck">
                    <FontAwesomeIcon icon={faPenToSquare} size='2x' className='pointer deck-option' onClick={() => handleOptionClick(DeckAction.EDIT)}/>
                </ToolTip>
                
                <ToolTip text="Preview Deck">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='2x' className='pointer deck-option' onClick={() => handleOptionClick(DeckAction.PREIVEW)}/>
                </ToolTip>
            </div>
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={() => setDeleteInfo({show: true, id: deckData.deck_id})}/>
        </div>
    )
}
