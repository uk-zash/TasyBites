document.addEventListener("DOMContentLoaded", function () {
    // Modal Handling
    const modal = document.getElementById("address-modal");
    const showModal = () => modal.classList.remove("hidden");
    const hideModal = () => modal.classList.add("hidden");

    document
      .getElementById("checkout-btn")
      ?.addEventListener("click", showModal);
    document
      .getElementById("close-modal")
      ?.addEventListener("click", hideModal);

    window.addEventListener(
      "click",
      (e) => e.target === modal && hideModal()
    );

    // Handling Cart Item Updates (Increment, Decrement, Remove)
    const updateCartButtons = document.querySelectorAll(".update-cart");
    updateCartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        const itemId = this.getAttribute("data-item-id");
        const action = this.getAttribute("data-action");

        if (action === "remove") {
          // Remove the item from the cart (send request to backend)
          fetch("/cart/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, action }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                // Remove the item from the DOM
                const itemElement = this.closest(".cart-item");
                if (itemElement) {
                  itemElement.remove(); // Remove item from cart display
                }

                // Update total quantity and price in the UI
                document.querySelector("#total-items").textContent =
                  data.totalQty;
                document.querySelector("#subtotal-price").textContent =
                  data.totalPrice;
                document.querySelector("#total-price").textContent =
                  data.totalPrice;

                const cartCount = document.getElementById("cart-count");
                if (cartCount) {
                  cartCount.textContent = data.totalQty;
                 
                }
                // Show or hide the checkout button based on the total price
                const checkoutBtn = document.getElementById("checkout-btn");
                const minOrderMessage =
                  document.getElementById("min-order-message");
                const minOrderAmount = 250;

                if (data.totalPrice >= minOrderAmount) {
                  checkoutBtn.classList.remove("hidden");
                  minOrderMessage.classList.add("hidden");
                } else {
                  checkoutBtn.classList.add("hidden");
                  minOrderMessage.classList.remove("hidden");
                }

                
                // If the cart is empty, show the empty cart message
                if (data.totalQty === 0) {
                  document.getElementById("cart-container").innerHTML = `
              <div class="max-w-2xl mx-auto text-center py-20">
                <div class="mb-8">
                  <i class="fas fa-shopping-cart text-6xl text-gray-300"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p class="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
                <a href="/menu" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold smooth-transition inline-block">
                  Browse Menu
                </a>
              </div>
            `;
                }
              } else {
                alert(data.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          // Handle increment or decrement
          fetch("/cart/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, action }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                // Update the item quantity and total price on the page
                const itemElement = this.closest(".cart-item");
                if (data.itemQty > 0) {
                  itemElement.querySelector(".item-qty").textContent =
                    data.itemQty;
                  itemElement.querySelector(
                    ".item-total-price"
                  ).textContent = data.itemTotalPrice;
                } else {
                  // If quantity is 0, remove the item from the DOM
                  itemElement.remove();
                }

                // Update the cart summary (total items and total price)
                document.querySelector("#total-items").textContent =
                  data.totalQty;
                document.querySelector("#subtotal-price").textContent =
                  data.totalPrice;
                document.querySelector("#total-price").textContent =
                  data.totalPrice;


                const cartCount = document.getElementById("cart-count");
                if (cartCount) {
                  cartCount.textContent = data.totalQty;
                 
                }
                // Show or hide the checkout button based on the total price
                const checkoutBtn = document.getElementById("checkout-btn");
                const minOrderMessage =
                  document.getElementById("min-order-message");
                const minOrderAmount = 250;

                if (data.totalPrice >= minOrderAmount) {
                  checkoutBtn.classList.remove("hidden");
                  minOrderMessage.classList.add("hidden");
                } else {
                  checkoutBtn.classList.add("hidden");
                  minOrderMessage.classList.remove("hidden");
                }

                if (data.totalQty === 0) {
                  document.getElementById("cart-container").innerHTML = `
              <div class="max-w-2xl mx-auto text-center py-20">
                <div class="mb-8">
                  <i class="fas fa-shopping-cart text-6xl text-gray-300"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p class="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
                <a href="/menu" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold smooth-transition inline-block">
                  Browse Menu
                </a>
              </div>
            `;
                }
              } else {
                alert(data.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      });
    });
  });