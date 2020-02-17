class Deck {
    constructor() {
        this.suits = ["clubs", "diamonds", "hearts", "spades"];
        this.numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
        this.cards = [];

        this.create();
    }

    create() {
        for (let suit = 0; suit < 4; suit++) {
            for (let number = 0; number < 13; number++) {
                const card = new Card(this.suits[suit], this.numbers[number]);
                this.cards.push(card);
            }
        }
    }

    shuffle(deck) {
        let shuffledDeck = [];

        while (deck.length > 0) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            const card = deck.splice(randomIndex, 1)[0];
            shuffledDeck.push(card);
        }

        return shuffledDeck;
    }


}