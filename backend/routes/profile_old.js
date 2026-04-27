const express = require('express');
const Journal = require('../models/Journal');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const journals = await Journal.find({ userId: req.user._id });
  const trips = await Trip.find({ userId: req.user._id });
  res.json({ user: req.user, journals, trips });
});

module.exports = router;
