const carousel = document.querySelector(".home-carousel");

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".carousel-image"));
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));
  const prevButton = document.querySelector('.carousel-arrow[data-direction="prev"]');
  const nextButton = document.querySelector('.carousel-arrow[data-direction="next"]');
  let currentIndex = 0;
  let timerId;

  const renderSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const goTo = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    renderSlide(currentIndex);
  };

  const startAutoPlay = () => {
    timerId = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, 4500);
  };

  const restartAutoPlay = () => {
    window.clearInterval(timerId);
    startAutoPlay();
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.slide));
      restartAutoPlay();
    });
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      goTo(currentIndex - 1);
      restartAutoPlay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goTo(currentIndex + 1);
      restartAutoPlay();
    });
  }

  renderSlide(currentIndex);
  startAutoPlay();
}

const siteNav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const navBreakpoint = 900;

if (siteNav && navToggle) {
  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= navBreakpoint) {
        closeMenu();
      }
    });
  });

  siteNav.addEventListener("pointerleave", () => {
    if (window.innerWidth <= navBreakpoint) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > navBreakpoint) {
      closeMenu();
    }
  });
}

const header = document.querySelector("header");

if (header) {
  const scrollThreshold = 40;
  const toggleHeaderState = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > scrollThreshold);
  };

  toggleHeaderState();
  window.addEventListener("scroll", toggleHeaderState, { passive: true });
}
