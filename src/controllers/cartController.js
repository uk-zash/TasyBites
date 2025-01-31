const { db } = require('../config/firebase');

exports.addToCart = async (req, res) => {
  const itemId = req.body.id;

  try {
    const itemDoc = await db.collection('Menu').doc(itemId).get();

    if (!itemDoc.exists) {
      req.flash('error', 'Item not found.');
      return res.redirect('/menu');
    }

    const item = { id: itemDoc.id, ...itemDoc.data() };

    if (!req.session.cart) {
      req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
    }

    const cart = req.session.cart;

    if (cart.items[itemId]) {
      cart.items[itemId].qty += 1;
    } else {
      cart.items[itemId] = { item, qty: 1 };
    }

    cart.totalQty += 1;
    cart.totalPrice += item.price;

    req.flash('success', `${item.name} added to cart.`);
    res.location(req.get("Referrer") || "/")
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getCartPage = (req, res) => {
  const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
  res.render('pages/cart', {
    title: 'Your Cart',
    cart,
  });
};

exports.updateCart = (req, res) => {
  const itemId = req.body.itemId;
  const action = req.body.action;

  if (!req.session.cart || !req.session.cart.items[itemId]) {
    req.flash('error', 'Item not found in cart.');
    return res.redirect('/cart');
  }

  const cart = req.session.cart;
  const cartItem = cart.items[itemId];

  switch (action) {
    case 'increase':
      cartItem.qty += 1;
      cart.totalQty += 1;
      cart.totalPrice += cartItem.item.price;
      break;
    case 'decrease':
      cartItem.qty -= 1;
      cart.totalQty -= 1;
      cart.totalPrice -= cartItem.item.price;

      if (cartItem.qty <= 0) {
        delete cart.items[itemId];
      }
      break;
    case 'remove':
      cart.totalQty -= cartItem.qty;
      cart.totalPrice -= cartItem.item.price * cartItem.qty;
      delete cart.items[itemId];
      break;
    default:
      break;
  }

  if (cart.totalQty <= 0) {
    req.session.cart = null;
  }

  res.redirect('/cart');
};

// src/controllers/checkoutController.js
exports.checkout = (req, res) => {
    const cart = req.session.cart;
  
    if (!cart || cart.totalPrice < 350) {
      req.flash('error', 'Minimum order amount is ₹350 for delivery.');
      return res.redirect('/cart');
    }
  
    const { fullName, streetAddress, apartment, zipCode } = req.body;
  
    // Validate required fields
    if (!fullName || fullName.trim() === "" || !streetAddress || streetAddress.trim() === "" || !zipCode || zipCode.trim() === "") {
      req.flash('error', 'Please provide all required fields for delivery address.');
      return res.redirect('/cart');
    }
  
    // Build the address string
    let address = `${fullName}\n${streetAddress}`;
    if (apartment && apartment.trim() !== "") {
      address += `, ${apartment}`;
    }
    address += `\nZip Code: ${zipCode}`;
  
    // Build the order summary
    let orderSummary = 'Hello, I would like to place an order:\n\n';
    Object.values(cart.items).forEach(cartItem => {
      orderSummary += `• ${cartItem.qty} x *${cartItem.item.name}* *(@₹${cartItem.item.price}* each)\n`;
    });
    orderSummary += `\n*Total Amount:* ₹${cart.totalPrice}\n\n*Delivery Address:* \n${address}`;
  
    const encodedMessage = encodeURIComponent(orderSummary);
    const whatsappNumber = '918127625855'; // Replace with actual WhatsApp number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
    req.session.cart = null; // Clear the cart after checkout
  
    res.redirect(whatsappURL);
  };
  