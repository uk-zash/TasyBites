// src/utils/getCategories.js
const { db } = require('../config/firebase');

exports.getCategories = async () => {
  try {
    const menuItemsSnapshot = await db.collection('Menu').get();
    const categoriesSet = new Set();
    menuItemsSnapshot.forEach((doc) => {
      const item = doc.data();
      if (item.category) {
        categoriesSet.add(item.category);
      }
    });
    const categories = Array.from(categoriesSet);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};