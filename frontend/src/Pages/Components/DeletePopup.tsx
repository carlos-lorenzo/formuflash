import React from 'react'

interface IDeletePopupProps {
    popupInfo: {
        show: boolean
        id: number | undefined
    },
    setPopupInfo: React.Dispatch<React.SetStateAction<{show: boolean, id: number | undefined}>>,
    handleDeletion: (id: number | undefined) => void
}

export default function DeletePopup({ popupInfo, setPopupInfo, handleDeletion }: IDeletePopupProps) {
    return (
        <>
        {
            popupInfo.show ?
                <div className='screen-cover'>
                    <div id='delete-popup' className="delete-prompt secondary shadow-accent border place-center">
                        <p>¿Seguro que quieres borrar esto?</p>
                        <div className="delete-options">
                            <button onClick={() => handleDeletion(popupInfo.id)} className='delete-option accent shadow-accent border'>Sí</button>
                            <button onClick={() => setPopupInfo({show: false, id: undefined})} className='delete-option accent-bg shadow-accent border'>No</button>
                        </div>
                        
                    </div>
                </div>
                
                :
                null
        }
        </>
        
    )
}
