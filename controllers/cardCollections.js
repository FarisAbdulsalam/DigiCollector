const router = require('express').Router();
const cardCollection = require('../models/cardCollection.js');

router.get('/mycollection', async (req, res) => {
    const owner = req.session.user;
    const collection = await cardCollection.findOne({owner});
    res.render('cardCollections/mycollection.ejs', { collection });
});

module.exports = router;