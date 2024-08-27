import React, { useState, useEffect, useRef, lazy } from 'react';

import { AxiosInstance } from 'axios';

import MediaQuery from 'react-responsive';

import { toast } from 'react-toastify';


const DeckEditPreview = lazy(() => import('./DeckEditPreview'));
const CreateCard = lazy(() => import('./CreateCard'));

import IDeck from '../../types/Deck';


interface IDeckEdit {
    client: AxiosInstance,
    activeDeck: IDeck,
    activeDeckId: number | undefined,
    activeCardId: number,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>,
    getDeck: (newCardId?: number) => void
}


export default function DeckEdit({ client, activeDeck, activeDeckId, activeCardId, setActiveCardId, getDeck }: IDeckEdit) {

    
    const [editing, setEditing] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');


    const questionInput = useRef<HTMLTextAreaElement>(null);
    const answerInput = useRef<HTMLTextAreaElement>(null);
    const deckPreviewRef = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
        if (deckPreviewRef.current) {
            deckPreviewRef.current.scrollTo({ top: deckPreviewRef.current.scrollHeight, behavior: 'smooth' });
        }
    }

    function handleCardUpdate() {
        const id = toast.loading("Guardando");
        client.post('/update_card', {
            deck_id: activeDeckId,
            question: question,
            answer: answer,
            card_id: activeCardId,
        }, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            }
        }).then(() => {
            getDeck();

            toast.update(id, 
                { 
                render: "Guardado", 
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
            toast.update(id, 
                { 
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

    function handleCardCreation() {
        handleCardUpdate();
        client.post('/create_card', 
        {
            deck_id: activeDeck.deck_id,
            question: '',
            answer: '', 
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            questionInput.current?.focus();
            getDeck(response.data.card.card_id);
        })

    }

    function handleShortcuts(event: any) {
        
        if (event.ctrlKey) {
            if (event.key === "s") {
                handleCardUpdate();
                event.preventDefault();
            } else if (event.key === "d") {
                handleCardCreation();
                scrollToBottom()
                event.preventDefault();
            }
        }
    }

    useEffect(() => {
        setQuestion(activeDeck.cards[activeCardId].question);
        setAnswer(activeDeck.cards[activeCardId].answer);
    }, [activeCardId])

    function handleDeckSwitch() {
        if (!editing) {
            return;
        }
        setEditing(!editing);
        handleCardUpdate();
    }

    return (
        <>
            <MediaQuery query='(min-width: 1281px)'>
                <div id='deck-edit' onKeyDown={handleShortcuts} tabIndex={0}>
                    <div className="whitespace"></div>
                    <DeckEditPreview 
                        client={client} 
                        activeDeck={activeDeck}
                        activeCardId={activeCardId}
                        deckPreviewRef={deckPreviewRef}
                        getDeck={getDeck}
                        setActiveCardId={setActiveCardId}
                        handleCardUpdate={handleCardUpdate}
                        handleCardCreation={handleCardCreation}
                        setEditing={setEditing}
                    />

                    <CreateCard 
                        question={question}
                        answer={answer}
                        questionInput={questionInput}
                        answerInput={answerInput}
                        setQuestion={setQuestion} 
                        setAnswer={setAnswer}
                    />
                </div>
            </MediaQuery>
            <MediaQuery query='(max-width: 1280px)'>
                <div id='deck-edit' onKeyDown={handleShortcuts} tabIndex={0}>
                    <div id="edit-select">
                        <h3 className='pointer' onClick={() => handleDeckSwitch()} style={{color: editing ? 'var(--text)' : 'var(--primary)'}}>Mazo</h3>
                        <h3 className='pointer' onClick={() => setEditing(true)} style={{color: editing ? 'var(--primary)' : 'var(--text)'}}>Editar</h3>
                    </div>
                    
                    {
                        editing ? 
                        <CreateCard 
                            question={question}
                            answer={answer}
                            questionInput={questionInput}
                            answerInput={answerInput}
                            setQuestion={setQuestion} 
                            setAnswer={setAnswer}
                        /> : 
                        <DeckEditPreview 
                            client={client} 
                            activeDeck={activeDeck}
                            activeCardId={activeCardId}
                            deckPreviewRef={deckPreviewRef} 
                            getDeck={getDeck}
                            setActiveCardId={setActiveCardId}
                            handleCardUpdate={handleCardUpdate}
                            handleCardCreation={handleCardCreation}
                            setEditing={setEditing}
                        />
                    }
                    
                    </div>
            </MediaQuery>
        </>
       
    )
}
