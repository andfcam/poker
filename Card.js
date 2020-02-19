class Card {
    constructor(data) {
        this.suit = data.suit;
        this.number = data.number;
        this.value = data.value;
        this.color = '♦︎♥︎'.includes(this.suit) ? 'red' : 'black';
        this.visible = true;
    }
}