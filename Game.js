class Game {
    constructor() {
        this.players = [];

        this.start();
    }

    start() {
        const names = ["Andy", "Duchess", "Texas", "Lucky"]

        for (let i = 0; i < 4; i++) {
            const player = new Player({
                name: names[i],
                id: i + 1
            });
            this.players.push(player);
        }

        this.deck = new Deck();
        this.dealCards();
    }

    dealCards() {
        this.players.forEach(player => {
            const cards = this.deck.getRandomCards(2);
            player.dealCards(cards);
        });

        const cards = this.deck.getRandomCards(5);
    }

    updateDom() {
        this.players.forEach(player => player.updateDom());
    }
}