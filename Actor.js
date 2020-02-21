class Actor {
    constructor() {
        this.chips = { 50: 0, 20: 0, 5: 0, 2: 0, 1: 0 };
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

    get total() {
        return this.calculateValue(this.chips);
    }

    displayTotal() {
        this.domTotal.innerText = `$${this.total}`;
    }

    calculateValue(chips) {
        let value = 0;

        for (const type in chips) {
            value += type * chips[type];
        }
        return value;
    }

    exchangeExcessChips() {
        Object.keys(this.chips).forEach(chip => {
            if (this.chips[chip] > 15) {
                const chips = this.exchangeChip(chip);
                this.addChips(chips.toAdd);
                this.removeChips(chips.toRemove)
            }
        });
    }

    exchangeChip(chip) {
        switch (chip) {
            case '1': return { toAdd: { 5: 1 }, toRemove: { 1: 5 } };
            case '2': return { toAdd: { 5: 2 }, toRemove: { 2: 5 } };
            case '5': return { toAdd: { 20: 1 }, toRemove: { 5: 4 } };
            case '20': return { toAdd: { 50: 2 }, toRemove: { 20: 5 } };
            default: return { toAdd: {}, toRemove: {} };
        }
    }

    dealCards(cards) {
        this.cards = cards;
    }

    revealCards(number) {
        const toReveal = Math.min(this.hiddenCards.length, number);
        for (let i = 0; i < toReveal; i++) {
            this.hiddenCards[0].visible = true;
        }
    }

    get hiddenCards() {
        return this.cards.filter(card => card.visible === false);
    }

    addChips(chips) {
        Object.keys(chips).forEach(chip => {
            this.chips[chip] += chips[chip];
        });
    }

    removeChips(chips) {
        Object.keys(chips).forEach(chip => {
            this.chips[chip] -= chips[chip];
        });
    }

    removeAllChips() {
        for (let key in this.chips) {
            this.chips[key] = 0;
        }
    }

    take(total) {
        let pot = { 50: 0, 20: 0, 5: 0, 2: 0, 1: 0 };
        if (total > this.total) {
            pot = Object.assign({}, this.chips);
            this.removeAllChips();
        } else {
            pot = this.moveChips(pot, total);
        }
        return pot; // handle if allIn and pot does not equal total - condition before return to return difference /  boolean
    }

    moveChips(pot, total) {
        while (total !== 0) {
            Object.keys(this.chips).reverse().forEach(chip => {
                if (chip <= total) {
                    const available = this.chips[chip];
                    const amount = Math.min(available, Math.floor(total / chip));
                    total -= amount * chip;
                    this.chips[chip] -= amount;
                    pot[chip] += amount;
                }
            });
            if (total !== 0) this.splitChips(total);
        }
        return pot;
    }

    splitChips(amount) {
        const chip = Object.keys(this.chips).find(chip => (chip * this.chips[chip]) > amount);
        const number = Math.ceil(amount / chip);
        this.chips[chip] -= number;
        const chips = this.splitChip(chip, number);
        Object.keys(chips).forEach(chip => {
            this.chips[chip] += chips[chip];
        });
    }

    splitChip(chip, amount) {
        switch (chip) {
            case '50': return { 20: amount, 5: 5 * amount, 2: 2 * amount, 1: amount };
            case '20': return { 5: 3 * amount, 2: 2 * amount, 1: amount };
            case '5': return { 2: 2 * amount, 1: amount };
            case '2': return { 1: 2 * amount };
            default: return;
        }
    }
}