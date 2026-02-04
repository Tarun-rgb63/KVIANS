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

    // CLEANUP LISTENER
    // When animation ends, remove the 'flipping' class.
    // The Z-index will automatically settle to --z-left or --z-right based on .turn
    page.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        page.classList.remove('flipping');
      }
    });
  }

  /* ===== BUILD PAGES ===== */
  createPage("front.jpg", "1.jpg");
  for (let i = 2; i <= 99; i += 2) {
    createPage(`${i}.jpg`, `${i + 1}.jpg`);
  }
  createPage("100.jpg", "last.jpg");

  /* ===== INITIALIZE ===== */
  Promise.all(imageDecodeQueue).then(initBook);
  setTimeout(initBook, 2000); 

  function initBook() {
    if (book.dataset.init) return;
    book.dataset.init = "true";

    const pages = document.querySelectorAll(".page");
    const total = pages.length;
    let index = 0; // Tracks which page is currently 'next' to flip

    // === THE FIX: PRE-DEFINE Z-INDEX VALUES ===
    pages.forEach((page, i) => {
      // 1. RIGHT STACK: Page 0 is top (Z=50), Page 1 is below (Z=49)
      const zRight = total - i;
      
      // 2. LEFT STACK: Page 0 is bottom (Z=1), Page 1 is above (Z=2)
      const zLeft = i + 1;

      // Assign to CSS Variables
      page.style.setProperty('--z-right', zRight);
      page.style.setProperty('--z-left', zLeft);
    });

    function updateIndicator() {
      indicator.textContent = `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    updateIndicator();

    window.next = () => {
      if (index >= total) return;
      
      const p = pages[index];
      
      // 1. Priority: High (Move above everything)
      p.classList.add("flipping");
      
      // 2. State: Turn (CSS swaps z-index variable automatically)
      p.classList.add("turn");
      
      index++;
      updateIndicator();
    };

    window.prev = () => {
      if (index <= 0) return;
      
      index--;
      const p = pages[index];
      
      // 1. Priority: High
      p.classList.add("flipping");
      
      // 2. State: Unturn
      p.classList.remove("turn");
      
      updateIndicator();
    };

    window.goStart = () => {
      if (index === 0) return;
      let delay = 0;
      for (let i = index - 1; i >= 0; i--) {
        setTimeout(() => prev(), delay);
        delay += 30;
      }
    };

    window.goEnd = () => {
      if (index >= total) return;
      let delay = 0;
      for (let i = index; i < total; i++) {
        setTimeout(() => next(), delay);
        delay += 30;
      }
    };

    /* TAP NAV */
    book.addEventListener("click", e => {
      const r = book.getBoundingClientRect();
      e.clientX - r.left > r.width / 2 ? next() : prev();
    });
  }

  /* FX */
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

/* UI Helpers */
let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  const btn = document.getElementById("eyeToggle");
  if(btn) btn.textContent = uiVisible ? "👁" : "🙈";
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
    autoTimer = setInterval(() => next(), 4000);
  } else {
    clearInterval(autoTimer);
    autoTimer = null;
    btn.textContent = "▶";
  }
}

let ultraOn = false;
function toggleUltra() {
  ultraOn ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.();
  ultraOn = !ultraOn;
}
