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
        players.forEach(player => {
            const cardsToCheck = this.combinedSortedCards(player);
            const hand = this.calculateHand(cardsToCheck);
            hands.push({
                player: player,
                hand: hand
            });
        });
        return this.compareHands(hands);
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

    calculateHand(cards) {
        let hand = [];
        while (cards.length > 2) {
            this.combinations.forEach(combination => {
                if (cards.length - combination.required > 2) {
                    const result = this[combination.name](cards);
                    if (result.matched !== null) {
                        cards = result.unmatched;
                        hand.push({
                            ranking: this.combinationRanking(combination),
                            cards: result.matched
                        });
                    }
                }
            });
        }
        return hand; // [ {ranking: comboRanking, cards: [Card, Card, Card]}, {ranking: comboRanking, cards: [Card, Card, Card]}, ... ]
    }

    compareHands(hands) {
        let winners = [];
        const bestHand = hands[0].hand;
        hands.forEach(player => {
            const hand = player.hand;
            for (let i = 0; i < Math.max(hand.length, bestHand.length); i++) {
                if (hand[i].ranking > bestHand[i].ranking) {
                    bestHand = hand;
                    winners = [].push(player.player);
                } else if (hand[i].ranking === bestHand[i].ranking) {
                    for (let j = 0; j < hand[i].cards.length; j++) {
                        if (hand[i].cards[j].value > bestHand[i].cards[j].value) {
                            bestHand = hand;
                            winners = [].push(player.player);
                        }
                    }
                } else {
                    return false;
                }
            }
            winners.push(player.player);
        });
        return winners;
    }

    flushFilter(cards) {
        for (const suit of ["♣︎", "♦︎", "♥︎", "♠︎"]) {
            const flushCards = cards.filter(card => card.suit === suit);
            if (flushCards.length >= 5) return flushCards;
        }
        return null;
    }

    flush(cards) {
        const flushCards = this.flushFilter(cards);
        if (!flushCards === null) {
            const orderedCards = this.orderCards(flushCards);
            return this.packageResult(orderedCards.splice(0, 5), orderedCards);
        }
        return this.packageResult(null, null);
    }

    straight(cards) {
        const uniqueCards = this.removeDuplicates(cards); // check output, might not be a set of cards, but values
        console.log(uniqueCards);
        const orderedCards = this.orderCards(uniqueCards);
        if (orderedCards.length >= 5) {
            if (orderedCards[0].number === "A") orderedCards = this.duplicateAce(orderedCards);
            for (let i = 4; i < orderedCards.length; i++) {
                if (this.cardsConsecutive(orderedCards.slice(i - 4, i + 1))) {
                    return this.packageResult(orderedCards.splice(i - 4, 5), orderedCards);
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

    // try to handle case where there's six cards in straight, lower five are flush
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

    pair(cards) { return this.ofAKind(cards, 2); }

    ofAKind(cards, number) {
        const startPosition = number - 1;
        for (let i = startPosition; i < cards.length; i++) {
            if (this.cardsEqual(cards.slice(i - startPosition, i + 1))) {
                return this.packageResult(cards.splice(i - startPosition, number), cards);
            }
        }
        return this.packageResult(null, null);
    }

    highCard(cards) {
        const orderedCards = this.orderCards(cards);
        return this.packageResult(orderedCards.splice(0, 1), orderedCards);
    }

    cardsConsecutive(cards) {
        for (let i = 0; i < 4; i++) {
            if (!cards[i].value === cards[i + 1].value + 1) return false;
        }
        return true;
    }

    cardsEqual(cards) { return cards.every(card => card.value === card[0].value); }

    orderCards(cards) { return cards.sort((a, b) => { return b.value - a.value; }); }

    removeDuplicates(cards) { return [...new Set(cards.map(card => card.value))]; }

    packageResult(matchedCards, unmatchedCards) {
        return {
            matched: matchedCards,
            unmatched: unmatchedCards
        };
    }
}

// return [ Player, Player ] - list of winning players of length 1 or more