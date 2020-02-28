class Round {
    constructor(data) {
        this.game = data.game;
        this.players = data.players;
        this.blinds = data.blinds;

        this.highestBet = 0;

        this.timer = null;
        this.stage = 'pre-flop';

        this.setup();
    }

    setup() {
        this.table = new Table();
        this.deck = new Deck();

        this.assignRoles();
        this.betBlinds();
        this.dealCards();
        this.startTurn(this.leftOfBlinds);
    }

    assignRoles() {
        const roles = this.roles;
        const dealer = this.findPlayer('dealer') || this.players[0];
        this.players.forEach((player, i) => {
            const position = (this.players.length - dealer.id + i) % this.players.length;
            player.role = roles[position];
        });
    }

    get roles() {
        const players = this.players.length;
        const roles = [];
        if (players >= 1) roles.push('dealer')
        if (players >= 2) roles.push('smallBlind');
        if (players >= 3) roles.push('bigBlind');
        if (players >= 4) {
            for (let i = 4; i <= players; i++) {
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

    nextStage() {
        // does Stage needs its own class?
        // instead of setting stage explicitly, take nextIndex of stages array?
        switch (this.stage) {
            case 'river':
                this.stage = 'showdown';
                this.splitPot();
                this.endRound();
                return;
            case 'turn':
                this.stage = 'river';
                this.table.revealCards(1);
                break;
            case 'flop':
                this.stage = 'turn';
                this.table.revealCards(1);
                break;
            case 'pre-flop':
                this.stage = 'flop';
                this.table.revealCards(3);
                break;
        }
        this.highestBetter = this.leftOfDealer;

        this.startTurn(this.leftOfDealer);
    }

    splitPot() {
        const winners = new Logic(this.eligiblePlayers, this.table);
        const split = Math.floor(this.table.total / winners.length);
        winners.forEach(winner => {
            winner.addChips(this.table.take(split));
            winner.exchangeExcessChips();
            winner.revealCards(2);
        });
        this.updateDom();
    }

    startTurn(player) {
        this.updateDom();
        player.active = true;
        if (player.computer) {
            this.makeDecision(player);
        } else {
            player.domButtons.forEach(button => { // needs modification for client/server? - all players share listener
                button.onclick = () => {
                    if (player.active) {
                        const func = button.innerText.toLowerCase();
                        this[func](player);
                        this.endTurn(player);
                    }
                }
            });
        }
        this.startTimer(player);
    }

    makeDecision(player) {
        const delay = 1000 * ((Math.random() * 2) + 1); 
        setTimeout(() => {
            this.call(player);
            this.endTurn(player);
        }, delay);
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
        }, 100); // in ms/100 - 10x desired value in s
    }

    endTurn(player) {
        clearInterval(this.timer);
        player.active = false;
        player.updateTimer(0);
        const nextPlayer = this.nextPlayer(player); // going to be a problem when someone is all-in?
        if (nextPlayer === this.highestBetter) {
            this.nextStage();
        } else {
            if (player === this.highestBetter && player.folded) this.highestBetter = nextPlayer;
            this.startTurn(nextPlayer);
        }
    }

    placeBet(player, amount) {
        this.table.addChips(player.take(amount));
        this.table.exchangeExcessChips();
        if (player.bet > this.highestBet) {
            this.highestBetter = player;
            this.highestBet = player.bet;
        }
    }

    updateDom() {
        this.players.forEach(player => {
            player.updateCallAmount(this.highestBet - player.bet);
            player.updateDom();
        });
        this.table.updateDom();
    }

    get eligiblePlayers() {
        return this.players.filter(player => !player.folded);
    }

    findPlayer(role) {
        // if doesn't exist, need to send back the 'back-up' or rework the roles
        return this.players.find(player => player.role === role);
    }

    nextPlayer(player) {
        let nextId = this.getNextId(player);
        while (this.players[nextId].folded) {
            nextId = this.getNextId(this.players[nextId]);
        }
        return this.players[nextId];
    }

    get leftOfDealer() {
        const dealer = this.findPlayer('dealer');
        return this.nextPlayer(dealer);
    }

    get leftOfBlinds() {
        const bigBlinder = this.findPlayer('bigBlind');
        return this.nextPlayer(bigBlinder);
    }

    getNextId(player) {
        return player.id % this.players.length;
    }

    check(player) {
        this.call(player);
    }

    // want to put these on Player, but will require player to know about table - pass it? leave it?
    call(player) {
        const difference = this.highestBet - player.bet;
        this.placeBet(player, difference);
    }

    raise(player) {
        let raise = this.highestBet - player.bet;
        raise += 10; // += slider.value
        this.placeBet(player, raise);
    }

    fold(player) {
        player.folded = true; 
    }

    endRound() {
        // could pass the table remainder to newRound
        for (const player of this.players) {
            player.folded = false;
        }
        this.game.newRound(); // set timeout
    }
}