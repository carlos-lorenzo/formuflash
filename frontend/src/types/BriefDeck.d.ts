
declare interface IBriefDeck {
    name: string,
    deck_id: number,
    stats: {
        completion: number,
        confidence: number
    }
}
export default IBriefDeck;