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
})

module.exports = router;