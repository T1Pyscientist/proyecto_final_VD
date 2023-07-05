const carouselHistorias = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const carouselContainer = document.querySelector('.carousel-container');

let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;

carouselHistorias.addEventListener('mousedown', dragStart);
carouselHistorias.addEventListener('touchstart', dragStart);
carouselContainer.addEventListener('mouseleave', dragEnd);
carouselContainer.addEventListener('mouseup', dragEnd);
carouselContainer.addEventListener('touchend', dragEnd);
carouselContainer.addEventListener('mousemove', drag);
carouselContainer.addEventListener('touchmove', drag);

function dragStart(e) {
  e.preventDefault();
  if (e.type === 'touchstart') {
    startPosition = e.touches[0].clientX;
  } else {
    startPosition = e.clientX;
    carouselHistorias.style.cursor = 'grabbing';
  }
  isDragging = true;
}

function drag(e) {
  if (isDragging) {
    let currentPosition;
    if (e.type === 'touchmove') {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }
    const diff = currentPosition - startPosition;
    currentTranslate = prevTranslate + diff;
    carouselHistorias.style.transform = `translateX(${currentTranslate}px)`;
  }
}

function dragEnd() {
  prevTranslate = currentTranslate;
  isDragging = false;
  carouselHistorias.style.cursor = 'grab';
}

// Evitar selección de texto durante el arrastre
carouselHistorias.addEventListener('dragstart', (e) => e.preventDefault());
