const fileInput = document.getElementById('file-input');
const uploadContainer = document.getElementById('file-upload-container');
const previewImage = document.getElementById('preview-image');
const fileName = document.getElementById('file-name');
const removeFileBtn = document.getElementById('remove-file');

// Handle file selection
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    handleFile(file);
});

// Handle drag and drop
uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.classList.add('dragover');
});

uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('dragover');
});

uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    handleFile(file);
});

// Handle file removal
removeFileBtn.addEventListener('click', () => {
    fileInput.value = '';
    uploadContainer.classList.remove('has-file');
    previewImage.src = '';
    previewImage.classList.add('hidden');
    fileName.textContent = '';
});

function handleFile(file) {
    if (file) {
        uploadContainer.classList.add('has-file');
        fileName.textContent = file.name;

        // Show preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    }
}