class Actor {
    constructor() {
        this.chips = { 50: 0, 20: 0, 5: 0, 2: 0, 1: 0 };
        this.total = 0;

        this.cards = [];
    }

    updateDom() {
        this.displayCards();
        this.displayChips();
        this.displayTotal();
    }

    displayCards() {
        this.cards.forEach((card, i) => {
            if (card.visible) {
                this.domCards[i].innerHTML = `<span class="${card.color}">${card.number} ${card.suit}</span>`;
            } else {
                this.domCards[i].innerHTML = `<span class="hidden"></span>`;
            }
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

    removeAllChips() {
        for (let key in this.chips) {
            this.chips[key] = 0;
        }
    }

    dealCards(cards) {
        this.cards = cards;
        this.updateDom();
    }

    flipCards(number) {
        const toFlip = Math.min(this.cards.length, number);
        for (let i = 0; i < toFlip; i++) {
            this.cards[i].visible = true;
        }
    }

    addToPot(chips) {
        Object.keys(chips).forEach(denomination => {
            this.chips[denomination] += chips[denomination];
        });
    }
}