/* ===== CHANGE PATHS ONLY HERE ===== */
const IMAGE_BASE_PATH = "../media/";
const MUSIC_BASE_PATH = "../media/";

window.addEventListener("DOMContentLoaded", () => {

  /* APPLY IMAGE PATHS */
  document.querySelectorAll("img[data-img]").forEach(img => {
    img.src = IMAGE_BASE_PATH + img.dataset.img;
  });

  /* APPLY MUSIC PATH */
  const musicEl = document.getElementById("bgMusic");
  const musicSource = musicEl?.querySelector("source[data-music]");
  if (musicSource) {
    musicSource.src = MUSIC_BASE_PATH + musicSource.dataset.music;
    musicEl.load();
  }

  /* ===== FLIPBOOK LOGIC ===== */

  const pages = document.querySelectorAll(".page");
  const indicator = document.getElementById("pageIndicator");
  const TOTAL_IMAGES = document.querySelectorAll(".page img").length;

  const TURN_TIME = 1150;
  const OVERLAP = 0.7;

  let index = 0;

  function updateIndicator() {
    const shown = Math.min(index * 2, TOTAL_IMAGES);
    indicator.textContent = `${shown} / ${TOTAL_IMAGES}`;
  }

  function updateZ() {
    pages.forEach((p, i) => {
      p.style.zIndex = i < index ? i + 1 : pages.length - i;
    });
  }

  window.next = function () {
    if (index >= pages.length) return;
    const page = pages[index];
    page.style.zIndex = pages.length + 50;
    page.classList.add("turn");
    index++;
    updateZ();
    updateIndicator();
  };

  window.prev = function () {
    if (index <= 0) return;
    index--;
    const page = pages[index];
    page.style.zIndex = pages.length + 50;
    page.classList.remove("turn");
    updateZ();
    updateIndicator();
  };

  window.goStart = function () {
    pages.forEach(p => p.classList.remove("turn"));
    index = 0;
    updateZ();
    updateIndicator();
  };

  window.goEnd = function () {
    pages.forEach(p => p.classList.add("turn"));
    index = pages.length;
    updateZ();
    updateIndicator();
  };

  updateZ();
  updateIndicator();

  /* ===== FALLING SYMBOLS ===== */

  const fallLayer = document.querySelector(".fall-layer");
  if (fallLayer) {
    const symbols = ["🌸", "🌼", "❤️", "💖"];

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createFallItem() {
      const item = document.createElement("div");
      item.className = "fall-item";
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = rand(5, 95) + "vw";
      item.style.fontSize = rand(18, 26) + "px";
      item.style.animationDuration = rand(10, 18) + "s";
      fallLayer.appendChild(item);
      setTimeout(() => item.remove(), 20000);
    }

    setInterval(createFallItem, 1200);
  }

  /* ===== MUSIC ===== */

  let musicPlaying = false;

  window.toggleMusic = function () {
    if (!musicPlaying) {
      musicEl.volume = 0.4;
      musicEl.play();
    } else {
      musicEl.pause();
    }
    musicPlaying = !musicPlaying;
  };

  /* ===== TAP TO TURN ===== */

  const book = document.querySelector(".book");
  if (book) {
    book.addEventListener("click", e => {
      const rect = book.getBoundingClientRect();
      const x = e.clientX - rect.left;
      x > rect.width / 2 ? next() : prev();
    });
  }

});

/* ===== UI TOGGLE (GLOBAL) ===== */

let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  const eye = document.getElementById("eyeToggle");
  if (eye) eye.textContent = uiVisible ? "👁" : "🙈";
}

/* ===== ULTRA FULLSCREEN TOGGLE ===== */

let ultraOn = false;

function toggleUltra() {
  const btn = document.getElementById("ultraBtn");

  if (!ultraOn) {
    /* ENTER FULLSCREEN */
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();

    document.body.classList.add("ultra-fullscreen");
    btn.textContent = "🡼"; // exit-style icon
    ultraOn = true;
  } else {
    /* EXIT FULLSCREEN */
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();

    document.body.classList.remove("ultra-fullscreen");
    btn.textContent = "⛶"; // enter fullscreen icon
    ultraOn = false;
  }
}

/* SYNC IF USER EXITS FULLSCREEN VIA ESC */
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove("ultra-fullscreen");
    const btn = document.getElementById("ultraBtn");
    if (btn) btn.textContent = "⛶";
    ultraOn = false;
  }
});

