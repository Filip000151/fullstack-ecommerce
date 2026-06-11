const express = require('express');
const router = express.Router();
const path = require('path');

router.use('/styles', express.static(path.join(__dirname, '..', '..', 'public', 'styles')));
router.use('/scripts', express.static(path.join(__dirname, '..', '..', 'public', 'scripts')));
router.use('/images', express.static(path.join(__dirname, '..', '..', 'public', 'images')));

router.route('/').get((req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});
router.route('/products').get((req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'products.html'));
});

module.exports = router;