  // Mobile menu toggle
  const hamburgerMenuButton = document.getElementById("hamburger-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  hamburgerMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      hamburgerMenuButton.classList.toggle("active");
  });

  // Banner type toggle
  document.addEventListener('DOMContentLoaded', function() {
      const bannerTypeText = document.querySelector('input[name="bannerType"][value="text"]');
      const bannerTypeImage = document.querySelector('input[name="bannerType"][value="image"]');
      const bannerTextInput = document.getElementById('bannerTextInput');
      const bannerImageInput = document.getElementById('bannerImageInput');
      const textArea = document.querySelector('textarea[name="content"]');
      const charCounter = document.querySelector('.text-xs.text-gray-500.mt-1');

      function toggleBannerInputs() {
          if (bannerTypeText.checked) {
              bannerTextInput.style.display = 'block';
              bannerImageInput.style.display = 'none';
          } else {
              bannerTextInput.style.display = 'none';
              bannerImageInput.style.display = 'block';
          }
      }

      bannerTypeText.addEventListener('change', toggleBannerInputs);
      bannerTypeImage.addEventListener('change', toggleBannerInputs);

      // Character counter
      if (textArea) {
          textArea.addEventListener('input', () => {
              const remaining = 100 - textArea.value.length;
              charCounter.textContent = `${remaining} characters remaining`;
          });
      }
  });