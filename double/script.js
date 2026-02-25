const IMAGE_BASE_PATH = "../media/";
const MUSIC_BASE_PATH = "../media/";
const TOTAL_CONTENT_IMAGES = 100;

const imageDecodeQueue = [];

window.addEventListener("DOMContentLoaded", () => {
  const book = document.getElementById("book");
  const indicator = document.getElementById("pageIndicator");
  const musicEl = document.getElementById("bgMusic");

  if (musicEl) {
    const musicSource = musicEl.querySelector("source[data-music]");
    if (musicSource) {
      musicSource.src = MUSIC_BASE_PATH + musicSource.dataset.music;
      musicEl.load();
    }
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

    page.addEventListener("transitionend", (e) => {
      if (e.propertyName === "transform") {
        page.classList.remove("flipping-right", "flipping-left");
      }
    });
  }

  /* ===== BUILD PAGES ===== */
  createPage("front.jpg", "1.jpg");
  for (let i = 2; i <= 99; i += 2) {
    createPage(`${i}.jpg`, `${i + 1}.jpg`);
  }
  createPage("100.jpg", "last.jpg");

  /* ===== INIT ===== */
  Promise.all(imageDecodeQueue).then(initBook);
  setTimeout(initBook, 2000);

  function initBook() {
    if (book.dataset.init) return;
    book.dataset.init = "true";

    const pages = document.querySelectorAll(".page");
    const total = pages.length;
    let index = 0;
    let isBulkAnimating = false;

    /* ===== Z-INDEX SETUP ===== */
    pages.forEach((page, i) => {
      page.style.setProperty("--i", i);
      page.style.setProperty("--z-right", total - i);
      page.style.setProperty("--z-left", i + 1);
    });

    function updateIndicator() {
      indicator.textContent =
        `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    function interactionBlocked() {
      return isBulkAnimating;
    }

    function stopAutoIfRunning() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
        const btn = document.getElementById("autoBtn");
        if (btn) btn.textContent = "▶";
      }
    }

    updateIndicator();

    /* ===== NEXT ===== */
    window.next = () => {
      if (interactionBlocked()) return;
      if (index >= total) return;

      const p = pages[index];
      p.classList.add("flipping-right");
      p.classList.add("turn");

      index++;
      updateIndicator();
    };

    /* ===== PREV ===== */
    window.prev = () => {
      if (interactionBlocked()) return;
      if (index <= 0) return;

      index--;
      const p = pages[index];
      p.classList.add("flipping-left");
      p.classList.remove("turn");

      updateIndicator();
    };

    /* ===== GO START (LOCKED) ===== */
/* ===== GO START (LOCKED + SLOW IN ULTRA) ===== */
window.goStart = () => {
  if (interactionBlocked()) return;
  if (index === 0) return;

  isBulkAnimating = true;
  stopAutoIfRunning();

  let delay = 0;
  const step = ultraOn ? 70 : 40;

  for (let i = index - 1; i >= 0; i--) {
    setTimeout(() => {
      index = i;
      const p = pages[i];
      p.classList.add("flipping-left");
      p.classList.remove("turn");
      updateIndicator();
    }, delay);

    delay += step;
  }

  setTimeout(() => {
    isBulkAnimating = false;
  }, delay + 700);
};

/* ===== GO END (LOCKED + SLOW IN ULTRA) ===== */
window.goEnd = () => {
  if (interactionBlocked()) return;
  if (index >= total) return;

  isBulkAnimating = true;
  stopAutoIfRunning();

  let delay = 0;
  const step = ultraOn ? 70 : 40;

  for (let i = index; i < total; i++) {
    setTimeout(() => {
      const p = pages[i];
      p.classList.add("flipping-right");
      p.classList.add("turn");
      index = i + 1;
      updateIndicator();
    }, delay);

    delay += step;
  }

  setTimeout(() => {
    isBulkAnimating = false;
  }, delay + 700);
};

    /* ===== TAP NAVIGATION ===== */
    book.addEventListener("click", (e) => {
      if (interactionBlocked()) return;

      const r = book.getBoundingClientRect();
      e.clientX - r.left > r.width / 2 ? next() : prev();
    });
  }

  /* ===== FALLING EMOJI EFFECT ===== */
  const fallLayer = document.querySelector(".fall-layer");
  setInterval(() => {
    const d = document.createElement("div");
    d.className = "fall-item";
    d.textContent = ["🌸", "🌼", "❤️", "💖"][Math.random() * 4 | 0];
    d.style.left = Math.random() * 100 + "vw";
    d.style.fontSize = 18 + Math.random() * 8 + "px";
    d.style.animationDuration = 10 + Math.random() * 8 + "s";
    fallLayer.appendChild(d);
    setTimeout(() => d.remove(), 20000);
  }, 1200);
});

/* ===== UI HELPERS ===== */

let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  const btn = document.getElementById("eyeToggle");
  if (btn) btn.textContent = uiVisible ? "👁" : "🙈";
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
  if (window.isBulkAnimating) return;

  const btn = document.getElementById("autoBtn");

  if (!autoTimer) {
    btn.textContent = "⏸";
    autoTimer = setInterval(() => {
      if (typeof next === "function") next();
    }, 4000);
  } else {
    clearInterval(autoTimer);
    autoTimer = null;
    btn.textContent = "▶";
  }
}

let ultraOn = false;


function toggleUltra() {
  const isMobile = window.innerWidth <= 768;

  if (!ultraOn) {
    document.documentElement.requestFullscreen?.();

    if (isMobile) {
      document.body.classList.add("ultra-mobile-zoom");
    }
  } else {
    document.exitFullscreen?.();
    document.body.classList.remove("ultra-mobile-zoom");
  }

  ultraOn = !ultraOn;
}
