class Player extends Actor {
    constructor(data) {
        super();
        this.name = data.name;
        this.computer = data.computer;
        this.id = data.id;
        this.role = '';

        this.active = false;
        this.folded = false;
        this.bet = 0;

        this.chips = { 50: 2, 20: 5, 5: 6, 2: 6, 1: 8 };

        this.fetchDom();
        this.listen();
    }

    fetchDom() {
        this.domName = document.querySelector(`#player${this.id} .name`);
        this.domCards = document.querySelectorAll(`#player${this.id} .card`);
        this.domChips = document.querySelector(`#player${this.id} .chips`);
        this.domTotal = document.querySelector(`#player${this.id} .total`);
        this.domTimer = document.querySelector(`#player${this.id} .bar`);
        this.domButtons = document.querySelectorAll('button');
        this.domSliders = document.querySelectorAll('.raise');
    }

    listen() {
        this.domSliders.forEach(element => {
            element.onchange = () => this.updateSliders(element.value);
        });
    }

    updateDom() {
        this.domName.innerText = this.name;
        super.updateDom();
    }

    updateTimer(percent) {
        this.domTimer.style.width = `${percent}%`;
    }

    updateSliders(value) {
        this.domSliders.forEach(element => {
            element.value = value;
        });
    }

    dealCards(cards) {
        super.dealCards(cards);
        if (!this.computer) this.revealCards(2);
    }

    take(total) {
        const pot = super.take(total)
        this.bet += this.calculateValue(pot);
        return pot;
    }
}