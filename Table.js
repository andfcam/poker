class Table {
    constructor() {
        this.cards = [];

        this.fetchDom();
    }

    fetchDom() {
        this.domCards = document.querySelectorAll('#table .card');
    }

    dealCards(cards) {
        this.cards = cards;
        this.cards.forEach((card, i) => {
            this.domCards[i].innerText = `${card.number} of ${card.suit}`;
        });
    }
}