class Player {
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.chips = 1000;
        this.button = false;

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

    dealCards(cards) {
        this.cards = cards;
        this.cards.forEach((card, i) => {
            this.domCards[i].innerText = `${card.number} of ${card.suit}`;
        });
    }
}