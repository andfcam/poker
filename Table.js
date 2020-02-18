class Table {
    constructor() {
        this.cards = [];

        this.fetchDom();
    }

    fetchDom() {
        this.domCards = document.querySelectorAll('#table .card');
        this.domTotal = document.querySelector('#table .total');
    }

    dealCards(cards) {
        this.cards = cards;
        this.cards.forEach((card, i) => {
            this.domCards[i].innerHTML = `<span class="${card.color}">${card.number} ${card.suit}</span>`;
        });
    }
}