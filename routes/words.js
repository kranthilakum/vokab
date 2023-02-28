var express = require('express');
var router = express.Router();
const Word = require('../models/Word');

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Word
 *     summary: Get a list of words.
 *     description: Get a list of words from database.
 *     responses:
 *       200:
 *         description: Returns a all words.
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Word'
 * components:
 *   schemas:
 *     Word:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         name:
 *           type: string
 *           description: Word
 *           example: "serendipity"
 *         meaning:
 *           type: string
 *           description: Meaning of the word
 *           example: "a happy accident or pleasant surprise"
 *         origin:
 *           type: string
 *           description: Origin of the word
 *           example: "from the Persian fairy tale 'The Three Princes of Serendip'"
 *         pronunciation:
 *           type: string
 *           description: Pronunciation of the word
 *           example: "ˌserənˈdipədē"
 *         synonyms:
 *           type: array
 *           items:
 *             type: string
 *           example: ["fluke","fortuity","chance","luck","happy chance"]
 *         antonyms:
 *           type: array
 *           items:
 *             type: string
 *           example: ["misfortune","bad luck","unluckiness"]
 *         usageExamples:
 *           type: array
 *           items:
 *             type: string
 */
router.get('/', function(req, res, next) {
    Word.find({}, (err, words) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(words);
        }
    });
});

/**
 * Get word by _id field
 * Usage: /words/word/<_id>
 */
router.get('/word/:id', (req, res) => {
    try {
        Word.findById(req.params.id, (err, word) => {
            if (err) {
              res.status(500).send(err);
            } else if (!word) {
              res.status(404).send('Word not found');
            } else {
              res.send(word);
            }
          });
    } catch(err) {
        res.status(404).json('The vokab API don\'t have that');
    }
  });

/**
 * Get word by name field
 * Usage: /words/word?name=serendipity
 */
router.get('/word', (req, res) => {
    try {
        if (req.query.name) {
            Word.find({"name": req.query.name.toLowerCase()}, (err, word) => {
                if (err) {
                    res.status(500).send(err);
                } else if (!word) {
                    res.status(404).send('Word not found');
                } else {
                    res.send(word);
                }
            });
        }
    } catch(err) {
        res.status(404).json('The vokab API don\'t have that');
    }
});

/**
 * Get all words
 * Usage: /words/all
 */
router.get("/all", async (req, res) => {
    getAllWordNames()
    .then(names => res.send(names))
    .catch(error => {
      // handle error
    });
  })

/**
 * Return a list of words (name field)
 * @returns wordNames
 */
async function getAllWordNames() {
    try {
        const words = await Word.find({}, 'name').sort(); // get all documents and select only the 'name' field
        const wordNames = words.map(word => word.name); // extract only the names from the documents
        return wordNames;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

router.get("/count", async (req, res) => {
    getWordCount()
    .then(count => res.json({count: count}))
    .catch(error => {
      // handle error
    });
  })

/**
 * Return words count
 * Usage: /words/count
 * @returns count
 */
async function getWordCount() {
    try {
        const count = await Word.countDocuments();
        return count;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Get words by page number
 * Usage: words/list?pageSize=10&pageNumber=1
 */
router.get("/list", async (req, res) => {
    const PAGE_SIZE = parseInt(req.query.pageSize) || 10; // Default page size is 10
    const PAGE_NUMBER = parseInt(req.query.pageNumber) || 1; // Default page number is 1

    try {
        // Find all words in the database and sort them by name
        const allWords = await Word.find({}).sort("name");

        // Calculate the start and end indices for the current page
        const startIndex = (PAGE_NUMBER - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        // Slice the allWords array to get the words for the current page
        const words = allWords.slice(startIndex, endIndex);

        // Construct the response object
        const response = {
            words,
            pagination: {
                currentPage: PAGE_NUMBER,
                pageSize: PAGE_SIZE,
                totalCount: allWords.length,
            },
        };

        // Construct links for pagination
        const links = {};
        const totalPages = Math.ceil(allWords.length / PAGE_SIZE);
        if (PAGE_NUMBER < totalPages) {
            links.next = `/words?pageNumber=${PAGE_NUMBER + 1}&pageSize=${PAGE_SIZE}`;
            links.last = `/words?pageNumber=${totalPages}&pageSize=${PAGE_SIZE}`;
        }
        if (PAGE_NUMBER > 1) {
            links.first = "/words?pageNumber=1&pageSize=${PAGE_SIZE}";
            links.prev = `/words?pageNumber=${PAGE_NUMBER - 1}&pageSize=${PAGE_SIZE}`;
        }

        // Add the links to the response object
        response.links = links;

        res.status(200).json(response); // Return the response object
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handles any errors that occur during the find operation
    }
});

/**
 * Update a word
 * 
 * @openapi
 * /word/{id}/update:
 *   put:
 *     tags:
 *       - Word
 *     summary: Update an existing word.
 *     description: Update an existing word in the database by its ID.
 *     operationId: update
 *     parameters:
 *       name: id
 *       in: path
 *       description: ID of word to update
 *       required: true
 *       schema:
 *         type: integer
 *         format: int64
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Word'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Word not found
 *       '405':
 *         description: Validation exception
*/
router.put('/word/:id/update', (req, res) => {
    Word.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, word) => {
        if (err) {
        res.status(500).send(err);
        } else if (!word) {
        res.status(404).send('Word not found');
        } else {
        res.send(word);
        }
    });
});

/**
 * Delete a word by _id field
 */
router.delete('/word/:id/delete', (req, res) => {
    Word.findByIdAndRemove(req.params.id, (err, word) => {
        if (err) {
        res.status(500).send(err);
        } else if (!word) {
        res.status(404).send('Word not found');
        } else {
        res.send('Word deleted successfully');
        }
    });
});

/**
 * Insert a word
 * 
 * @openapi
 * /word:
 *   post:
 *     tags:
 *       - Word
 *     summary: Add a new word.
 *     description: Introduce a new word into database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/Word'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/ApiResponse'
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */
router.post('/word', (req, res) => {
    const newWord = new Word(req.body);
    newWord.save((err, word) => {
        if (err) {
        res.status(500).send(err);
        } else {
        res.send(word);
        }
    });
});

/**
 * Insert many words
 * 
 * @openapi
 * /words:
 *   post:
 *     tags:
 *       - Word
 *     summary: Add new words.
 *     description: Introduce new words into database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Word'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/words", async (req, res) => {
    const words = req.body; // Assumes the request body is an array of word objects
    try {
        const result = await Word.insertMany(words); // Inserts the array of word objects into the database
        res.status(201).json(result); // Returns the result of the insertMany operation
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handles any errors that occur during the insertMany operation
    }
});

module.exports = router;
