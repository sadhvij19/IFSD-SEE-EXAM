const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class Politician {
  constructor(name, party, votes, money) {
    this.name = name;
    this.party = party;
    this.votes = votes;
    this.money = money;
  }
}

class PoliticalParty {
  constructor(collection) {
    this.collection = collection;
  }

  async addPolitician(politician) {
    await this.collection.insertOne(politician);
    console.log('Politician added successfully.');
  }

  async getPoliticians() {
    const politicians = await this.collection.find().toArray();
    console.log('Politicians:');
    politicians.forEach((politician) => {
      console.log(politician);
    });
  }

  async updatePoliticianVotes(name, votes) {
    await this.collection.updateOne({ name }, { $set: { votes } });
    console.log('Politician votes updated successfully.');
  }

  async deletePolitician(name) {
    await this.collection.deleteOne({ name });
    console.log('Politician deleted successfully.');
  }

  async calculateMaxVotes() {
    const maxVotesPolitician = await this.collection.findOne({}, { sort: { votes: -1 } });
    console.log('Politician with maximum votes:', maxVotesPolitician);
  }

  async calculateMaxMoney() {
    const maxMoneyPolitician = await this.collection.findOne({}, { sort: { money: -1 } });
    console.log('Politician with maximum money:', maxMoneyPolitician);
  }
}

async function main() {
  const uri = "mongodb+srv://sadhvij19:sadhvij1903@cluster0.vun6fqm.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to the database.');

    const db = client.db('politicians');
    const politiciansCollection = db.collection('politicians');
    const politicalParty = new PoliticalParty(politiciansCollection);

    let choice = '';
    while (choice !== '7') {
      console.log('--- CRUD Options ---');
      console.log('1. Add Politician');
      console.log('2. Get Politicians');
      console.log('3. Update Politician Votes');
      console.log('4. Delete Politician');
      console.log('5. Calculate Maximum Votes');
      console.log('6. Calculate Maximum Money');
      console.log('7. Exit');
      choice = prompt('Enter your choice (1-7): ');

      switch (choice) {
        case '1': {
          const politicianName = prompt('Enter the name of the politician: ');
          const politicianParty = prompt('Enter the party of the politician: ');
          const politicianVotes = parseInt(prompt('Enter the votes for the politician: '));
          const politicianMoney = parseInt(prompt('Enter the money for the politician: '));
          const politician = new Politician(politicianName, politicianParty, politicianVotes, politicianMoney);
          await politicalParty.addPolitician(politician);
          break;
        }
        case '2':
          await politicalParty.getPoliticians();
          break;
        case '3': {
          const politicianName = prompt('Enter the name of the politician to update votes: ');
          const politicianVotes = parseInt(prompt('Enter the new votes for the politician: '));
          await politicalParty.updatePoliticianVotes(politicianName, politicianVotes);
          break;
        }
        case '4': {
          const politicianName = prompt('Enter the name of the politician to delete: ');
          await politicalParty.deletePolitician(politicianName);
          break;
        }
        case '5':
          await politicalParty.calculateMaxVotes();
          break;
        case '6':
          await politicalParty.calculateMaxMoney();
          break;
        case '7':
          console.log('Exiting...');
          break;
        default:
          console.log('Invalid choice. Try again.');
          break;
      }

      console.log('\n');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
    console.log('Disconnected from the database.');
  }
}

main();