class Game {
    constructor() {
        this.players = [];

        this.start();
    }

    start() {
        this.table = new Table();

        const names = ["Andy", "Duchess", "Texas", "Lucky"]
        for (let i = 0; i < 4; i++) {
            const player = new Player({
                name: names[i],
                id: i + 1
            });
            this.players.push(player);
        }

        this.deck = new Deck();

        this.newTurn();
    }

    newTurn() {
        // change button, small blind, big blind
        this.dealCards();
    }

    dealCards() {
        this.players.forEach(player => {
            const cards = this.deck.getRandomCards(2);
            player.dealCards(cards);
        });

        const cards = this.deck.getRandomCards(5);
        this.table.dealCards(cards);
    }

    updateDom() {
        this.players.forEach(player => player.updateDom());
    }
}