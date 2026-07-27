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

document.querySelectorAll("[data-book-carousel]").forEach((bookCarousel) => {
  const pages = Array.from(bookCarousel.querySelectorAll(".book-page"));
  const dots = Array.from(bookCarousel.querySelectorAll("[data-book-slide]"));
  const prevButton = bookCarousel.querySelector('[data-book-direction="prev"]');
  const nextButton = bookCarousel.querySelector('[data-book-direction="next"]');
  let currentIndex = 0;

  const renderPage = (index) => {
    currentIndex = (index + pages.length) % pages.length;

    pages.forEach((page, i) => {
      page.classList.toggle("is-active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentIndex);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      renderPage(Number(dot.dataset.bookSlide));
    });
  });

  prevButton?.addEventListener("click", () => {
    renderPage(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    renderPage(currentIndex + 1);
  });

  if (pages.length) {
    renderPage(currentIndex);
  }
});

const editorialZoomRoot = document.createElement("div");
editorialZoomRoot.className = "editorial-zoom";
editorialZoomRoot.setAttribute("aria-hidden", "true");
editorialZoomRoot.innerHTML = `
  <button type="button" class="editorial-zoom-close" aria-label="Close zoomed image">&times;</button>
  <img src="" alt="">
`;
document.body.appendChild(editorialZoomRoot);

const editorialZoomImage = editorialZoomRoot.querySelector("img");
const editorialZoomClose = editorialZoomRoot.querySelector(".editorial-zoom-close");

const closeEditorialZoom = () => {
  editorialZoomRoot.classList.remove("is-open");
  editorialZoomRoot.setAttribute("aria-hidden", "true");
  document.body.classList.remove("editorial-zoom-open");
  editorialZoomImage.removeAttribute("src");
  editorialZoomImage.alt = "";
};

const openEditorialZoom = (image) => {
  if (!image?.currentSrc && !image?.src) return;

  editorialZoomImage.src = image.currentSrc || image.src;
  editorialZoomImage.alt = image.alt || "Zoomed editorial project image";
  editorialZoomRoot.classList.add("is-open");
  editorialZoomRoot.setAttribute("aria-hidden", "false");
  document.body.classList.add("editorial-zoom-open");
  editorialZoomClose.focus();
};

editorialZoomClose.addEventListener("click", closeEditorialZoom);

editorialZoomRoot.addEventListener("click", (event) => {
  if (event.target === editorialZoomRoot) {
    closeEditorialZoom();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editorialZoomRoot.classList.contains("is-open")) {
    closeEditorialZoom();
  }
});

document.querySelectorAll("[data-hover-carousel]").forEach((hoverCarousel) => {
  const images = Array.from(hoverCarousel.querySelectorAll(".editorial-card-image"));
  const mainImage = hoverCarousel.querySelector(".editorial-main-image");
  const hoverImages = images.filter((image) => image !== mainImage);
  let currentIndex = 0;
  let timerId;

  const useFallbackImage = () => {
    const fallbackSrc = mainImage.dataset.fallbackSrc;

    if (fallbackSrc && mainImage.src !== new URL(fallbackSrc, window.location.href).href) {
      mainImage.src = fallbackSrc;
    }
  };

  mainImage?.addEventListener("error", useFallbackImage);

  if (mainImage?.complete && mainImage.naturalWidth === 0) {
    useFallbackImage();
  }

  const showImage = (image) => {
    images.forEach((currentImage) => {
      currentImage.classList.toggle("is-active", currentImage === image);
    });
  };

  const stopCarousel = () => {
    window.clearInterval(timerId);
    timerId = undefined;
  };

  const resetCarousel = () => {
    stopCarousel();
    currentIndex = 0;
    showImage(mainImage || images[0]);
  };

  const startCarousel = () => {
    if (!hoverImages.length) return;

    stopCarousel();
    showImage(hoverImages[currentIndex]);

    timerId = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % hoverImages.length;
      showImage(hoverImages[currentIndex]);
    }, 1100);
  };

  hoverCarousel.addEventListener("pointerenter", startCarousel);
  hoverCarousel.addEventListener("pointerleave", resetCarousel);
  hoverCarousel.addEventListener("mouseenter", startCarousel);
  hoverCarousel.addEventListener("mouseleave", resetCarousel);
  hoverCarousel.addEventListener("focus", startCarousel);
  hoverCarousel.addEventListener("blur", resetCarousel);
  hoverCarousel.addEventListener("focusin", startCarousel);
  hoverCarousel.addEventListener("focusout", resetCarousel);
  hoverCarousel.addEventListener("click", () => {
    stopCarousel();
    openEditorialZoom(hoverCarousel.querySelector(".editorial-card-image.is-active"));
  });

  hoverCarousel.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    stopCarousel();
    openEditorialZoom(hoverCarousel.querySelector(".editorial-card-image.is-active"));
  });
});

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
  const twitchFeature = twitchEmbedRoot.closest(".twitch-feature");
  const host = window.location.hostname || "localhost";

  const showStream = () => {
    twitchFeature?.classList.remove("is-offline");
  };

  const showFollowButton = () => {
    twitchFeature?.classList.add("is-offline");
  };

  const initializeTwitchPlayer = () => {
    if (!window.Twitch?.Player) {
      showFollowButton();
      return;
    }

    const player = new window.Twitch.Player(twitchEmbedRoot.id, {
      channel,
      width: "100%",
      height: "100%",
      parent: [host],
      autoplay: false,
      muted: true
    });

    player.addEventListener(window.Twitch.Player.ONLINE, showStream);
    player.addEventListener(window.Twitch.Player.OFFLINE, showFollowButton);
  };

  if (window.location.protocol === "file:") {
    showFollowButton();
  } else {
    const twitchPlayerScript = document.createElement("script");
    twitchPlayerScript.src = "https://player.twitch.tv/js/embed/v1.js";
    twitchPlayerScript.addEventListener("load", initializeTwitchPlayer);
    twitchPlayerScript.addEventListener("error", showFollowButton);
    document.head.appendChild(twitchPlayerScript);
  }
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector(".contact-submit");
  const statusMessage = contactForm.querySelector("#contact-status");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    statusMessage.textContent = "";
    statusMessage.classList.remove("is-error");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/karlalejes0@outlook.com",
        {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: new FormData(contactForm)
        }
      );

      if (!response.ok) {
        throw new Error("The message could not be sent.");
      }

      contactForm.reset();
      statusMessage.textContent = "Thank you! Your message has been sent.";
    } catch (error) {
      statusMessage.textContent = "Sorry, your message could not be sent. Please try again.";
      statusMessage.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
}
