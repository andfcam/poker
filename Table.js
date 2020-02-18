class Table extends Actor {
    constructor() {
        super();

        this.fetchDom();
    }

    fetchDom() {
        this.domCards = document.querySelectorAll('#table .card');
        this.domChips = document.querySelector(`#table .chips`);
        this.domTotal = document.querySelector('#table .total');
    }
}