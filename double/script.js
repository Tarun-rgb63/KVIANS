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
  musicSource.src = MUSIC_BASE_PATH + musicSource.dataset.music;
  musicEl.load();

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

    function updateIndicator() {
      indicator.textContent = `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    function updateZ() {
      pages.forEach((p, i) => {
        p.style.zIndex = i < index ? i + 1 : pages.length - i;
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
      if (index >= pages.length) return;
      pages[index++].classList.add("turn");
      updateZ(); updateIndicator();
    };

    window.prev = () => {
      if (index <= 0) return;
      pages[--index].classList.remove("turn");
      updateZ(); updateIndicator();
    };

    window.goStart = () => {
      while (index > 0) pages[--index].classList.remove("turn");
      updateZ(); updateIndicator();
    };

    window.goEnd = () => {
      while (index < pages.length) pages[index++].classList.add("turn");
      updateZ(); updateIndicator();
    };

    /* TAP */
    book.addEventListener("click", e => {
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

/* UI */
let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  eyeToggle.textContent = uiVisible ? "👁" : "🙈";
}

/* MUSIC */
let musicPlaying = false;
function toggleMusic() {
  const btn = document.getElementById("musicBtn");
  if (!musicPlaying) {
    bgMusic.volume = 0.4;
    bgMusic.play();
    btn.textContent = "🔊";
    musicPlaying = true;
  } else {
    bgMusic.pause();
    btn.textContent = "🔇";
    musicPlaying = false;
  }
}

/* AUTO */
let autoTimer = null;
function toggleAuto() {
  const btn = autoBtn;
  if (!autoTimer) {
    btn.textContent = "⏸";
    autoTimer = setInterval(() => next(), 5000);
  } else {
    clearInterval(autoTimer);
    autoTimer = null;
    btn.textContent = "▶";
  }
}

/* FULLSCREEN */
let ultraOn = false;
function toggleUltra() {
  ultraOn
    ? document.exitFullscreen?.()
    : document.documentElement.requestFullscreen?.();
  ultraOn = !ultraOn;
}
