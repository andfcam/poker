class Logic {
    constructor(players, table) {
        this.players = players;
        this.table = table;

        this.evaluate();
    }

    get combinations() {
        return [
            { name: 'straightFlush', required: 5 },
            { name: 'fourOfAKind', required: 4 },
            { name: 'fullHouse', required: 5 },
            { name: 'flush', required: 5 },
            { name: 'straight', required: 5 },
            { name: 'threeOfAKind', required: 3 },
            { name: 'twoPair', required: 4 },
            { name: 'pair', required: 2 },
            { name: 'highCard', required: 1 }
        ];
    }

    // [ {ranking: comboRanking, values: [number, number, number]}, {ranking: comboRanking, values: [number, number]}, ... ]

    evaluate() {
        players.forEach(player => {
            const cardsToCheck = combinedSortedCards(player);
            const combinations = calculateHandStrength(cards);
        });
    }

    combinedSortedCards(player) {
        const combinedCards = player.cards.concat(this.table.cards);
        return this.orderCards(combinedCards);
    }

    combinationRanking(combination) {
        const array = Object.keys(this.combinations); // might be reverse
        console.log(array);
        return array.indexOf(combination);
    }

    calculateHandStrength(cards) {
        let combinations = [];
        while (cards.length > 2) {
            combinations.forEach(combination => {
                if (cards.length - combination.required > 2) {
                    const values = this[combination.name](cards);
                    if (values !== null) {
                        combinations.push({
                            ranking: this.combinationRanking(combination),
                            values: array
                        });
                    }
                }
            });
        }
        return combinations; // [ {ranking: comboRanking, values: [number, number, number]}, {ranking: comboRanking, values: [number, number]}, ... ]
    }

    // remember to REMOVE the cards after they test true;
    straightFlush() {

    }

    fourOfAKind() {

    }

    fullHouse() {

    }

    flush() {

    }

    straight() {

    }

    threeOfAKind() {

    }

    twoPair() {

    }

    pair(cards) {
        for (let i = 1; i < cards.length; i++) {
            if (cards[i].value === cards[i - 1].value) {
                return [cards[i].value, cards[i - 1].value];
            }
        }
        return null;
    }

    highCard(cards) {
        return this.orderCards(cards)[0].value;
    }

    orderCards(cards) {
        return cards.sort((a, b) => { return b.value - a.value; });
    }
}

// for each

// while there's more than 2 cards :
//      check all combinations requirements
//      push value to array of values [12, 6, 4, 1]

// want to take in all cards
// return [ Player, Player ] - list of winning players of length 1 or more