const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const closeLightbox = document.querySelector(".close-lightbox");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    // Nur Karten aus der gewählten Kategorie bleiben sichtbar.
    workCards.forEach((card) => {
      const isVisible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !isVisible);
    });
  });
});

document.querySelectorAll(".image-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    // In der Lightbox wird die größere Datei aus data-full gezeigt.
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (event) => {
  // Klick auf den dunklen Hintergrund schließt die Lightbox.
  if (event.target === lightbox) {
    lightbox.close();
  }
});
