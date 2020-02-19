class Round {
    constructor(data) {
        this.players = data.players;
        this.blinds = data.blinds;

        this.highestBet = 0;

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
        if (player.computer) { 
            // random timeout to make it feel real
            this.raise(player);
            // this.endTurn(player); // ending immediately causes the game to crash (multiple players working within interval?)
        }
        player.domButtons.forEach(button => {
            button.onclick = () => {
                const func = button.innerText.toLowerCase();
                this[func](player);
                this.endTurn(player);
            }
        });

        this.startTimer(player);
    }

    startTimer(player) {
        let percent = 0;
        this.timer = setInterval(() => {
            if (percent < 100) {
                player.updateTimer(percent++);
            }
            else {
                this.fold(player);
                this.endTurn(player);
            }
        }, 30);
    }

    endTurn(player) {
        clearInterval(this.timer);
        player.active = false;
        player.updateTimer(0);
        this.startTurn(this.nextPlayer(player));
    }

    placeBet(player, amount) {
        this.table.addChips(player.take(amount));
        this.table.exchangeExcessChips();
        if (player.bet > this.highestBet) {
            this.highestBetter = player;
            this.highestBet = player.bet;
        }
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

    // want to put these on Player, but will require player to know about table - pass it? leave it?
    call(player) {
        const difference = this.highestBet - player.bet;
        this.placeBet(player, difference);
    }

    raise(player) {
        let raise = this.highestBet - player.bet;
        if (player.computer) raise += 12;
        else raise += 8; // += slider.value
        this.placeBet(player, raise);
    }

    fold(player) {
        console.log('fold');
    }

    end() {
        //after ending, back to Game for next round 
    }

    // could potentially return as line only called after final turn ends?

}