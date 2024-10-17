const express = require('express');
const router = express.Router();

// Sample in-memory items array (replace with a DB model in production)
let items = [
    { id: 1, name: 'Item 1', description: 'Description of Item 1' },
    { id: 2, name: 'Item 2', description: 'Description of Item 2' }
];

// GET endpoint to retrieve all items
router.get('/', (req, res) => {
    res.json(items);
});

// POST endpoint to create a new item
router.post('/', (req, res) => {
    const newItem = { id: items.length + 1, ...req.body };
    items.push(newItem);
    res.status(201).json(newItem);
});

// DELETE endpoint to remove an item
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    items = items.filter(item => item.id !== id);
    res.status(204).send();
});

// PUT endpoint to update an item
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);

    if (item) {
        Object.assign(item, req.body);
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

module.exports = router;
