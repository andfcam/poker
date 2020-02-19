class Game {
    constructor(data) {
        this.players = [];

        this.start(data);
    }

    start(data) {
        this.createPlayers(data);
        this.newRound();
    }

    createPlayers(data) {
        for (let i = 0; i < data.length; i++) {
            const player = new Player({
                name: data[i].name,
                computer: data[i].computer,
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