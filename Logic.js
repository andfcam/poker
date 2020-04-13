class Logic {
    constructor(players, table) {
        this.players = players;
        this.table = table;

        // keep track of current cards, player to evaluate, remove passing?

        this.winners = this.evaluate();
        return this.winners;
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
                info: player,
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

        for (const player of players) {
            for (let i = 0; i < player.hand.length; i++) {
                const better = this.handIsBetter(player.hand[i], bestHand[i]);
                if (better === undefined) {
                    if (i === player.hand.length - 1) {
                        winners.push(player.info);
                        break;
                    } else {
                        continue;
                    }
                } if (better) {
                    bestHand = player.hand;
                    winners = [player.info];
                    break;
                } else {
                    break;
                }
            }
        }
        return winners;
    }

    handIsBetter(hand, bestHand) {
        if (hand.ranking > bestHand.ranking) return true;
        else if (hand.ranking < bestHand.ranking) return false;
        else {
            for (let i = 0; i < hand.cards.length; i++) {
                if (hand.cards[i].value > bestHand.cards[i].value) return true;
                else if (hand.cards[i].value < bestHand.cards[i].value) return false;
            }
        }
    }

    flushFilter(cards) {
        for (const suit of ["♣︎", "♦︎", "♥︎", "♠︎"]) {
            const flushCards = cards.filter(card => card.suit === suit);
            const otherCards = cards.filter(card => flushCards.indexOf(card) === -1);
            if (flushCards.length >= 5) return this.packageResult(flushCards, otherCards);
        }
        return this.packageResult(null, cards);
    }

    flush(cards) {
        const flushCards = this.flushFilter(cards);
        if (flushCards.matched !== null) {
            const orderedCards = this.orderCards(flushCards.matched);
            const flush = orderedCards.splice(0, 5);
            const otherSuits = orderedCards.concat(flushCards.unmatched);
            return this.packageResult(flush, otherSuits);
        }
        return this.packageResult(null, cards);
    }

    straight(cards) {
        const uniqueCards = this.removeDuplicates(cards);
        const orderedCards = this.orderCards(uniqueCards);
        if (orderedCards.length >= 5) {
            const duplicateAceCards = this.duplicateAce(uniqueCards);
            for (let i = 4; i < duplicateAceCards.length; i++) {
                if (this.cardsConsecutive(duplicateAceCards.slice(i - 4, i + 1))) {
                    const straight = duplicateAceCards.splice(i - 4, 5);
                    return this.packageResult(straight, []);
                }
            }
        }
        return this.packageResult(null, cards);
    }

    duplicateAce(cards) {
        const aceIndex = cards.findIndex(card => card.number === "A");
        const ace = cards.slice(aceIndex, aceIndex + 1);
        return cards.concat(ace);
    }

    straightFlush(cards) { return this.chain('flushFilter', 'straight', cards); }

    fullHouse(cards) { return this.chain('threeOfAKind', 'pair', cards); }

    twoPair(cards) { return this.chain('pair', 'pair', cards); }

    chain(func1, func2, cards) {
        let tempCards = [...cards];
        const firstCards = this[func1](tempCards);
        if (firstCards.matched !== null) {
            tempCards = firstCards.unmatched;
            const secondCards = this[func2](tempCards);
            if (secondCards.matched !== null) {
                tempCards = secondCards.unmatched;
                const combinedCards = firstCards.matched.concat(secondCards.matched);
                return this.packageResult(combinedCards, tempCards);
            }
        }
        return this.packageResult(null, cards);
    }

    fourOfAKind(cards) { return this.ofAKind(cards, 4); }

    threeOfAKind(cards) { return this.ofAKind(cards, 3); }

    pair(cards) { return this.ofAKind(cards, 2); }

    ofAKind(cards, number) { 
        const startPosition = number - 1;
        for (let i = startPosition; i < cards.length; i++) {
            if (this.cardsEqual(cards.slice(i - startPosition, i + 1))) {
                const matchingCards = cards.splice(i - startPosition, number);
                return this.packageResult(matchingCards, cards);
            }
        }
        return this.packageResult(null, cards);
    }

    highCard(cards) {
        const orderedCards = this.orderCards(cards);
        const highCard = orderedCards.splice(0, 1);
        return this.packageResult(highCard, orderedCards);
    }

    cardsConsecutive(cards) {
        for (let i = 0; i < 4; i++) {
            if (cards[i].value !== cards[i + 1].value % 13 + 1) return false;
        }
        return true;
    }

    cardsEqual(cards) { return cards.every(card => card.number === cards[0].number); }

    orderCards(cards) { return cards.sort((a, b) => { return b.value - a.value; }); }

    removeDuplicates(cards) {
        return cards.filter((card, index, self) => self.findIndex(item => item.number === card.number) === index);
    }

    packageResult(matchedCards, unmatchedCards) {
        return {
            matched: matchedCards,
            unmatched: unmatchedCards
        };
    }
}
