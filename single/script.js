const IMAGE_BASE_PATH = "../media/";
const MUSIC_BASE_PATH = "../media/";

window.addEventListener("DOMContentLoaded", () => {

  const pages = document.querySelectorAll(".page");
  const indicator = document.getElementById("pageIndicator");
  const book = document.querySelector(".book");
  const total = pages.length;

  pages.forEach(p => {
    p.querySelector("img").src = IMAGE_BASE_PATH + p.querySelector("img").dataset.img;
  });

  let index = 0;
  pages[0].classList.add("active");

  function updateIndicator() {
    indicator.textContent = `${index + 1} / ${total}`;
  }

  function goTo(i) {
    if (i < 0 || i >= total || i === index) return;
    pages[index].classList.remove("active");
    pages[index].classList.add("hide");
    pages[i].classList.remove("hide");
    pages[i].classList.add("active");
    index = i;
    updateIndicator();
  }

  window.next = () => goTo(index + 1);
  window.prev = () => goTo(index - 1);
  window.goStart = () => goTo(0);
  window.goEnd = () => goTo(total - 1);

  updateIndicator();

  book.addEventListener("click", e => {
    const x = e.clientX - book.getBoundingClientRect().left;
    x < book.offsetWidth / 2 ? prev() : next();
  });

  /* MUSIC */
  const musicEl = document.getElementById("bgMusic");
  const src = musicEl.querySelector("source");
  src.src = MUSIC_BASE_PATH + src.dataset.music;
  musicEl.load();
  let musicPlaying = false;
  window.toggleMusic = () => {
    musicPlaying ? musicEl.pause() : musicEl.play();
    musicEl.volume = 0.4;
    musicPlaying = !musicPlaying;
  };

});

/* EYE TOGGLE */
let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  document.getElementById("eyeToggle").textContent = uiVisible ? "👁" : "🙈";
}

/* ULTRA FULLSCREEN */
let ultra = false;

function toggleUltra() {
  const btn = document.getElementById("ultraBtn");

  if (!ultra) {
    document.documentElement.requestFullscreen?.();
    document.body.classList.add("pc-ultra");   // ✅ add class
    btn.textContent = "🡼";
    ultra = true;
  } else {
    document.exitFullscreen?.();
    document.body.classList.remove("pc-ultra"); // ✅ remove class
    btn.textContent = "⛶";
    ultra = false;
  }
}

/* SAFETY: RESET IF USER PRESSES ESC */
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove("pc-ultra");
    const btn = document.getElementById("ultraBtn");
    if (btn) btn.textContent = "⛶";
    ultra = false;
  }
});


/* FALLING HEART + FLOWER SYSTEM */
const fallLayer = document.querySelector(".fall-layer");

const symbols = ["❤️", "🌸", "🌼", "💮"];
const colors = ["#f43f5e", "#fb7185", "#facc15", "#a855f7"];

function createFallItem() {
  const item = document.createElement("div");
  item.className = "fall-item";
  item.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const size = Math.random() * 12 + 12;
  item.style.fontSize = size + "px";
  item.style.left = Math.random() * 100 + "vw";
  item.style.color = colors[Math.floor(Math.random() * colors.length)];

  const duration = Math.random() * 6 + 6; // slow fall
  item.style.animationDuration = `${duration}s, ${duration / 2}s`;

  fallLayer.appendChild(item);

  setTimeout(() => item.remove(), duration * 1000);
}

/* LOW DENSITY (PERFORMANCE SAFE) */
setInterval(createFallItem, 450);

/* FLOWERS ABOVE IMAGE (LOW COUNT) */
const flowerOverlay = document.querySelector(".flower-overlay");
const topFlowers = ["🌸", "🌼", "💕","💖"];

function dropTopFlower() {
  const f = document.createElement("div");
  f.className = "flower-top";
  f.textContent = topFlowers[Math.floor(Math.random() * topFlowers.length)];

  const size = Math.random() * 14 + 18; // visible but soft
  f.style.fontSize = size + "px";
  f.style.left = Math.random() * 90 + "vw";

  const duration = Math.random() * 4 + 5; // smooth slow
  f.style.animationDuration = duration + "s";

  flowerOverlay.appendChild(f);
  setTimeout(() => f.remove(), duration * 1000);
}

/* 5 FLOWERS EVERY 4 SECONDS */
setInterval(() => {
  for (let i = 0; i < 4; i++) {
    setTimeout(dropTopFlower, i * 400);
  }
}, 8000);

