// src/controllers/filterController.js
const { db } = require('../config/firebase');
const { getCategories } = require('../utils/getCategories');

exports.filterByCategory = async (req, res) => {
  const selectedCategory = req.query.category;
  const from = req.query.from;

  if (from === 'index') {
    // Redirect to /menu with the selected category as a query parameter
    return res.redirect(`/menu?category=${encodeURIComponent(selectedCategory)}`);
  }

  try {
    // Fetch promotional banner content
    const bannerDoc = await db.collection('Settings').doc('promotionalBanner').get();
    let bannerContent = '';
    let bannerImageURL = '';

    if (bannerDoc.exists) {
      const bannerData = bannerDoc.data();
      bannerContent = bannerData.content || '';
      bannerImageURL = bannerData.imageURL || '';
    }

    // Fetch categories
    const categories = await getCategories();

    let items = [];
    if (selectedCategory && selectedCategory !== '') {
      // Fetch items of the selected category
      const itemsSnapshot = await db.collection('Menu').where('category', '==', selectedCategory).get();
      itemsSnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
    } else {
      // If no category is selected, fetch all items
      const itemsSnapshot = await db.collection('Menu').get();
      itemsSnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
    }

    // Render the menu page with filtered items
    res.render('pages/menu', {
      title: 'Menu',
      categories,
      selectedCategory,
      items,
      bannerContent,
      bannerImageURL,
    });
  } catch (error) {
    console.error('Error filtering by category:', error);
    res.status(500).send('Internal Server Error');
  }
};