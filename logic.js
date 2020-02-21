const rankings = [
    'royalFlush',
    'straightFlush',
    'fourOfAKind',
    'fullHouse',
    'flush',
    'straight',
    'threeOfAKind',
    'twoPair',
    'pair',
    'highCard',
];

const expected = { players: [ {name: '', cards: [Card, Card] }], table: { cards: [Card, Card, Card, Card, Card] } };

data.players.forEach(player => {
    calculateHandStrength(player);
});



// want to take in all cards
// return [ Player, Player ] - list of winning players of length 1 or more