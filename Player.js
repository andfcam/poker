class Player {
    constructor(data) {
        this.name = data.name;
        this.role = data.role;
        this.id = data.id;
        this.chips = { 500: 2, 200: 5, 50: 6, 20: 6, 10: 8 };
        this.total = 2500;

        this.timer = null;
        this.active = false;

        this.cards = [];

        this.fetchDom();
    }

    fetchDom() {
        this.domCards = document.querySelectorAll(`#player${this.id} .card`);
        this.domName = document.querySelector(`#player${this.id} h2`);
        this.domChips = document.querySelector(`#player${this.id} p`);

        this.updateDom();
    }

    updateDom() {
        this.domName.innerText = this.name;
        this.domChips.innerText = this.chips;
    }

    bet(total) {
        // work out smallest number of current chips that make up total
        //      if no suitable amount, split

        // this.chips -= chips;
    }

    dealCards(cards) {
        this.cards = cards;
        this.cards.forEach((card, i) => {
            this.domCards[i].innerHTML = `<span class="${card.color}">${card.number} ${card.suit}</span>`;
        });
    }
}