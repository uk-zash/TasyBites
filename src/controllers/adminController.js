// src/controllers/adminController.js
const { db } = require('../config/firebase');
const cloudinary = require("../config/cloudinaryConfig");

exports.getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
  });
};

exports.getMenuItems = async (req, res) => {
  try {
    const menuItemsSnapshot = await db.collection('Menu').get();
    const menuItems = [];
    menuItemsSnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    res.render('admin/menu-items', {
      title: 'Manage Menu Items',
      menuItems,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Display the add menu item form
exports.getAddMenuItemPage = (req, res) => {
  res.render('admin/add-menu-item', {
    title: 'Add New Menu Item',
    error_messages: req.flash('error'),
    success_messages: req.flash('success'),
  });
};

// Process the add menu item form
exports.addMenuItem = async (req, res) => {
  const { name, description, price, category, popular } = req.body;
  const imageFile = req.file;

  if (!name || !description || !price || !category) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/admin/menu/add');
  }

  try {
    let imageURL, imagePublicId;

    if (imageFile) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'menu_items',
      });

      imageURL = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Save item data to Firestore
    await db.collection('Menu').add({
      name,
      description,
      price: parseFloat(price),
      category,
      popular: popular === 'on' ? true : false,
      imageURL,
      imagePublicId,
      views: 0,
    });

    req.flash('success', 'Menu item added successfully.');
    res.redirect('/admin/menu');
  } catch (error) {
    console.error('Error adding menu item:', error);
    req.flash('error', 'An error occurred while adding the menu item.');
    res.redirect('/admin/menu/add');
  }
};

// Display the edit menu item form
exports.getEditMenuItemPage = async (req, res) => {
  const itemId = req.params.id;

  try {
    const itemDoc = await db.collection('Menu').doc(itemId).get();

    if (!itemDoc.exists) {
      req.flash('error', 'Menu item not found.');
      return res.redirect('/admin/menu');
    }

    const item = { id: itemDoc.id, ...itemDoc.data() };

    res.render('admin/edit-menu-item', {
      title: 'Edit Menu Item',
      item,
      error_messages: req.flash('error'),
      success_messages: req.flash('success'),
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    req.flash('error', 'An error occurred.');
    res.redirect('/admin/menu');
  }
};

// Process the edit menu item form
exports.editMenuItem = async (req, res) => {
  const itemId = req.params.id;
  const { name, description, price, category, popular } = req.body;
  const imageFile = req.file;

  try {
    const itemRef = db.collection('Menu').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      req.flash('error', 'Menu item not found.');
      return res.redirect('/admin/menu');
    }

    let updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      popular: popular === 'on' ? true : false,
    };

    if (imageFile) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'menu_items',
      });

      const newImageURL = result.secure_url;
      const newImagePublicId = result.public_id;

      updateData.imageURL = newImageURL;
      updateData.imagePublicId = newImagePublicId;

      // Delete old image from Cloudinary
      const oldImagePublicId = itemDoc.data().imagePublicId;
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
    }

    await itemRef.update(updateData);

    req.flash('success', 'Menu item updated successfully.');
    res.redirect('/admin/menu');
  } catch (error) {
    console.error('Error updating menu item:', error);
    req.flash('error', 'An error occurred while updating the menu item.');
    res.redirect(`/admin/menu/edit/${itemId}`);
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const itemRef = db.collection('Menu').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      req.flash('error', 'Menu item not found.');
      return res.redirect('/admin/menu');
    }

    const itemData = itemDoc.data();
    const imagePublicId = itemData.imagePublicId;

    // Delete the image from Cloudinary
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }

    // Delete the item from Firestore
    await itemRef.delete();

    req.flash('success', 'Menu item and associated image deleted successfully.');
    res.redirect('/admin/menu');
  } catch (error) {
    console.error('Error deleting menu item:', error);
    req.flash('error', 'An error occurred while deleting the menu item.');
    res.redirect('/admin/menu');
  }
};


