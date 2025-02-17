 // Function to show the floating cart
 function showFloatingCart() {
    const floatingCart = document.getElementById("floating-cart");
    floatingCart.classList.add("active");
  }

  // Function to hide the floating cart
  function hideFloatingCart() {
    const floatingCart = document.getElementById("floating-cart");
    floatingCart.classList.remove("active");
  }

  // Function to update the cart count in the navbar
  function updateCartCount(count) {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = count;
      console.log(cartCount);
    }
  }

  // Function to add an item to the cart via AJAX
  function addToCart(event) {
    event.preventDefault();
    const button = event.target;
    const itemId = button.getAttribute("data-id");

    if (!itemId) {
      console.error("Item ID not found");
      return;
    }

    fetch("/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: itemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          updateCartCount(data.totalQty);
          displayCartItems(data.cartItems);
          showFloatingCart();
          // Optionally, display a success message
          // alert(data.message);
          
        } else {
          // Handle errors (e.g., item not found)
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding to cart.");
      });
  }

  // Function to display the cart items in the floating cart
  function displayCartItems(cartItems) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear existing items

    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
          <img src="${item.imageURL}" alt="${item.name}">
          <div class="cart-item-details">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">₹${item.price} x ${item.qty}</p>
          </div>
        `;
      cartItemsContainer.appendChild(cartItem);
    });

    // Update total price
    const totalPriceElement = document.getElementById("cart-total-price");
    if (totalPriceElement) {
      totalPriceElement.textContent = `₹${calculateTotalPrice(cartItems)}`;
    }
  }

  // Function to calculate total price from cart items
  function calculateTotalPrice(cartItems) {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  }

  // Attach event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  // Event listener for the "Close" button in the floating cart
  document
    .getElementById("close-cart")
    .addEventListener("click", hideFloatingCart);

  // Event listener for the "Proceed to Checkout" button
  document.getElementById("checkout-btn").addEventListener("click", () => {
    window.location.href = "/cart";
  });

  // Function to fetch and display cart items on page load
  function initializeCart() {
    fetch("/get-cart")
      .then((response) => response.json())
      .then((data) => {
        if (data.cartItems && data.cartItems.length > 0) {
          updateCartCount(data.totalQty);
          displayCartItems(data.cartItems);
          // Optionally, show the floating cart on page load if cart has items
          // showFloatingCart();
        } else {
          updateCartCount(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }

  // Initialize cart on page load
  window.onload = initializeCart;