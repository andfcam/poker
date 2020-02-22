class Logic {
    constructor(players, table) {
        this.players = players;
        this.table = table;

        // keep track of current cards, player to evaluate, remove passing?

        return this.evaluate();
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

    evaluate() {
        let hands = [];
        for (const player of this.players) {
            const cardsToCheck = this.combinedSortedCards(player);
            const hand = this.calculateHand(cardsToCheck);
            hands.push({
                player: player,
                hand: hand
            });
        }
        return this.compareHands(hands);
    }

    combinedSortedCards(player) {
        const combinedCards = player.cards.concat(this.table.cards);
        return this.orderCards(combinedCards);
    }

    combinationRanking(combination) {
        const reverseCombinations = this.combinations.reverse();
        return reverseCombinations.findIndex(item => item.name === combination.name);
    }

    calculateHand(cards) {
        let hand = [];
        while (cards.length > 2) {
            for (const combination of this.combinations) {
                if (cards.length - combination.required >= 2) {
                    const result = this[combination.name](cards);
                    console.log(result.matched, result.unmatched);
                    if (result.matched !== null) {
                        cards = result.unmatched;
                        hand.push({
                            ranking: this.combinationRanking(combination),
                            cards: result.matched
                        });
                    }
                }
            }
        }
        console.log(hand);
        return hand; // [ {ranking: comboRanking, cards: [Card, Card, Card]}, {ranking: comboRanking, cards: [Card, Card, Card]}, ... ]
    }

    compareHands(players) {
        let winners = [];
        let bestHand = players[0].hand;

        players.forEach(player => {
            if (this.handIsBetter(player, bestHand)) {
                bestHand = player.hand;
                winners = [].push(player.player);
            } else if (this.handIsBetter(player, bestHand) === 'equal') {
                winners.push(player.player);
            }
        });
        return winners;
    }

    handIsBetter(player, bestHand) {
        for (let h = 0; h < player.hand.length; h++) {
            if (player.hand[h].ranking > bestHand[h].ranking) {
                return true;
            } else if (player.hand[h].ranking < bestHand[h].ranking) {
                return false;
            } else {
                for (let c = 0; c < player.hand[h].cards.length; c++) {
                    if (player.hand[h].cards[c].value > bestHand[h].cards[c].value) {
                        return true;
                    } else if (player.hand[h].cards[c].value < bestHand[h].cards[c].value) {
                        return false;
                    }
                }
            }
        }
        return 'equal';
    }

    flushFilter(cards) {
        for (const suit of ["♣︎", "♦︎", "♥︎", "♠︎"]) {
            const flushCards = cards.filter(card => card.suit === suit);
            const otherCards = cards.filter(card => flushCards.indexOf(card) === -1);
            if (flushCards.length >= 5) return this.packageResult(flushCards, otherCards);
        }
        return this.packageResult(null, null);
    }

    flush(cards) {
        const flushCards = this.flushFilter(cards);
        if (!flushCards.matched === null) {
            const orderedCards = this.orderCards(flushCards.matched);
            const flush = orderedCards.splice(0, 5);
            const otherSuits = orderedCards.concat(flushCards.unmatched);
            return this.packageResult(flush, otherSuits);
        }
        return this.packageResult(null, null);
    }

    straight(cards) {
        const uniqueCards = this.removeDuplicates(cards); // check output, might not be a set of cards, but values
        const orderedCards = this.orderCards(uniqueCards);
        if (orderedCards.length >= 5) {
            if (orderedCards[0].number === "A") orderedCards = this.duplicateAce(orderedCards);
            for (let i = 4; i < orderedCards.length; i++) {
                if (this.cardsConsecutive(orderedCards.slice(i - 4, i + 1))) {
                    const straight = orderedCards.splice(i - 4, 5);
                    return this.packageResult(straight, orderedCards);
                }
            }
        }
        return this.packageResult(null, null);
    }

    duplicateAce(orderedCards) {
        const duplicateAce = orderedCards[0];
        duplicateAce.value = 0;
        orderedCards.push(duplicateAce);
    }

    straightFlush(cards) { return this.chain('flushFilter', 'straight', cards); }

    fullHouse(cards) { return this.chain('threeOfAKind', 'pair', cards); }

    twoPair(cards) { return this.chain('pair', 'pair', cards); }

    chain(func1, func2, cards) {
        const firstCards = this[func1](cards);
        if (firstCards.matched !== null) {
            cards = firstCards.unmatched;
            const secondCards = this[func2](cards);
            if (secondCards.matched !== null) {
                cards = secondCards.unmatched;
                const combinedCards = firstCards.matched.concat(secondCards.matched);
                return this.packageResult(combinedCards, cards);
            }
        }
        return this.packageResult(null, null);
    }

    fourOfAKind(cards) { return this.ofAKind(cards, 4); }

    threeOfAKind(cards) { return this.ofAKind(cards, 3); }

    pair(cards) { 
        const pair = this.ofAKind(cards, 2); 
        console.log(pair);
        return pair;
    }

    ofAKind(cards, number) {
        const startPosition = number - 1; 
        for (let i = startPosition; i < cards.length; i++) {
            if (this.cardsEqual(cards.slice(i - startPosition, i + 1))) {
                const matchingCards = cards.splice(i - startPosition, number);
                console.log(matchingCards, cards);
                return this.packageResult(matchingCards, cards);
            }
        }
        console.log('Am I here?');
        return this.packageResult(null, null);
    }

    highCard(cards) {
        const orderedCards = this.orderCards(cards);
        const highCard = orderedCards.splice(0, 1);
        return this.packageResult(highCard, orderedCards);
    }

    cardsConsecutive(cards) {
        for (let i = 0; i < 4; i++) {
            if (!cards[i].value === cards[i + 1].value + 1) return false;
        }
        return true;
    }

    cardsEqual(cards) { return cards.every(card => card.value === cards[0].value); }

    orderCards(cards) { return cards.sort((a, b) => { return b.value - a.value; }); }

    removeDuplicates(cards) { 
        return cards.filter((card, index) => {
            cards.findIndex(item => item.value === card.value) === index;
        });
    }

    packageResult(matchedCards, unmatchedCards) {
        return {
            matched: matchedCards,
            unmatched: unmatchedCards
        };
    }
}

// return [ Player, Player ] - list of winning players of length 1 or more