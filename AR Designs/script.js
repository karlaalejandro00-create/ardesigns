const heroCarousel = document.querySelector(".hero-carousel");
const carousel = heroCarousel?.querySelector(".home-carousel");

if (heroCarousel && carousel) {
  const slides = Array.from(carousel.querySelectorAll(".carousel-image"));
  const dots = Array.from(heroCarousel.querySelectorAll(".carousel-dot"));
  const prevButton = heroCarousel.querySelector('.carousel-arrow[data-direction="prev"]');
  const nextButton = heroCarousel.querySelector('.carousel-arrow[data-direction="next"]');
  const pauseButton = heroCarousel.querySelector(".carousel-pause");
  let currentIndex = 0;
  let timerId;
  let isPaused = false;

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

  const stopAutoPlay = () => {
    window.clearInterval(timerId);
    timerId = undefined;
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isPaused) return;
    timerId = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, 4500);
  };

  const restartAutoPlay = () => {
    if (isPaused) return;
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

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseButton.setAttribute("aria-pressed", String(isPaused));
      pauseButton.textContent = isPaused ? "Play" : "Pause";
      pauseButton.setAttribute("aria-label", isPaused ? "Play carousel" : "Pause carousel");

      if (isPaused) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  renderSlide(currentIndex);
  startAutoPlay();
}

const siteNav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const navBreakpoint = 900;

let siteNavSpacer;
const syncSiteNavSpacerHeight = () => {
  if (!siteNavSpacer || !siteNav) return;
  const height = Math.round(siteNav.getBoundingClientRect().height);
  siteNavSpacer.style.height = `${height}px`;
};

const setupFixedSiteNav = () => {
  if (!siteNav) return;

  if (!siteNavSpacer || !siteNavSpacer.isConnected) {
    siteNavSpacer = document.createElement("div");
    siteNavSpacer.className = "site-nav-spacer";
    siteNavSpacer.setAttribute("aria-hidden", "true");
    siteNav.insertAdjacentElement("afterend", siteNavSpacer);
  } else if (siteNavSpacer.previousElementSibling !== siteNav) {
    siteNav.insertAdjacentElement("afterend", siteNavSpacer);
  }

  const isAtTop = window.scrollY <= 1;
  if (!isAtTop && document.body.classList.contains("nav-is-fixed")) {
    syncSiteNavSpacerHeight();
    return;
  }

  const wasScrolled = document.body.classList.contains("is-scrolled");

  document.body.classList.remove("nav-is-fixed");
  document.body.classList.remove("is-scrolled");

  const expandedTop = Math.round(siteNav.getBoundingClientRect().top);
  document.documentElement.style.setProperty("--site-nav-top-expanded", `${expandedTop}px`);

  document.body.classList.add("nav-is-fixed");
  if (wasScrolled) document.body.classList.add("is-scrolled");

  syncSiteNavSpacerHeight();
};

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

  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (supportsHover) {
    siteNav.addEventListener("pointerleave", () => {
      if (window.innerWidth <= navBreakpoint) {
        closeMenu();
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > navBreakpoint) {
      closeMenu();
    }
    syncSiteNavSpacerHeight();
  });
}

const header = document.querySelector("header");

if (header) {
  const scrollThreshold = 40;
  const toggleHeaderState = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > scrollThreshold);
    syncSiteNavSpacerHeight();
  };

  toggleHeaderState();
  window.addEventListener("scroll", toggleHeaderState, { passive: true });
}

setupFixedSiteNav();
window.addEventListener("resize", setupFixedSiteNav, { passive: true });
