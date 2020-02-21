const combinations = [
    { name: 'royalFlush', required: 5 },
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

const expected = players, table;

players.forEach(player => {
    const cards = combineCards(player, table);
    const combinations = calculateHandStrength(cards);
});

const combineCards = (player, table) => {
    return table.cards.concat(player.table.cards);
}

const calculateHandStrength = (cards) => {
    let combinations = [];
    while (cards.length > 2) {
        combinations.forEach(combination => {
            if (cards.length - 2 >= combination.required) {
                combinations.push(window[combination.name]());
                // combination value could be reverse of combinations list index instead of explicity stating
            }
        });
    }
    return combinations;
}



// while there's more than 2 cards :
//      check all combinations requirements
//      push value to array of values [12, 6, 4, 1]

// want to take in all cards
// return [ Player, Player ] - list of winning players of length 1 or more