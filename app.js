window.onload = () => {
    const game = new Game([ 
        { name: "Andy", computer: false }, 
        { name: "Duchess", computer: true }, 
        { name: "Texas", computer: true }, 
        { name: "Lucky", computer: true }
    ]);
}

// Visual improvements:
//      Use poker chip images instead of coloured divs
//      Re-work UI
//          Display call and raise amounts on button
//          Grey out buttons when not useable
//      Grey out players who have folded
//      Make it more obvious whose turn it is
//      Give the pot more room as to not move the cards above
//      Have stacks >10 display on new stack
//      Print winners and winning combination on chat box with pot, or print all actions (call, raise, check, fold) etc.
//      Improve aesthetics

// Technical improvements:
//      Use slider amount to increase raise value
//      Handle ability to split the pot based on amount bet (player who goes all-in can only win set amount of final pot)
//      (check straight flushes are working, hard to test)