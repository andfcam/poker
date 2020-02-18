class Deck {
    constructor() {
        this.suits = ["♣︎", "♦︎", "♥︎", "♠︎"];
        this.numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
        this.cards = [];

        this.create();
    }

    create() {
        for (let suit = 0; suit < 4; suit++) {
            for (let number = 0; number < 13; number++) {
                this.newCard(suit, number);
            }
        }
        this.cards = this.shuffle(this.cards);
    }

    newCard(suit, number) {
        const card = new Card({
            suit: this.suits[suit],
            number: this.numbers[number],
            value: number
        });
        this.cards.push(card);
    }

    shuffle(deck) {
        let shuffledDeck = [];

        while (deck.length > 0) {
            shuffledDeck.push(this.getRandomCard(deck));
        }
        return shuffledDeck;
    }

    getRandomCard(deck) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const card = deck.splice(randomIndex, 1)[0];
        return card;
    }

    getRandomCards(amount) {
        const cards = [];

        for (let i = 0; i < amount; i++) {
            cards.push(this.getRandomCard(this.cards));
        }
        return cards;
    }
}