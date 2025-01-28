// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const multer = require("multer")
const cloudinary = require('../config/cloudinaryConfig')
const {CloudinaryStorage} = require("multer-storage-cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    paramas:{
        folder:'menu_items',
        allowed_formats:["jpg" , 'jpeg' , 'png']
    }
})

const upload  = multer({storage:storage})

// Admin authentication routes
router.get('/admin/login', auth.loginPage);
router.post('/admin/login', auth.login);
router.get('/admin/logout', auth.logout);

// Protect all admin routes
router.use('/admin', auth.isAuthenticated);

// Admin dashboard
router.get('/admin/dashboard', adminController.getDashboard);

// Manage Menu Items
router.get('/admin/menu', adminController.getMenuItems);
router.get('/admin/menu/add', adminController.getAddMenuItemPage);
router.post('/admin/menu/add', upload.single('image'), adminController.addMenuItem);

router.get('/admin/menu/edit/:id', adminController.getEditMenuItemPage);
router.post('/admin/menu/edit/:id', upload.single("image"), adminController.editMenuItem);

// Delete a menu item
router.post('/admin/menu/delete/:id', adminController.deleteMenuItem);

// Manage Banner
router.get('/admin/banner', adminController.getBannerPage);
router.post('/admin/banner', upload.single('image'), adminController.updateBanner);


// src/routes/adminRoutes.js
router.get('/admin/menu/edit/:id', adminController.getEditMenuItemPage); // Show the edit form
router.post('/admin/menu/edit/:id', upload.single("image"), adminController.editMenuItem); // Handle form submission

router.get('/admin/reviews', auth.isAuthenticated, adminController.getReviews);
router.post('/admin/reviews/approve/:id', auth.isAuthenticated, adminController.approveReview);
router.post('/admin/reviews/delete/:id', auth.isAuthenticated, adminController.deleteReview);

module.exports = router;
