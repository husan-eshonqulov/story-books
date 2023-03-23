const express = require('express');

const Story = require('../models/Story');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user._id }).lean();
    console.log(stories);
    res.render('dashboard', {
      name: req.user.firstName,
      stories: stories,
      title: stories.title,
    });
  } catch (err) {
    console.log(err);
    res.render('error/500');
  }
});

module.exports = router;
