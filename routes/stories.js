const express = require('express');

const Story = require('../models/Story');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

// @desc Show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// @desc Process add form
// @route POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.render('error/500');
  }
});

// @desc Show all stories
// @route GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc Show edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();

  if (!story) {
    return res.render('error/404');
  }

  if (story.user != req.user._id) {
    res.redirect('/stories');
  } else {
    res.render('stories/edit', { story });
  }
});

module.exports = router;
