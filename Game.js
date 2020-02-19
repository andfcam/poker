class Game {
    constructor() {
        this.players = [];
        this.names = ["Andy", "Duchess", "Texas", "Lucky"]
        this.roles = ["dealer", "smallBlind", "bigBlind", "starter"]; // can add empty roles ""for every player after 4;
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
        for (let i = 0; i < 4; i++) { // remove hard-coded 4 (this.players currently empty)
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
        this.betBlinds();
        this.dealCards();

        this.players[0].startTimer();
    }

    assignRoles() {
        const dealer = this.players.find(player => player.role === 'dealer');
        this.players.forEach((player, i) => {
            const position = (dealer.id + i) % this.players.length;
            player.role = this.roles[position];
        });
    }

    betBlinds() {
        for (const key in this.blinds) {
            const player = this.players.find(player => player.role === `${key}Blind`);
            this.table.addToPot(player.bet(this.blinds[key]));
        }
    }

    dealCards() {
        this.players.forEach(player => player.dealCards(this.deck.getRandomCards(2)));
        this.table.dealCards(this.deck.getRandomCards(5));
    }

    updateDom() {
        this.players.forEach(player => player.updateDom());
    }

    activePlayer() {
        return this.players.find(player => player.active);
    }

    nextPlayer() {
        const next = (this.activePlayer().id + 1) % this.players.length;
        return this.players[next];
    }
}