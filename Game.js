class Game {
    constructor(names) {
        this.players = [];
        this.names = names;

        this.start();
    }

    start() {
        this.createPlayers();
        this.newRound();
    }

    createPlayers() {
        for (let i = 0; i < this.names.length; i++) {
            const player = new Player({
                name: this.names[i],
                id: i + 1
            });
            this.players.push(player);
        }
    }

    newRound() {
        const round = new Round({
            players: this.solventPlayers(),
            blinds: this.currentBlinds()
        });
    }

    solventPlayers() {
        return this.players.filter(player => player.total > 0);
    }

    currentBlinds() {
        // can change blind values later
        return { small: 1, big: 2 };
    }
}