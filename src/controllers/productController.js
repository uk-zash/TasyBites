// src/controllers/productController.js
const {admin ,  db } = require('../config/firebase');

exports.getProductPage = async (req, res) => {
  const productId = req.params.id;

  try {
    // Fetch product details
    const productDocRef = db.collection('Menu').doc(productId);
    const productDoc = await productDocRef.get();

    if (!productDoc.exists) {
      req.flash('error', 'Product not found.');
      return res.redirect('/menu');
    }

    const product = { id: productDoc.id, ...productDoc.data() };

    // Increment the views count
    await productDocRef.update({
      views: admin.firestore.FieldValue.increment(1),
    });

    // Fetch approved reviews for the product
    const reviewsSnapshot = await db
      .collection('Reviews')
      .where('productId', '==', productId)
      .where('approved', '==', true)
      .orderBy('timestamp', 'desc')
      .get();

    const reviews = [];
    reviewsSnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');

    res.render('pages/product', {
      title: product.name,
      product,
      reviews,
      successMessage,  // Pass the success message
      errorMessage,
    });
  } catch (error) {
    console.error('Error fetching product page:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.submitReview = async (req, res) => {
  const productId = req.params.id;
  const { name, email, reviewText } = req.body;

  try {
    // Input validation
    if (!name || !email || !reviewText) {
      req.flash('error', 'All fields are required.');
      return res.redirect(`/product/${productId}`);
    }

    // Save the review to Firestore
    await db.collection('Reviews').add({
      productId,
      name,
      email,
      reviewText,
      approved: false, // Reviews need admin approval
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    req.flash('success', 'Thank you for your review! It will appear once approved.');
    res.redirect(`/product/${productId}`);
  } catch (error) {
    console.error('Error submitting review:', error);
    req.flash('error', 'An error occurred while submitting your review.');
    res.redirect(`/product/${productId}`);
  }
};
