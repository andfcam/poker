window.onload = () => {
    const game = new Game([ 
        { name: "Andy", computer: false }, 
        { name: "Duchess", computer: true }, 
        { name: "Texas", computer: true }, 
        { name: "Lucky", computer: true }
    ]);
}

// Blinds:
//      Visual representation of button 

// Raise:
//      Take amount from slider when active

// Split-pot can use bet() function to take the allotted amount.



// GAME ENGINE
// Make it so any client interaction with server has 1 request and 1 return ie. compareHands();
// Able to separate client and game engine later to host server to make multiplayer



// README
// Point out in readme, all mathematics done with chips not numbers. Bets with least number of chips, splits into most efficient groups.