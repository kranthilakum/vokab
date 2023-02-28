var mongoose = require('mongoose');

// Define word schema
const wordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    meaning: { type: String, required: true },
    origin: String,
    pronunciation: String,
    synonyms: [String],
    antonyms: [String],
    usageExamples: [String],
  });
const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
