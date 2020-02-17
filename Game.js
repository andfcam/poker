class Game {
    constructor() {
        this.players = [];
        this.blind = { small: 1, big: 2 };

        this.start();
    }

    start() {
        this.table = new Table();
        this.deck = new Deck();

        const names = ["Andy", "Duchess", "Texas", "Lucky"]

        for (let i = 0; i < 4; i++) {
            const player = new Player({
                name: names[i],
                id: i + 1
            });
            this.players.push(player);
        }

        this.players[3].dealer = true; // index will shift to [0] on new turn

        this.newTurn();
    }

    newTurn() {
        this.passDealer();
        // display dealer token
        this.dealCards();
    }

    passDealer() {
        const currentDealer = this.players.find(player => player.dealer === true);
        const nextDealer = this.players[this.nextId(currentDealer.id)];
        currentDealer.dealer = false;
        nextDealer.dealer = true;
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

    nextId(id) {
        return (id + 1) % 4;
    }
}