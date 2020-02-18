class Game {
    constructor() {
        this.players = [];
        this.names = ["Andy", "Duchess", "Texas", "Lucky"]
        this.roles = ["dealer", "smallBlind", "bigBlind", "starter"];
        this.blinds = { small: 1, big: 2 };

        this.start();
    }

    start() {
        this.table = new Table();
        this.deck = new Deck();

        this.createPlayers();

        this.newTurn();
    }

    createPlayers() {
        for (let i = 0; i < 4; i++) {
            const player = new Player({
                name: this.names[i],
                role: this.roles[i],
                id: i + 1
            });
            this.players.push(player);
        }
    }

    newTurn() {
        this.assignRoles(); // display dealer token
        this.dealCards();
        console.log(this.players, this.deck, this.table);
    }

    assignRoles() {
        const dealer = this.players.find(player => player.role === 'dealer');
        this.players.forEach((player, i) => {
            const position = (dealer.id + i) % 4;
            player.role = this.roles[position]
        });
    }

    dealCards() {
        this.players.forEach(player => player.dealCards(this.deck.getRandomCards(2)));
        this.table.dealCards(this.deck.getRandomCards(5));
    }

    updateDom() {
        this.players.forEach(player => player.updateDom());
    }

    activePlayer() {
        return this.players.find(player => player.active === true); // === true necessary?
    }

    nextPlayer() {
        const next = (this.activePlayer().id + 1) % 4;
        return this.players[next];
    }
}