class Game {
    constructor(data) {
        this.players = [];
        this.currentRound = null;

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
        if (this.currentRound) {
            console.log('Testing new round.');
        }
        this.currentRound = new Round({
            game: this,
            players: this.solventPlayers,
            blinds: this.blinds
        });
    }

    get solventPlayers() {
        return this.players.filter(player => player.total > 0);
    }

    get blinds() {
        // can change blind values later
        return { small: 1, big: 2 };
    }
}