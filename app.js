window.onload = () => {
    const game = new Game(["Andy", "Duchess", "Texas", "Lucky"]);
}

// Blinds:
//      Visual representation of button 

// Turn:
//      Fold, Call, Raise
//      Raise slider (with recommended amounts clickable to set slider)
//      Difference to call or proposed raise displayed below button (see google images)

// Keep track of last raise (dealer as default)
//      Turn switches until all players (inc. big blind) have folded or called

// Player has turn function that starts timer, allows actions etc.
//      Comp and Player share same class and functions, just prompt.
//      Player has 15 second timer, comp make decision in random time of 2 - 5s.

// Split-pot can use bet() function to take the allotted amount.



// GAME ENGINE
// Make it so any client interaction with server has 1 request and 1 return ie. compareHands();
// Able to separate client and game engine later to host server to make multiplayer



// README
// Point out in readme, all mathematics done with chips not numbers. Bets with least number of chips, splits into most efficient groups.