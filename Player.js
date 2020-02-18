class Player {
    constructor(data) {
        this.name = data.name;
        this.role = data.role;
        this.id = data.id;
        this.chips = { 500: 2, 200: 5, 50: 6, 20: 6, 10: 8 };
        this.total = 0;

        this.timer = null;
        this.active = false;

        this.cards = [];

        this.fetchDom();
    }

    fetchDom() {
        this.domName = document.querySelector(`#player${this.id} .name`);
        this.domCards = document.querySelectorAll(`#player${this.id} .card`);
        this.domChips = document.querySelector(`#player${this.id} .chips`);
        this.domTotal = document.querySelector(`#player${this.id} .total`);

        this.updateDom();
    }

    updateDom() {
        this.domName.innerText = this.name;
        this.cards.forEach((card, i) => {
            this.domCards[i].innerHTML = `<span class="${card.color}">${card.number} ${card.suit}</span>`;
        });

        this.drawChips();
        this.drawTotal();
    }

    drawChips() {
        this.domChips.innerHTML = ``;
        for (const type in this.chips) {
            let chips = ``;
            for (let i = 0; i < this.chips[type]; i++) {
                chips += `<div class="chip"></div>`;
            }
            this.domChips.innerHTML += `<div class="stack v${type}">${chips}</div>`;
        }
    }

    drawTotal() {
        this.total = this.calculateTotal();
        this.domTotal.innerText = `$${this.total}`;
    }

    calculateTotal() {
        let value = 0;

        for (const type in this.chips) {
            value += type * this.chips[type];
        }
        return value;
    }

    bet(total) {
        // work out smallest number of current chips that make up total
        //      if no suitable amount, split

        // this.chips -= chips;
    }

    dealCards(cards) {
        this.cards = cards;
        this.updateDom();
    }
}