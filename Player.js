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

    bet(total) {
        let pot = {};
        if (total > this.total) {
            pot = Object.assign({}, this.chips);
            this.removeAllChips();
        } else {
            pot = this.useAvailableChips(total);
        }
        this.updateDom();
        return pot; // handle if allIn and pot does not equal total - condition before return to return difference /  boolean
    }

    removeAllChips() {
        for (let key in this.chips) {
            this.chips[key] = 0;
        }
    }

    useAvailableChips(total) {
        const pot = {};
        while (total !== 0) {
            Object.keys(this.chips).reverse().forEach(denomination => {
                if (denomination <= total) {
                    const available = this.chips[denomination];
                    const number = Math.min(available, Math.floor(total / denomination));
                    this.chips[denomination] -= number;
                    pot[denomination] ? pot[denomination] += number : pot[denomination] = number;
                    total -= number * denomination;
                }
            });
            console.log(pot);
            if (total !== 0) this.splitChips(total);
        }
        return pot;        
    }

    splitChip(denomination, number) {
        switch (denomination) {
            case '50': return { 20: number, 5: 5 * number, 2: 2 * number, 1: number };
            case '20': return { 5: 3 * number, 2: 2 * number, 1: number };
            case '5': return { 2: 2 * number, 1: number };
            case '2': return { 1: 2 * number };
            default: return;
        }
    }

    splitChips(remainder) {
        Object.keys(this.chips).forEach(denomination => {
            if (denomination * this.chips[denomination] > remainder) {
                const number = Math.ceil(remainder / denomination);
                this.chips[denomination] -= number;
                const chips = this.splitChip(denomination, number);
                Object.keys(chips).forEach(denomination => {
                    this.chips[denomination] += chips[denomination];
                });
            }
        });
    }

    dealCards(cards) {
        this.cards = cards;
        this.updateDom();
    }
}