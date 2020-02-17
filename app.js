window.onload = () => {
    const game = new Game();
}

// Blinds:
//      Visual representation of button 
//      Player to left plays small blind
//      Player to THEIR left plays big blind

// Turn:
//      Fold, Call, Raise
//      Raise slider (with recommended amounts clickable to set slider)
//      Difference to call or proposed raise displayed below button (see google images)

// Keep track of last raise (dealer as default)
//      Turn switches until all players (inc. big blind) have folded or called

// Player has turn function that starts timer, allows actions etc.
//      Comp and Player share same class and functions, just prompt.
//      Player has 15 second timer, comp make decision in random time of 2 - 5s.