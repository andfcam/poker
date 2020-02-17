class Game {
    constructor() {
        this.players = [];
    
        this.start();
    }

    start() {
        const names = ["Andy", "Texas", "Lucky", "Dame"]

        for (let i = 0; i < 4; i++) {
            const player = new Player(names[i]);
            this.players.push(player);
        }

        this.deck = new Deck();
        this.dealCards();
        this.updateDom();
    }

    dealCards() {
        this.players.forEach(player => {
            const cards = this.deck.getRandomCards(2);
            player.dealCards(cards);
        });
    }

    updateDom() {
        this.players.forEach((player, index) => {
            const selector = `#player${index + 1}`;
            document.querySelector(`${selector} h2`).innerText = player.name;
            document.querySelector(`${selector} p`).innerText = player.chips;
        });
    }
}