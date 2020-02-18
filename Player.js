class Player {
    constructor(data) {
        this.name = data.name;
        this.role = data.role;
        this.id = data.id;
        this.chips = { 50: 2, 20: 5, 5: 6, 2: 6, 1: 8 };
        this.total = 250;

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
        this.displayCards();
        this.displayChips();
        this.displayTotal();
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
            this.domChips.innerHTML += `<div class="stack v${type}">${chips}</div>`;
        }
    }

    displayTotal() {
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
        let pot = {};
        if (total > this.total) {
            pot = Object.assign({}, this.chips);
            this.removeAllChips();
        } else {
            pot = this.splitChips(total);
        }
        this.updateDom();
        return pot; // handle if allIn and pot does not equal total - condition before return to return difference /  boolean

        // while total !== 0
        //      if chip found
        //          push chip to pot
        //          remove from player
        //      if none
        //          take smallest available chip
        //          split into next smallest chip
        //          try again
        //      subtract from total
    }

    removeAllChips() {
        for (let key in this.chips) {
            this.chips[key] = 0;
        }
    }

    splitChips(total) {
        const types = Object.keys(this.chips).reverse();
        const pot = {};
        while (total !== 0) {
            types.forEach(denomination => {
                if (denomination <= total) {
                    const available = this.chips[denomination];
                    const number = Math.min(available, Math.floor(total / denomination));
                    this.chips[denomination] -= number;
                    pot[denomination] ? pot[denomination] += number : pot[denomination] = number;
                    total -= number * denomination;
                }
            });
        }
        return pot;
    }

    dealCards(cards) {
        this.cards = cards;
        this.updateDom();
    }
}