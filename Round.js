class Round {
    constructor(data) {
        this.players = data.players;
        this.blinds = data.blinds;

        this.timer = null;

        this.setup();
    }

    setup() {
        this.table = new Table();
        this.deck = new Deck();

        this.assignRoles();
        this.betBlinds();
        this.dealCards();
        this.startTurn(this.findPlayer('starter'));
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
        const players = this.players.length;
        const roles = [];
        if (players >= 1) roles.push('dealer')
        if (players >= 2) roles.push('smallBlind');
        if (players >= 3) roles.push('bigBlind');
        if (players >= 4) roles.push('starter');
        if (players >= 5) {
            for (let i = 5; i <= players; i++) {
                roles.push('');
            }
        }
        return roles;
    }

    betBlinds() {
        for (const key in this.blinds) {
            const player = this.findPlayer(`${key}Blind`);
            this.placeBet(player, this.blinds[key]);
        }
    }

    dealCards() {
        this.players.forEach(player => player.dealCards(this.deck.getRandomCards(2)));
        this.table.dealCards(this.deck.getRandomCards(5));
    }

    startTurn(player) {
        player.active = true;
        // listen to events

        let percent = 0;
        this.timer = setInterval(() => {
            if (percent < 100) {
                player.updateTimer(percent++);
            }
            else {
                // player.fold();
                this.endTurn(player);
            }
        }, 10); // change to 150
    }

    endTurn(player) {
        this.placeBet(player, 19);
        clearInterval(this.timer);
        player.active = false;
        player.updateTimer(0);
        this.startTurn(this.nextPlayer(player));
    }

    placeBet(player, amount) {
        this.table.addChips(player.take(amount));
        this.table.exchangeExcessChips();
        this.updateDom();
    }

    updateDom() {
        this.players.forEach(player => player.updateDom());
        this.table.updateDom();
        // need to display who has button
    }

    findPlayer(role) {
        // if doesn't exist, need to send back the 'back-up' or rework the roles
        return this.players.find(player => player.role === role);
    }

    nextPlayer(player) {
        const nextId = player.id % this.players.length; // player.id is naturally one more than this.players[index]
        return this.players[nextId];
    }
}