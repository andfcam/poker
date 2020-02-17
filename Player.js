class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.chips = 1000;
        this.button = false;
    }

    dealCards(cards) {
        this.cards = cards;
    }
}