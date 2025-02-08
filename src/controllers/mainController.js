// src/controllers/mainController.js
const { db } = require('../config/firebase');
const { getCategories } = require('../utils/getCategories');


exports.getHomePage = async (req, res) => {
  const selectedCategory = req.query.category;
  try {
    // Fetch promotional banner content
    const bannerDoc = await db.collection('Settings').doc('promotionalBanner').get();
    let bannerContent = '';
    let bannerImageURL = '';
    if (bannerDoc.exists) {
      bannerContent = bannerDoc.data().content || '';
      bannerImageURL = bannerDoc.data().imageURL || '';
    }

    // Fetch popular items
    const popularItemsSnapshot = await db
      .collection('Menu')
      .where('popular', '==', true)
      .get();
    const popularItems = [];
    for (const doc of popularItemsSnapshot.docs) {
      const item = { id: doc.id, ...doc.data() };

      // Fetch reviews for this product
      const reviewsSnapshot = await db
        .collection('Reviews')
        .where('productId', '==', doc.id)
        .where('approved', '==', true)
        .get();
      
      let totalRating = 0;
      reviewsSnapshot.forEach(reviewDoc => {
        totalRating += reviewDoc.data().rating || 0;
      });

      // Calculate average rating
      item.averageRating = reviewsSnapshot.size > 0 ? (totalRating / reviewsSnapshot.size).toFixed(1) : null;
      popularItems.push(item);
    }

    // Fetch most viewed items
    const mostViewedItemsSnapshot = await db
      .collection('Menu')
      .orderBy('views', 'desc')
      .limit(8)
      .get();
    const mostViewedItems = [];
    for (const doc of mostViewedItemsSnapshot.docs) {
      const item = { id: doc.id, ...doc.data() };

      // Fetch reviews for this product
      const reviewsSnapshot = await db
        .collection('Reviews')
        .where('productId', '==', doc.id)
        .where('approved', '==', true)
        .get();
      
      let totalRating = 0;
      reviewsSnapshot.forEach(reviewDoc => {
        totalRating += reviewDoc.data().rating || 0;
      });

      // Calculate average rating
      item.averageRating = reviewsSnapshot.size > 0 ? (totalRating / reviewsSnapshot.size).toFixed(1) : null;
      mostViewedItems.push(item);
    }

    const categories = await getCategories();

    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');

    res.render('pages/index', {
      title: 'Home',
      bannerContent,
      bannerImageURL,
      popularItems,
      mostViewedItems,
      categories,
      selectedCategory,
      successMessage,
      errorMessage
    });
  } catch (error) {
    console.error('Error fetching data for homepage:', error);
    res.status(500).send('Internal Server Error');
  }
};