// Display the banner management page
exports.getBannerPage = async (req, res) => {
    try {
      const bannerDoc = await db.collection('Settings').doc('promotionalBanner').get();
      let banner = {};
  
      if (bannerDoc.exists) {
        banner = bannerDoc.data();
      }
  
      res.render('admin/manage-banner', {
        title: 'Manage Promotional Banner',
        banner,
        error_messages: req.flash('error'),
        success_messages: req.flash('success'),
      });
    } catch (error) {
      console.error('Error fetching banner:', error);
      req.flash('error', 'An error occurred while fetching the banner.');
      res.redirect('/admin/dashboard');
    }
  };


  

// Update Banner Controller
exports.updateBanner = async (req, res) => {
  const { bannerType, content } = req.body;
  const imageFile = req.file;

  try {
    const bannerRef = db.collection('Settings').doc('promotionalBanner');
    const bannerDoc = await bannerRef.get();

    let updateData = {};
    let previousImagePublicId = null;

    if (bannerDoc.exists) {
      const bannerData = bannerDoc.data();
      previousImagePublicId = bannerData.imagePublicId || null;
    }

    if (bannerType === 'image') {
      if (imageFile) {
        // Upload new banner image to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'banners',
        });

        updateData.imageURL = result.secure_url; // Cloudinary URL
        updateData.imagePublicId = result.public_id; // Cloudinary Public ID

        // Delete previous image from Cloudinary if it exists
        if (previousImagePublicId) {
          await cloudinary.uploader.destroy(previousImagePublicId);
        }

        // Clear the content text (because it's an image banner)
        updateData.content = '';
      } else {
        req.flash('error', 'Please upload an image for the banner.');
        return res.redirect('/admin/banner');
      }
    } else if (bannerType === 'text') {
      if (content && content.trim() !== '') {
        updateData.content = content.trim();
        updateData.imageURL = '';
        updateData.imagePublicId = '';

        // Delete previous image from Cloudinary if it exists
        if (previousImagePublicId) {
          await cloudinary.uploader.destroy(previousImagePublicId);
        }
      } else {
        req.flash('error', 'Please provide text for the banner.');
        return res.redirect('/admin/banner');
      }
    } else {
      req.flash('error', 'Invalid banner type selected.');
      return res.redirect('/admin/banner');
    }

    // Update the banner document
    await bannerRef.set(updateData);

    req.flash('success', 'Promotional banner updated successfully.');
    res.redirect('/admin/banner');
  } catch (error) {
    console.error('Error updating banner:', error);
    req.flash('error', 'An error occurred while updating the banner.');
    res.redirect('/admin/banner');
  }
};



// Display reviews awaiting approval
exports.getReviews = async (req, res) => {
  try {
    const reviewsSnapshot = await db
      .collection('Reviews')
      .where('approved', '==', false)
      .orderBy('timestamp', 'desc')
      .get();

    const reviews = [];
    reviewsSnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    res.render('admin/manage-reviews', {
      title: 'Manage Reviews',
      reviews,
      error_messages: req.flash('error'),
      success_messages: req.flash('success'),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    req.flash('error', 'An error occurred while fetching reviews.');
    res.redirect('/admin/dashboard');
  }
};

// Approve a review
exports.approveReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    await db.collection('Reviews').doc(reviewId).update({
      approved: true,
    });

    req.flash('success', 'Review approved successfully.');
    res.redirect('/admin/reviews');
  } catch (error) {
    console.error('Error approving review:', error);
    req.flash('error', 'An error occurred while approving the review.');
    res.redirect('/admin/reviews');
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    await db.collection('Reviews').doc(reviewId).delete();

    req.flash('success', 'Review deleted successfully.');
    res.redirect('/admin/reviews');
  } catch (error) {
    console.error('Error deleting review:', error);
    req.flash('error', 'An error occurred while deleting the review.');
    res.redirect('/admin/reviews');
  }
};