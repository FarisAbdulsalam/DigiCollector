const router = require('express').Router();
const cardCollection = require('../models/cardCollection.js');

router.get('/my-collection', async (req, res) => {
    const owner = req.session.user;
    const collection = await cardCollection.findOne({owner});
    if(!collection){
        return res.render('cardCollections/new-collection.ejs')
    }
    res.render('cardCollections/my-collection.ejs', { collection });
});

router.post('/', async (req, res) => {
    const owner = req.session.user;
    const collectionName = req.body.collectionName;
    const newCollection = await cardCollection.create({
        owner: owner,
        collectionName: collectionName,
        cards: []
    });
    res.redirect('/cardCollections/my-collection');
});

router.post('/add-cards', async (req, res) => {
    const owner = req.session.user;
    const collection = await cardCollection.findOne({owner});
    const name = req.body.name;
    const cardId = req.body.cardId;
    const image = req.body.image;
    const quantity = req.body.quantity;
    const price = req.body.price;
    collection.cards.push({name, cardId, image, quantity, price});
    await collection.save();
    res.redirect('/cardCollections/my-collection');
});

router.get('/new-card', async (req, res) => {
    res.render('cardCollections/new-card.ejs');
});

router.delete('/cards/:cardId', async (req, res) => {
    const owner = req.session.user;
    const cardId = req.params.cardId;
    const collection = await cardCollection.findOne({ owner });
    collection.cards = collection.cards.filter(card => card._id.toString() !== cardId);
    await collection.save();
    res.redirect('/cardCollections/my-collection');
});

router.get('/cards/:cardId/edit', async (req, res) => {
    const owner = req.session.user;
    const cardId = req.params.cardId;
    const collection = await cardCollection.findOne({ owner });
    const card = collection.cards.id(cardId);
    res.render('cardCollections/edit-card.ejs', { card });
});

router.put('/cards/:cardId', async (req, res) => {
    const owner = req.session.user;
    const cardId = req.params.cardId;
    const name = req.body.name;
    const cardCode = req.body.cardId;
    const image = req.body.image;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const collection = await cardCollection.findOne({ owner });
    const card = collection.cards.id(cardId);
    card.name = name;
    card.cardId = cardCode;
    card.image = image;
    card.quantity = quantity;
    card.price = price;
    await collection.save();
    res.redirect('/cardCollections/my-collection');
});

router.get('/all-collections', async (req, res) => {
    const collections = await cardCollection.find({}).populate('owner');
    res.render('cardCollections/all-collections.ejs', { collections });
});

router.get('/:collectionId', async (req, res) => {
    const user = req.session.user;
    const collection = await cardCollection.findById(req.params.collectionId).populate('owner').populate('comments.author');
    res.render('cardCollections/view-collection.ejs', { collection, user })
});

router.post('/:collectionId/comments', async (req, res) => {
    const collection = await cardCollection.findById(req.params.collectionId);
    collection.comments.push({
        text: req.body.comment,
        author: req.session.user
    });
    await collection.save();
    res.redirect(`/cardCollections/${req.params.collectionId}`);
});

module.exports = router;