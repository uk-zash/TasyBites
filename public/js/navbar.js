function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
}
