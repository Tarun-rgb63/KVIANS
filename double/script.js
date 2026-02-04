/* ===== PATHS ===== */
const IMAGE_BASE_PATH = "../media/";
const MUSIC_BASE_PATH = "../media/";

window.addEventListener("DOMContentLoaded", () => {

  /* ===== MUSIC SETUP ===== */
  const musicEl = document.getElementById("bgMusic");
  const musicSource = musicEl?.querySelector("source[data-music]");
  if (musicSource) {
    musicSource.src = MUSIC_BASE_PATH + musicSource.dataset.music;
    musicEl.load();
  }

/* ===== BUILD BOOK PAGES ===== */
const TOTAL_CONTENT_IMAGES = 100;
const book = document.getElementById("book");

function createPage(frontImg, backImg) {
  const page = document.createElement("div");
  page.className = "page";

  const front = document.createElement("div");
  front.className = "front";
  if (frontImg) {
    const img = document.createElement("img");
    img.src = IMAGE_BASE_PATH + frontImg;
    front.appendChild(img);
  }

  const back = document.createElement("div");
  back.className = "back";
  if (backImg) {
    const img = document.createElement("img");
    img.src = IMAGE_BASE_PATH + backImg;
    back.appendChild(img);
  }

  page.append(front, back);
  book.appendChild(page);
}

/* ========= FRONT COVER PAGE ========= */
/* front.jpg | 1.jpg */
createPage("front.jpg", "1.jpg");

/* ========= INNER PAGES ========= */
/* 2.jpg–99.jpg */
for (let i = 2; i <= 99; i += 2) {
  createPage(`${i}.jpg`, `${i + 1}.jpg`);
}

/* ========= BACK COVER PAGE ========= */
/* 100.jpg | last.jpg */
createPage("100.jpg", "last.jpg");



  /* ===== FLIPBOOK CORE ===== */
  const pages = document.querySelectorAll(".page");
  const indicator = document.getElementById("pageIndicator");

  let index = 0;

  function updateIndicator() {
    const shown = Math.min(index * 2, TOTAL_CONTENT_IMAGES);
    indicator.textContent = `${shown} / ${TOTAL_CONTENT_IMAGES}`;
  }

  function updateZ() {
    pages.forEach((p, i) => {
      p.style.zIndex = i < index ? i + 1 : pages.length - i;
    });
  }

  window.next = () => {
    if (index >= pages.length) return;
    pages[index].classList.add("turn");
    index++;
    updateZ();
    updateIndicator();
  };

  window.prev = () => {
    if (index <= 0) return;
    index--;
    pages[index].classList.remove("turn");
    updateZ();
    updateIndicator();
  };

  window.goStart = () => {
    pages.forEach(p => p.classList.remove("turn"));
    index = 0;
    updateZ();
    updateIndicator();
  };

  window.goEnd = () => {
    pages.forEach(p => p.classList.add("turn"));
    index = pages.length;
    updateZ();
    updateIndicator();
  };

  updateZ();
  updateIndicator();

  /* ===== AUTO PLAY ===== */
  let autoTimer = null;
  let autoPlaying = false;

  window.toggleAuto = () => {
    const btn = document.getElementById("autoBtn");
    if (!autoPlaying) {
      autoPlaying = true;
      btn.textContent = "⏸";
      autoTimer = setInterval(() => {
        index >= pages.length ? goStart() : next();
      }, 5000);
    } else {
      autoPlaying = false;
      btn.textContent = "▶";
      clearInterval(autoTimer);
    }
  };

  /* ===== MUSIC TOGGLE ===== */
  let musicPlaying = false;
  window.toggleMusic = () => {
    if (!musicPlaying) {
      musicEl.volume = 0.4;
      musicEl.play();
    } else {
      musicEl.pause();
    }
    musicPlaying = !musicPlaying;
  };

  /* ===== TAP TO TURN ===== */
  book.addEventListener("click", e => {
    const r = book.getBoundingClientRect();
    (e.clientX - r.left) > r.width / 2 ? next() : prev();
  });

  /* ===== FALLING SYMBOLS ===== */
  const fallLayer = document.querySelector(".fall-layer");
  if (fallLayer) {
    const symbols = ["🌸", "🌼", "❤️", "💖"];
    setInterval(() => {
      const d = document.createElement("div");
      d.className = "fall-item";
      d.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      d.style.left = Math.random() * 100 + "vw";
      d.style.fontSize = 18 + Math.random() * 8 + "px";
      d.style.animationDuration = 10 + Math.random() * 8 + "s";
      fallLayer.appendChild(d);
      setTimeout(() => d.remove(), 20000);
    }, 1200);
  }

});

/* ===== UI TOGGLE ===== */
let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  document.getElementById("eyeToggle").textContent = uiVisible ? "👁" : "🙈";
}

/* ===== ULTRA FULLSCREEN ===== */
let ultraOn = false;
function toggleUltra() {
  const btn = document.getElementById("ultraBtn");
  if (!ultraOn) {
    document.documentElement.requestFullscreen?.();
    btn.textContent = "🡼";
    ultraOn = true;
  } else {
    document.exitFullscreen?.();
    btn.textContent = "⛶";
    ultraOn = false;
  }
}
