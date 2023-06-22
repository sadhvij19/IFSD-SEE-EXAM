const prompt = require('prompt-sync')();

class Politician {
  constructor(name, party) {
    this.name = name;
    this.party = party;
    this.maxVote = 0;
    this.maxMoney = 0;
  }

  updateMaxVote(votes) {
    if (votes > this.maxVote) {
      this.maxVote = votes;
    }
  }

  updateMaxMoney(money) {
    if (money > this.maxMoney) {
      this.maxMoney = money;
    }
  }
}

class Election {
  constructor() {
    this.politicians = [];
  }

  addPolitician(name, party) {
    const politician = new Politician(name, party);
    this.politicians.push(politician);
  }

  updateVote(politicianIndex, votes) {
    this.politicians[politicianIndex].updateMaxVote(votes);
  }

  updateMoney(politicianIndex, money) {
    this.politicians[politicianIndex].updateMaxMoney(money);
  }

  findWinnerByVotes() {
    let winner = null;
    let maxVotes = 0;

    for (const politician of this.politicians) {
      if (politician.maxVote > maxVotes) {
        winner = politician;
        maxVotes = politician.maxVote;
      }
    }

    return winner;
  }

  findWinnerByMoney() {
    let winner = null;
    let maxMoney = 0;

    for (const politician of this.politicians) {
      if (politician.maxMoney > maxMoney) {
        winner = politician;
        maxMoney = politician.maxMoney;
      }
    }

    return winner;
  }
}

function main() {
  const election = new Election();

  // Get user input for the number of politicians
  const numPoliticians = parseInt(prompt("Enter the number of politicians:"));

  // Add politicians with user input attributes
  for (let i = 0; i < numPoliticians; i++) {
    const name = prompt(`Enter the name of politician ${i + 1}:`);
    const party = prompt(`Enter the party of politician ${i + 1}:`);

    election.addPolitician(name, party);
  }

  // Update votes and money with user input
  for (let i = 0; i < numPoliticians; i++) {
    const votes = parseInt(prompt(`Enter the maximum votes for politician ${i + 1}:`));
    const money = parseInt(prompt(`Enter the maximum money for politician ${i + 1}:`));

    election.updateVote(i, votes);
    election.updateMoney(i, money);
  }

  // Find winner by votes
  const winnerByVotes = election.findWinnerByVotes();
  console.log("Winner by votes:", winnerByVotes);

  // Find winner by money
  const winnerByMoney = election.findWinnerByMoney();
  console.log("Winner by money:", winnerByMoney);
}

main();
