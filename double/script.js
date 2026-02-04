const IMAGE_BASE_PATH = "../media/";
const MUSIC_BASE_PATH = "../media/";
const TOTAL_CONTENT_IMAGES = 100;

const imageDecodeQueue = [];

window.addEventListener("DOMContentLoaded", () => {
  const book = document.getElementById("book");
  const indicator = document.getElementById("pageIndicator");
  const musicEl = document.getElementById("bgMusic");

  /* ===== MUSIC SETUP ===== */
  const musicSource = musicEl.querySelector("source[data-music]");
  if (musicSource) {
    musicSource.src = MUSIC_BASE_PATH + musicSource.dataset.music;
    musicEl.load();
  }

  /* ===== PAGE CREATION ===== */
  function createPage(frontImg, backImg) {
    const page = document.createElement("div");
    page.className = "page";

    const front = document.createElement("div");
    front.className = "front";
    if (frontImg) {
      const img = new Image();
      img.src = IMAGE_BASE_PATH + frontImg;
      img.decoding = "async";
      front.appendChild(img);
      imageDecodeQueue.push(img.decode().catch(() => {}));
    }

    const back = document.createElement("div");
    back.className = "back";
    if (backImg) {
      const img = new Image();
      img.src = IMAGE_BASE_PATH + backImg;
      img.decoding = "async";
      back.appendChild(img);
      imageDecodeQueue.push(img.decode().catch(() => {}));
    }

    page.append(front, back);
    book.appendChild(page);
  }

  /* ===== BUILD BOOK ===== */
  createPage("front.jpg", "1.jpg");
  for (let i = 2; i <= 99; i += 2) {
    createPage(`${i}.jpg`, `${i + 1}.jpg`);
  }
  createPage("100.jpg", "last.jpg");

  /* ===== AFTER IMAGES READY ===== */
  Promise.all(imageDecodeQueue).then(initBook);
  setTimeout(initBook, 3000); // safety fallback

  function initBook() {
    if (!book.hasAttribute("aria-hidden")) return;

    const pages = document.querySelectorAll(".page");
    let index = 0;
    let isTransitioning = false; // State lock to prevent jitter

    function updateIndicator() {
      indicator.textContent = `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    // INDUSTRY SOLUTION: Dynamic Z-indexing calculation
    function updateZ() {
      pages.forEach((p, i) => {
        if (i < index) {
          // Left side: Stack upwards
          p.style.zIndex = i + 1;
        } else {
          // Right side: Stack downwards (top page has highest Z)
          p.style.zIndex = pages.length - i;
        }
      });
    }

    updateZ();
    updateIndicator();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        book.removeAttribute("aria-hidden");
      });
    });

    window.next = () => {
      if (index >= pages.length || isTransitioning) return;
      
      isTransitioning = true;
      const currentPage = pages[index];
      
      // Elevate the flipping page above ALL others
      currentPage.style.zIndex = 1000;
      currentPage.classList.add("turn");
      
      index++;
      
      // Calculate depth mid-flip (approx 90 deg)
      setTimeout(() => {
        updateZ();
        updateIndicator();
        isTransitioning = false;
      }, 900); // Matches CSS transition duration
    };

    window.prev = () => {
      if (index <= 0 || isTransitioning) return;
      
      isTransitioning = true;
      index--;
      const currentPage = pages[index];
      
      // Elevate the flipping page
      currentPage.style.zIndex = 1000;
      currentPage.classList.remove("turn");

      setTimeout(() => {
        updateZ();
        updateIndicator();
        isTransitioning = false;
      }, 900);
    };

    window.goStart = () => {
      if(isTransitioning) return;
      index = 0;
      pages.forEach(p => p.classList.remove("turn"));
      updateZ(); updateIndicator();
    };

    window.goEnd = () => {
      if(isTransitioning) return;
      index = pages.length;
      pages.forEach(p => p.classList.add("turn"));
      updateZ(); updateIndicator();
    };

    /* TAP */
    book.addEventListener("click", e => {
      if (isTransitioning) return;
      const r = book.getBoundingClientRect();
      e.clientX - r.left > r.width / 2 ? next() : prev();
    });
  }

  /* FALLING SYMBOLS */
  const fallLayer = document.querySelector(".fall-layer");
  setInterval(() => {
    const d = document.createElement("div");
    d.className = "fall-item";
    d.textContent = ["🌸","🌼","❤️","💖"][Math.random()*4|0];
    d.style.left = Math.random()*100 + "vw";
    d.style.fontSize = 18 + Math.random()*8 + "px";
    d.style.animationDuration = 10 + Math.random()*8 + "s";
    fallLayer.appendChild(d);
    setTimeout(() => d.remove(), 20000);
  }, 1200);
});

/* UI Logic remains as provided */
let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  document.getElementById("eyeToggle").textContent = uiVisible ? "👁" : "🙈";
}

let musicPlaying = false;
function toggleMusic() {
  const musicEl = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  if (!musicPlaying) {
    musicEl.volume = 0.4;
    musicEl.play();
    btn.textContent = "🔊";
    musicPlaying = true;
  } else {
    musicEl.pause();
    btn.textContent = "🔇";
    musicPlaying = false;
  }
}

let autoTimer = null;
function toggleAuto() {
  const btn = document.getElementById("autoBtn");
  if (!autoTimer) {
    btn.textContent = "⏸";
    autoTimer = setInterval(() => next(), 5000);
  } else {
    clearInterval(autoTimer);
    autoTimer = null;
    btn.textContent = "▶";
  }
}

let ultraOn = false;
function toggleUltra() {
  ultraOn
    ? document.exitFullscreen?.()
    : document.documentElement.requestFullscreen?.();
  ultraOn = !ultraOn;
}
