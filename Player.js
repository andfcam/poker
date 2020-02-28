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
        this.domDealer = document.querySelector(`#player${this.id} .button`);
        this.domTimer = document.querySelector(`#player${this.id} .bar`);
        this.domButtons = document.querySelectorAll('button');
        this.domSliders = document.querySelectorAll('.raise');
        this.domCall = document.querySelector('#call');
        this.domCallAmount = document.querySelector('#call-amount');
        this.domRaiseAmount = document.querySelector('#raise-amount');
    }

    listen() {
        this.domSliders.forEach(element => {
            element.onchange = () => this.updateSliders(element.value);
        });
    }

    updateDom() {
        this.domName.innerText = this.name;

        this.role === 'dealer'
            ? this.domDealer.style.display = 'block'
            : this.domDealer.style.display = 'none';

        // if (this.folded) this.domCards[0].style.backgroundColor = 'lightgray';
        
        //this.updateRaiseAmount();

        super.updateDom();
    }

    updateTimer(percent) {
        this.domTimer.style.width = `${percent}%`;
    }

    updateSliders(value) {
        this.domSliders.forEach(element => {
            element.value = value;
        });
        this.updateRaiseAmount();
    }

    updateCallAmount(value) {
        if (value === 0) {
            this.domCall.innerText = 'Check';
            this.domCallAmount.innerText = '';
        } else {
            this.domCall.innerText = 'Call';
            this.domCallAmount.innerText = value;
        }
    }

    updateRaiseAmount() { this.domRaiseAmount.innerText = this.domSliders[0].value + this.domCallAmount.innerText; }

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