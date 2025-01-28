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
    popularItemsSnapshot.forEach((doc) => {
      popularItems.push({ id: doc.id, ...doc.data() });
    });

    // Fetch most viewed items
    const mostViewedItemsSnapshot = await db
      .collection('Menu')
      .orderBy('views', 'desc')
      .limit(6)
      .get();
    const mostViewedItems = [];
    mostViewedItemsSnapshot.forEach((doc) => {
      mostViewedItems.push({ id: doc.id, ...doc.data() });
    });

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