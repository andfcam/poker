class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.chips = 1000;
    }

    dealCards(cards) {
        this.cards = cards;
    }
}