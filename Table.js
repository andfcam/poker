class Table {
    constructor() {
        this.cards = [];
        this.chips = { 50: 0, 20: 0, 5: 0, 2: 0, 1: 0 };
        this.total = 0;

        this.fetchDom();
    }

    fetchDom() {
        this.domCards = document.querySelectorAll('#table .card');
        this.domChips = document.querySelector(`#table .chips`);
        this.domTotal = document.querySelector('#table .total');
    }

    dealCards(cards) {
        this.cards = cards;
        this.updateDom();
    }

    addToPot(chips) {
        Object.keys(chips).forEach(denomination => {
            this.chips[denomination] += chips[denomination];
        });
    }

    displayCards() {
        this.cards.forEach((card, i) => {
            this.domCards[i].innerHTML = `<span class="${card.color}">${card.number} ${card.suit}</span>`;
        });
    }

    displayChips() {
        this.domChips.innerHTML = ``;
        for (const type in this.chips) {
            let chips = ``;
            for (let i = 0; i < this.chips[type]; i++) {
                chips += `<div class="chip"></div>`;
            }
            if (this.chips[type] > 0) this.domChips.innerHTML += `<div class="stack v${type}">${chips}</div>`;
        }
    }

    displayTotal() {
        this.total = this.calculateValue(this.chips);
        this.domTotal.innerText = `$${this.total}`;
    }

    calculateValue(chips) {
        let value = 0;

        for (const type in chips) {
            value += type * chips[type];
        }
        return value;
    }

    updateDom() {
        this.displayCards();
        this.displayChips();
        this.displayTotal();
    }
}