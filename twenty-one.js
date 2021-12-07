const readline = require("readline-sync");
const BLACKJACK = 21;
let playAgain;

do {
  let deck = initializeDeckOfCards();
  shuffle(deck);

  let playersHand = initializeHand(deck);
  let dealersHand = initializeHand(deck);
  let showDealersHand = false;
  let playersChoice;

  do {

    displayCardTable(playersHand, dealersHand, showDealersHand);
    if (isBlackjack(playersHand)) break;

    playersChoice = setPlayersChoice();

    if (playersChoice === "h") {
      playersHand.push(dealCardFrom(deck));
    }

  } while (playersChoice === "h" &&
    !isBustingHand(playersHand) &&
    !isBlackjack(playersHand));

  showDealersHand = true;

  displayCardTable(playersHand, dealersHand, showDealersHand);

  let dealersTotal = calculateHandTotal(dealersHand);

  while (dealersTotal < 17) {
    if (isBustingHand(playersHand)) break;

    dealersHand.push(dealCardFrom(deck));
    dealersTotal = calculateHandTotal(dealersHand);
  }

  displayWinner(playersHand, dealersHand, showDealersHand);

  playAgain = setPlayAgain();
} while (playAgain === "y");


//==============================================================================
function initializeDeckOfCards() {
  // All 52 cards in a nested array, each sub array holds 2 elements.
  return [
    ["Ace", "Hearts"], ["2", "Hearts"], ["3", "Hearts"],
    ["4", "Hearts"], ["5", "Hearts"], ["6", "Hearts"],
    ["7", "Hearts"], ["8", "Hearts"], ["9", "Hearts"],
    ["10", "Hearts"], ["Jack", "Hearts"], ["Queen", "Hearts"],
    ["King", "Hearts"],

    ["Ace", "Diamonds"], ["2", "Diamonds"], ["3", "Diamonds"],
    ["4", "Diamonds"], ["5", "Diamonds"], ["6", "Diamonds"],
    ["7", "Diamonds"], ["8", "Diamonds"], ["9", "Diamonds"],
    ["10", "Diamonds"], ["Jack", "Diamonds"], ["Queen", "Diamonds"],
    ["King", "Diamonds"],

    ["Ace", "Clubs"], ["2", "Clubs"], ["3", "Clubs"],
    ["4", "Clubs"], ["5", "Clubs"], ["6", "Clubs"],
    ["7", "Clubs"], ["8", "Clubs"], ["9", "Clubs"],
    ["10", "Clubs"], ["Jack", "Clubs"], ["Queen", "Clubs"],
    ["King", "Clubs"],

    ["Ace", "Spades"], ["2", "Spades"], ["3", "Spades"],
    ["4", "Spades"], ["5", "Spades"], ["6", "Spades"],
    ["7", "Spades"], ["8", "Spades"], ["9", "Spades"],
    ["10", "Spades"], ["Jack", "Spades"], ["Queen", "Spades"],
    ["King", "Spades"]
  ];
}

function shuffle(deck) {
  for (let index = deck.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1));

    [deck[index], deck[otherIndex]] = [deck[otherIndex], deck[index]];
  }
}

function initializeHand(deck) {
  /* When a new round starts this function deals 2 cards to the player and
  dealer. It uses the helper function dealCardFrom() which takes the top card
  from the deck. This function returns a nested array of 2 cards
  ex. [ [ '8', 'Hearts' ], [ 'Jack', 'Diamonds' ] ]
  */
  const TWO_CARDS = 2;
  let hand = [];

  for (let cardsDealt = 1; cardsDealt <= TWO_CARDS; cardsDealt++) {
    hand.push(dealCardFrom(deck));
  }
  return hand;
}

function displayCardTable(playersCards, dealersCards, showHand) {
  console.clear();
  let playersTotal = calculateHandTotal(playersCards);
  let dealersTotal = calculateHandTotal(dealersCards);

  console.log("___________________________");
  console.log("_______Dealers Cards_______\n");
  // uncomment to see dealers cards before they are revealed
  //console.log(dealersCards);
  if (showHand) {
    displayCards(dealersCards);
    console.log(`\nDealer has: ${dealersTotal}`);
  } else {
    displayDealersCardsHidden(dealersCards);
  }
  console.log("___________________________");

  console.log("\n\n\n\n___________________________");
  console.log("_______Players Cards_______\n");
  // console.log(playersCards);
  displayCards(playersCards);
  console.log(`\nYou have: ${playersTotal}`);
  console.log("___________________________");
}

function isBlackjack(cards) {
  return calculateHandTotal(cards) === BLACKJACK && cards.length === 2;
}

function setPlayersChoice() {
  let choice = readline.question("Hit or stay (h/s)? ");

  while (choice === "" || !["h", "s"].includes(choice[0].toLowerCase())) {
    choice = readline.question("Hit or stay (h/s)? ");
  }
  return choice[0].toLowerCase();
}

function dealCardFrom(deck) {
  return deck.splice(0, 1)[0];
}

function isBustingHand(cards) {
  let total = calculateHandTotal(cards);
  return total > BLACKJACK;
}

