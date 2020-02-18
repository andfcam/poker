class Player extends Actor {
    constructor(data) {
        super();
        this.name = data.name;
        this.role = data.role;
        this.id = data.id;
        this.timer = null;
        this.active = false;
        this.chips = { 50: 2, 20: 5, 5: 6, 2: 6, 1: 8 };
        this.total = 250;

        this.fetchDom();
    }

    fetchDom() {
        this.domName = document.querySelector(`#player${this.id} .name`);
        this.domCards = document.querySelectorAll(`#player${this.id} .card`);
        this.domChips = document.querySelector(`#player${this.id} .chips`);
        this.domTotal = document.querySelector(`#player${this.id} .total`);
    }

    updateDom() {
        this.domName.innerText = this.name;
        super.updateDom();
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
}