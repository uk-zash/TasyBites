// src/controllers/searchController.js
const { db } = require('../config/firebase');
const stringSimilarity = require('string-similarity');

exports.searchItems = async (req, res) => {
  const query = req.query.q;

  try {
    // Fetch all menu items from Firestore
    const menuItemsSnapshot = await db.collection('Menu').get();
    const allItems = [];
    menuItemsSnapshot.forEach((doc) => {
      allItems.push({ id: doc.id, ...doc.data() });
    });

    // Prepare the search query
    const searchTerm = query.toLowerCase();

    // Filter items based on name and category
    const matchedItems = allItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(searchTerm);
      const categoryMatch = item.category.toLowerCase().includes(searchTerm);
      return nameMatch || categoryMatch;
    });

    // Implement fuzzy search for handling misspellings
    const fuzzyMatchedItems = allItems.filter((item) => {
      const nameSimilarity = stringSimilarity.compareTwoStrings(
        item.name.toLowerCase(),
        searchTerm
      );
      const categorySimilarity = stringSimilarity.compareTwoStrings(
        item.category.toLowerCase(),
        searchTerm
      );
      return nameSimilarity > 0.5 || categorySimilarity > 0.5;
    });

    // Combine exact matches and fuzzy matches
    const combinedItems = [...new Set([...matchedItems, ...fuzzyMatchedItems])];

    res.render('pages/search-results', {
      title: `Search Results for "${query}"`,
      items: combinedItems,
      query,
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).send('Internal Server Error');
  }
};