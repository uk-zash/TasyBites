  // Character counter for description
  const descriptionField = document.querySelector('textarea[name="description"]');
  const charCounter = document.querySelector('.text-xs.text-gray-500.mt-1');

  descriptionField.addEventListener('input', () => {
      const remaining = 200 - descriptionField.value.length;
      charCounter.textContent = `${remaining} characters remaining`;
  });

  // File upload preview
  const fileUpload = document.querySelector('input[type="file"]');
  const currentImage = document.querySelector('.current-image');
  
  fileUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              if (currentImage) {
                  currentImage.src = e.target.result;
              }
          }
          reader.readAsDataURL(file);
      }
  });

