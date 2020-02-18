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
                name: names[i],
                role: roles[i],
                id: i + 1
            });
            this.players.push(player);
        }
    }

    newTurn() {
        this.assignRoles(); // display dealer token
        this.dealCards();
    }

    assignRoles() {
        const dealer = this.players.find(player => player.role === 'dealer');
        const position = (dealer.id + i) % 4;
        this.players.forEach((player, i) => player.role = this.roles[position]);
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
        return this.players[(this.activePlayer().id + 1) % 4];
    }
}