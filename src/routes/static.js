const express = require('express');
const router = express.Router();
const path = require('path');

const publicPath = path.join(__dirname, '..', '..', 'public');

router.use('/styles', express.static(path.join(publicPath, 'styles')));
router.use('/scripts', express.static(path.join(publicPath, 'scripts')));
router.use('/images', express.static(path.join(publicPath, 'images')));

router.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = router;