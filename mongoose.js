const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sadhvij19:sadhvij1903@cluster0.vun6fqm.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const politicianSchema = new mongoose.Schema({
  name: String,
  party: String,
  votes: Number,
  money: Number
});

const Politician = mongoose.model('Politician', politicianSchema);

async function createPolitician() {
  const politicianName = prompt('Enter the name of the politician: ');
  const politicianParty = prompt('Enter the party of the politician: ');
  const politicianVotes = parseInt(prompt('Enter the votes for the politician: '));
  const politicianMoney = parseInt(prompt('Enter the money for the politician: '));

  const politician = new Politician({
    name: politicianName,
    party: politicianParty,
    votes: politicianVotes,
    money: politicianMoney
  });

  try {
    await politician.save();
    console.log('Politician created successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function readPoliticians() {
  try {
    const politicians = await Politician.find();

    console.log('Politicians:');
    politicians.forEach((politician) => {
      console.log(politician);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updatePolitician() {
  const politicianName = prompt('Enter the name of the politician to update: ');
  const politicianVotes = parseInt(prompt('Enter the new votes for the politician: '));
  const politicianMoney = parseInt(prompt('Enter the new money for the politician: '));

  try {
    const updatedPolitician = await Politician.findOneAndUpdate(
      { name: politicianName },
      { votes: politicianVotes, money: politicianMoney },
      { new: true }
    );

    if (updatedPolitician) {
      console.log('Politician updated successfully.');
    } else {
      console.log('Politician not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deletePolitician() {
  const politicianName = prompt('Enter the name of the politician to delete: ');

  try {
    const deletedPolitician = await Politician.findOneAndDelete({ name: politicianName });

    if (deletedPolitician) {
      console.log('Politician deleted successfully.');
    } else {
      console.log('Politician not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function calculateMaxVotes() {
  try {
    const maxVotesPolitician = await Politician.findOne().sort('-votes');
    console.log('Politician with maximum votes:', maxVotesPolitician);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function calculateMaxMoney() {
  try {
    const maxMoneyPolitician = await Politician.findOne().sort('-money');
    console.log('Politician with maximum money:', maxMoneyPolitician);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  let choice = '';

  while (choice !== '7') {
    console.log('--- CRUD Options ---');
    console.log('1. Create Politician');
    console.log('2. Read Politicians');
    console.log('3. Update Politician');
    console.log('4. Delete Politician');
    console.log('5. Calculate Maximum Votes');
    console.log('6. Calculate Maximum Money');
    console.log('7. Exit');

    choice = prompt('Enter your choice (1-7): ');

    switch (choice) {
      case '1':
        await createPolitician();
        break;
      case '2':
        await readPoliticians();
        break;
      case '3':
        await updatePolitician();
        break;
      case '4':
        await deletePolitician();
        break;
      case '5':
        await calculateMaxVotes();
        break;
      case '6':
        await calculateMaxMoney();
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

  mongoose.disconnect();
  console.log('Disconnected from the database.');
}

main();