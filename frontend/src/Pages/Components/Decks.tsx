import React from 'react';

import MediaQuery from 'react-responsive';

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import CreateDeck from './CreateDeck';

import Deck from './Deck';
import DeletePopup from './DeletePopup';



import IBriefDeck from '../../types/BriefDeck';

enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IDecksProps {
    client: AxiosInstance,
    activeCourseId: number | undefined,
    decks: IBriefDeck[],
    activeCourseName: string,
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    getCourseDecks: (courseId: number | undefined) => void,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    setShowingCourses: React.Dispatch<React.SetStateAction<boolean>>,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>
}

interface IDeleteInfo {
    show: boolean,
    id: number | undefined
}

export default function Decks({ client, activeCourseId, decks, activeCourseName, setActiveDeckId, getCourseDecks, setDeckAction, setShowingCourses, setShowBack }: IDecksProps) {

    const [deleteInfo, setDeleteInfo] = React.useState<IDeleteInfo>({show: false, id: undefined});

    function handleDeckDelete(id: number | undefined) {

        if (id === undefined) {
            return;
        }


        const toastId = toast.loading("Eliminando mazo");

        client.post(
            '/delete_deck',
            {
                id: id
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then(() => {
            setDeleteInfo({show: false, id: undefined});

            toast.update(toastId, {
                render: "Mazo eliminado",
                type: "info",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            getCourseDecks(activeCourseId);
        }).catch(() => {

            toast.update(toastId, {
                render: "Error eliminando mazo",
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
        <div id='decks'>
            {
                activeCourseId ? 
                <div id="course-decks-title" onClick={() => setShowingCourses(true)} className='pointer'>
                    <MediaQuery query='(min-width: 1281px)'>
                        <h3>{`${activeCourseName}`}</h3> 
                    </MediaQuery>
                    <MediaQuery query='(max-width: 1280px)'>
                        <h3>{`<- ${activeCourseName}`}</h3> 
                    </MediaQuery>
                </div>  
                : null
            }
            
            {
                decks.map((deck) => (
                    <Deck
                        key={deck.deck_id}
                        client={client}
                        deckData={deck}
                        setActiveDeckId={setActiveDeckId}
                        setDeckAction={setDeckAction}
                        setShowBack={setShowBack}
                        setDeleteInfo={setDeleteInfo}
                    />
                ))
            }

            {
                activeCourseId ? 
                <CreateDeck client={client} activeCourseId={activeCourseId} getCourseDecks={getCourseDecks}/>

                : null
            }

            <DeletePopup popupInfo={deleteInfo} setPopupInfo={setDeleteInfo} handleDeletion={handleDeckDelete}/>
            
            
            
        </div>
    )
}
