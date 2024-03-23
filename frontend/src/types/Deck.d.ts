declare interface IDeck {
    deck_id: number,
    name: string,
    course: string,
    cards: {
        [cardId: number]: {
            id: number,
            question: string,
            answer: string,
            confidence: number
        }
    }
}
export default IDeck;
    