class Round {
    constructor(data) {
        this.players = data.players;
        this.blinds = data.blinds;

        this.play();
    }

    play() {
        this.table = new Table();
        this.deck = new Deck();

        this.assignRoles();
        this.betBlinds();
        this.dealCards();
    }

    assignRoles() {
        const roles = this.availableRoles(); 
        const dealer = this.findPlayer('dealer') || this.players[0];
        this.players.forEach((player, i) => {
            const position = (dealer.id + i) % this.players.length;
            player.role = roles[position];
        });
    }

    availableRoles() {
        // need to create roles depending on how many players in the round
        // for two players, only small blind and big blind roles - button with small blind
        // can add empty roles ""for every player after 4;
        return ["dealer", "smallBlind", "bigBlind", "starter"];
    }

    betBlinds() {
        for (const key in this.blinds) {
            const player = this.findPlayer(`${key}Blind`);
            this.table.addToPot(player.bet(this.blinds[key]));
        }
    }

    dealCards() {
        this.players.forEach(player => player.dealCards(this.deck.getRandomCards(2)));
        this.table.dealCards(this.deck.getRandomCards(5));
    }

    updateDom() {
        this.players.forEach(player => player.updateDom());
        // need to display who has button
    }

    findPlayer(role) {
        console.log(this.players);
        return this.players.find(player => player.role === role);
    }

    activePlayer() {
        return this.players.find(player => player.active);
    }

    nextPlayer() {
        const next = (this.activePlayer().id + 1) % this.players.length;
        return this.players[next];
    }
}