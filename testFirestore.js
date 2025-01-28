const bcrypt = require('bcrypt');

const plainPassword = 'superVOOC@1'; // Replace with your actual password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Hash:', hash);
    // You can now copy this hash and place it in your .env file as ADMIN_PASSWORD_HASH
  }
});