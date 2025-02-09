
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });


        function deleteProduct(productId) {
        if (confirm("Are you sure you want to delete this product?")) {
            fetch(`/admin/menu/delete/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Product deleted successfully!");
                    document.getElementById(`product-card-${productId}`).remove();
                } else {
                    alert("Failed to delete product. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    }