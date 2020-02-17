class Game {
    constructor() {
        this.players = [];
    
        this.start();
    }

    start() {
        const names = ["Andy", "Texas", "Lucky", "Dame"]

        for (let i = 0; i < 4; i++) {
            const player = new Player(names[i]);
            this.players.push(player);
        }

        this.deck = new Deck();
        console.log(this.players, this.deck);
    }
}