function displayWinner(playersHand, dealersHand, showDealersHand) {
  let dealersTotal = calculateHandTotal(dealersHand);
  let playersTotal = calculateHandTotal(playersHand);

  displayCardTable(playersHand, dealersHand, showDealersHand);

  if (isBlackjack(playersHand) && isBlackjack(dealersHand)) {
    console.log("Push, no winner");
  } else if (isBlackjack(playersHand)) {
    console.log("BACKJACK, YOU WIN!");
  } else if (dealersTotal === playersTotal) {
    console.log("Push, it's a tie");
  }  else if (isBustingHand(dealersHand) && playersTotal <= BLACKJACK) {
    console.log("Dealer busts, you win!");
  } else if (isBustingHand(playersHand) && dealersTotal <= BLACKJACK) {
    console.log("You busted, sorry not a winner");
  } else if (isBustingHand(playersHand) && isBustingHand(dealersHand)) {
    console.log("Sorry dealer wins even if we both bust");
  } else if (dealersTotal > playersTotal) {
    console.log("Sorry, not a winner");
  } else if (playersTotal > dealersTotal) {
    console.log("You win!");
  }
}

function displayDealersCardsHidden(dealersCards) {
  let isDealerCardHidden = true;

  printDashLine(dealersCards);
  printCardLine1(dealersCards, isDealerCardHidden);
  printBlankCardLine(dealersCards);
  printCardLine2(dealersCards, isDealerCardHidden);
  printBlankCardLine(dealersCards);
  printCardLine3(dealersCards, isDealerCardHidden);
  printDashLine(dealersCards);
}

function setPlayAgain() {
  let choice = readline.question("Play another hand (y/n)?");

  while (choice === "" || !["y", "n"].includes(choice[0].toLowerCase())) {
    choice = readline.question("Play another hand (y/n)?");
  }
  return choice[0].toLowerCase();
}

function calculateHandTotal(cards) {
  /* This function returns a single number */
  let cardValues = cards.map(card => card[0]);

  let total = 0;

  cardValues.forEach((value) => {
    if (value === "Ace") {
      total += 11;
    } else if (["Jack", "Queen", "King"].includes(value)) {
      total += 10;
    } else {
      total += Number(value);
    }
  });

  cardValues.filter(value => value === "Ace").forEach((_) => {
    if (total > 21) total -= 10;
  });
  return total;
}

function displayCards(cards) {
  let isDealerCardHidden  = false;

  printDashLine(cards);
  printCardLine1(cards, isDealerCardHidden);
  printBlankCardLine(cards);
  printCardLine2(cards, isDealerCardHidden);
  printBlankCardLine(cards);
  printCardLine3(cards, isDealerCardHidden);
  printDashLine(cards);
}

/* =============================================================================
  The functions below are for formating the cards to print to the terminal in
  the correct way. They don't effect the the main logic of the game.
*/
function printDashLine(cards) {
  let line = "---------";

  cards.forEach((_) => {
    process.stdout.write(line.padEnd(12, " "));
  });
  console.log("");
}

function printCardLine1(cards, isDealerCardHidden) {
  let cardCount = cards.length;

  if (isDealerCardHidden) {
    cardCount = 1;
    for (let i = 0; i < cardCount; i++) {
      let line1 = `|${cards[i][0].padEnd(7, " ")}|`;

      process.stdout.write(line1.padEnd(12, " "));
      process.stdout.write("|       |");
    }
    console.log("");

  } else {
    for (let i = 0; i < cardCount; i++) {
      let line1 = `|${cards[i][0].padEnd(7, " ")}|`;

      process.stdout.write(line1.padEnd(12, " "));
    }
    console.log("");
  }
}

function printBlankCardLine(cards) {
  let cardCount = cards.length;
  let blankLine = "|       |";

  for (let i = 0; i < cardCount; i++) {
    process.stdout.write(blankLine.padEnd(12, " "));
  }
  console.log("");
}

function printCardLine2(cards, isDealerCardHidden) {
  let cardCount = cards.length;

  if (isDealerCardHidden) {
    cardCount = 1;

    for (let i = 0; i < cardCount; i++) {
      let symbol = setSuitSymbol(cards[i]);
      let line2 = `|${symbol.padStart(4, " ")}   |`;
      process.stdout.write(line2.padEnd(12, " "));
      process.stdout.write("|       |");
    }
    console.log("");

  } else {
    for (let i = 0; i < cardCount; i++) {
      let symbol = setSuitSymbol(cards[i]);
      let line2 = `|${symbol.padStart(4, " ")}   |`;
      process.stdout.write(line2.padEnd(12, " "));
    }
    console.log("");
  }
}

function printCardLine3(cards, isDealerCardHidden) {
  let cardCount = cards.length;

  if (isDealerCardHidden) {
    cardCount = 1;

    for (let i = 0; i < cardCount; i++) {
      let line4 = `|${cards[i][0].padStart(7, " ")}|`;
      process.stdout.write(line4.padEnd(12, " "));
      process.stdout.write("|       |");
    }
    console.log("");

  } else {
    for (let i = 0; i < cardCount; i++) {
      let line4 = `|${cards[i][0].padStart(7, " ")}|`;
      process.stdout.write(line4.padEnd(12, " "));
    }
    console.log("");
  }
}

function setSuitSymbol(card) {
  const SUITS_SYMBOL = {
    Hearts: "\u2764",
    Diamonds: "\u2756",
    Clubs: "\u2663",
    Spades: "\u2660",
  };

  if (card[1] === "Hearts") {
    return SUITS_SYMBOL.Hearts;
  } else if (card[1] === "Diamonds") {
    return SUITS_SYMBOL.Diamonds;
  } else if (card[1] === "Clubs") {
    return SUITS_SYMBOL.Clubs;
  } else if (card[1] === "Spades") {
    return SUITS_SYMBOL.Spades;
  } else {
    return "error";
  }
}
