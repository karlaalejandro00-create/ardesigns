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
  });
}

const twitchEmbedRoot = document.querySelector("#twitch-embed");

if (twitchEmbedRoot) {
  const channel = twitchEmbedRoot.dataset.twitchChannel || "ardesigns_";
  const host = window.location.hostname || "localhost";
  const parent = encodeURIComponent(host);

  const iframe = document.createElement("iframe");
  iframe.src = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${parent}&autoplay=false&muted=true`;
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "origin";
  iframe.title = `Twitch live stream: ${channel}`;

  twitchEmbedRoot.appendChild(iframe);
}
