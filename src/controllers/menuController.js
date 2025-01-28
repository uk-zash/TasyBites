// src/controllers/menuController.js
const { db } = require('../config/firebase');
const { getCategories } = require('../utils/getCategories');

exports.getMenuPage = async (req, res) => {
  const selectedCategory = req.query.category;

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

    let menuItems = {};

    if (selectedCategory && selectedCategory !== '') {
      // Fetch all items of the selected category
      const menuItemsSnapshot = await db.collection('Menu')
        .where('category', '==', selectedCategory)
        .orderBy('name')
        .get();
      const items = [];
      menuItemsSnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      menuItems[selectedCategory] = {
        items,
        hasMore: false, // All items are displayed
      };
    } else {
      // Fetch limited items (e.g., 5) for each category
      const promises = categories.map(async (category) => {
        const itemsSnapshot = await db.collection('Menu')
          .where('category', '==', category)
          .orderBy('name') // or any field you prefer
          .limit(5) // Fetch 5 items to check if there are more than 4
          .get();

        const items = [];
        itemsSnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        // Determine if there are more than 4 items
        const hasMore = items.length > 4;

        // Store only the first 4 items for display
        menuItems[category] = {
          items: items.slice(0, 4),
          hasMore,
        };
      });

      await Promise.all(promises);
    }

    res.render('pages/menu', {
      title: 'Menu',
      categories,
      menuItems,
      selectedCategory,
      bannerContent,
      bannerImageURL,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).send('Internal Server Error');
  }
};