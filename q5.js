const express = require('express');
const mongoose = require('mongoose');

// Create an instance of Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sadhvij19:sadhvij1903@cluster0.vun6fqm.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Politician schema
const politicianSchema = new mongoose.Schema({
  name: String,
  maxVote: Number,
  maxMoney: Number,
});

// Create the Politician model
const Politician = mongoose.model('Politician', politicianSchema);

// PartyPolitician class
class PartyPolitician {
  constructor() {
    this.politicians = [];
  }

  async addPolitician(politician) {
    const newPolitician = new Politician(politician);
    await newPolitician.save();
    this.politicians.push(newPolitician);
  }

  async removePolitician(index) {
    if (index >= 0 && index < this.politicians.length) {
      const politicianId = this.politicians[index]._id;
      await Politician.findByIdAndDelete(politicianId);
      this.politicians.splice(index, 1);
    }
  }

  async listPoliticians() {
    const politicians = await Politician.find();
    console.log("Politician List:");
    politicians.forEach((politician, index) => {
      console.log(`${index + 1}. ${politician.name}`);
    });
  }
}

const partyPolitician = new PartyPolitician();

// POST /politicians - Add a politician
app.post('/politicians', async (req, res) => {
  const { name, maxVote, maxMoney } = req.body;
  const politician = { name, maxVote, maxMoney };

  try {
    await partyPolitician.addPolitician(politician);
    res.status(201).json({ message: 'Politician added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add politician.' });
  }
});

// DELETE /politicians/:index - Remove a politician
app.delete('/politicians/:index', async (req, res) => {
  const index = parseInt(req.params.index) - 1;

  try {
    await partyPolitician.removePolitician(index);
    res.json({ message: 'Politician removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove politician.' });
  }
});

// GET /politicians - List all politicians
app.get('/politicians', async (req, res) => {
  try {
    await partyPolitician.listPoliticians();
    res.json({ message: 'Politicians listed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to list politicians.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});