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

module.exports = router;