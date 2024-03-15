declare interface IDeck {
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
    