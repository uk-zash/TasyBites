// src/controllers/reviewsController.js
const { db } = require('../config/firebase');

exports.getReviewsPage = async (req, res) => {
  try {
    const reviewsSnapshot = await db.collection('Reviews').where('approved', '==', true).get();
    const reviews = [];
    reviewsSnapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    res.render('pages/reviews', {
      title: 'Reviews',
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.submitReview = async (req, res) => {
  const { name, email, reviewText } = req.body;

  try {
    await db.collection('Reviews').add({
      name,
      email,
      reviewText,
      approved: false, // Admin needs to approve
    });

    req.flash('success', 'Thank you for your review! It will appear on the site once approved.');
    res.redirect('/reviews');
  } catch (error) {
    console.error('Error submitting review:', error);
    req.flash('error', 'An error occurred.');
    res.redirect('/reviews');
  }
};