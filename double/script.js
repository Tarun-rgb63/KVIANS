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

  createPage("front.jpg", "1.jpg");
  for (let i = 2; i <= 99; i += 2) {
    createPage(`${i}.jpg`, `${i + 1}.jpg`);
  }
  createPage("100.jpg", "last.jpg");

  Promise.all(imageDecodeQueue).then(initBook);
  setTimeout(initBook, 2000);

  function initBook() {
    if (book.dataset.init) return;
    book.dataset.init = "true";

    const pages = document.querySelectorAll(".page");
    const total = pages.length;
    let index = 0;
    let isBusy = false;

    pages.forEach((page, i) => {
      page.style.setProperty("--i", i);
      page.style.setProperty("--z-right", total - i);
      page.style.setProperty("--z-left", i + 1);
    });

    function updateIndicator() {
      indicator.textContent =
        `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    updateIndicator();

    window.next = () => {
      if (isBusy) return;
      if (index >= total) return;

      const p = pages[index];
      p.classList.add("flipping-right");
      p.classList.add("turn");

      index++;
      updateIndicator();
    };

    window.prev = () => {
      if (isBusy) return;
      if (index <= 0) return;

      index--;
      const p = pages[index];
      p.classList.add("flipping-left");
      p.classList.remove("turn");

      updateIndicator();
    };

    window.goStart = () => {
      if (isBusy) return;
      if (index === 0) return;

      isBusy = true;

      let delay = 0;
      const startIndex = index;

      for (let i = startIndex - 1; i >= 0; i--) {
        setTimeout(() => {
          index = i;
          const p = pages[i];
          p.classList.add("flipping-left");
          p.classList.remove("turn");
          updateIndicator();

          if (i === 0) {
            setTimeout(() => {
              isBusy = false;
            }, 600);
          }

        }, delay);
        delay += 30;
      }
    };

    window.goEnd = () => {
      if (isBusy) return;
      if (index >= total) return;

      isBusy = true;

      let delay = 0;
      const startIndex = index;

      for (let i = startIndex; i < total; i++) {
        setTimeout(() => {
          const p = pages[i];
          p.classList.add("flipping-right");
          p.classList.add("turn");
          index = i + 1;
          updateIndicator();

          if (i === total - 1) {
            setTimeout(() => {
              isBusy = false;
            }, 600);
          }

        }, delay);
        delay += 30;
      }
    };

    book.addEventListener("click", (e) => {
      if (isBusy) return;

      const r = book.getBoundingClientRect();
      e.clientX - r.left > r.width / 2 ? next() : prev();
    });

    window._isBusyRef = () => isBusy;
  }

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
  const btn = document.getElementById("autoBtn");
  if (!autoTimer) {
    btn.textContent = "⏸";
    autoTimer = setInterval(() => {
      if (!window._isBusyRef?.()) next();
    }, 4000);
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
}    if (backImg) {
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
    let isBusy = false; // 🔒 GLOBAL ANIMATION LOCK

    pages.forEach((page, i) => {
      page.style.setProperty("--i", i);
      page.style.setProperty("--z-right", total - i);
      page.style.setProperty("--z-left", i + 1);
    });

    function updateIndicator() {
      indicator.textContent = `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    updateIndicator();

    /* ===== NEXT ===== */
    window.next = () => {
      if (isBusy) return;
      if (index >= total) return;

      const p = pages[index];
      p.classList.add("flipping-right");
      p.classList.add("turn");

      index++;
      updateIndicator();
    };

    /* ===== PREV ===== */
    window.prev = () => {
      if (isBusy) return;
      if (index <= 0) return;

      index--;
      const p = pages[index];
      p.classList.add("flipping-left");
      p.classList.remove("turn");

      updateIndicator();
    };

    /* ===== GO START ===== */
    window.goStart = () => {
      if (isBusy) return;
      if (index === 0) return;

      isBusy = true;

      let delay = 0;
      const startIndex = index;

      for (let i = startIndex - 1; i >= 0; i--) {
        setTimeout(() => {
          index = i;
          const p = pages[i];
          p.classList.add("flipping-left");
          p.classList.remove("turn");
          updateIndicator();

          if (i === 0) {
            setTimeout(() => {
              isBusy = false;
            }, 600); // match CSS transition time
          }

        }, delay);
        delay += 30;
      }
    };

    /* ===== GO END ===== */
    window.goEnd = () => {
      if (isBusy) return;
      if (index >= total) return;

      isBusy = true;

      let delay = 0;
      const startIndex = index;

      for (let i = startIndex; i < total; i++) {
        setTimeout(() => {
          const p = pages[i];
          p.classList.add("flipping-right");
          p.classList.add("turn");
          index = i + 1;
          updateIndicator();

          if (i === total - 1) {
            setTimeout(() => {
              isBusy = false;
            }, 600);
          }

        }, delay);
        delay += 30;
      }
    };

    /* ===== TAP NAV ===== */
    book.addEventListener("click", (e) => {
      if (isBusy) return;

      const r = book.getBoundingClientRect();
      e.clientX - r.left > r.width / 2 ? next() : prev();
    });

    /* ===== AUTO FIX ===== */
    window._isBusyRef = () => isBusy;
  }

  /* ===== FX ===== */
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

/* ===== UI Helpers ===== */

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
    autoTimer = setInterval(() => {
      if (!window._isBusyRef?.()) next();
    }, 4000);
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
}    if (backImg) {
      const img = new Image();
      img.src = IMAGE_BASE_PATH + backImg;
      img.decoding = "async";
      back.appendChild(img);
      imageDecodeQueue.push(img.decode().catch(() => {}));
    }

    page.append(front, back);
    book.appendChild(page);

    // CLEANUP: Remove *both* flipping classes when animation ends
    page.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        page.classList.remove('flipping-right', 'flipping-left');
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

    // === SETUP Z-INDEX VARIABLES ===
    pages.forEach((page, i) => {
      // 1. Assign Index for CSS Calculation
      page.style.setProperty('--i', i);

      // 2. Resting States
      const zRight = total - i; // Page 0 on top
      const zLeft = i + 1;      // Page 0 on bottom
      
      page.style.setProperty('--z-right', zRight);
      page.style.setProperty('--z-left', zLeft);
    });

    function updateIndicator() {
      indicator.textContent = `${Math.min(index * 2, TOTAL_CONTENT_IMAGES)} / ${TOTAL_CONTENT_IMAGES}`;
    }

    updateIndicator();

    // --- NEXT (Forward) ---
    window.next = () => {
      if (index >= total) return;
      
      const p = pages[index];
      // Use Right-Flipping stack (Desc order)
      p.classList.add("flipping-right");
      p.classList.add("turn");
      
      index++;
      updateIndicator();
    };

    // --- PREV (Backward) ---
    window.prev = () => {
      if (index <= 0) return;
      
      index--;
      const p = pages[index];
      // Use Left-Flipping stack (Asc order)
      p.classList.add("flipping-left");
      p.classList.remove("turn");
      
      updateIndicator();
    };

    // --- GO START (Fast Rewind) ---
    window.goStart = () => {
      if (index === 0) return;
      
      // Start immediately (delay 0) so the first page doesn't "jump"
      let delay = 0; 
      
      for (let i = index - 1; i >= 0; i--) {
        // Capture 'i' in closure
        setTimeout(() => {
           // Direct manipulation for performance
           index = i;
           const p = pages[i];
           p.classList.add("flipping-left");
           p.classList.remove("turn");
           updateIndicator();
        }, delay);
        delay += 30; // 30ms stagger
      }
    };

    // --- GO END (Fast Forward) ---
    window.goEnd = () => {
      if (index >= total) return;
      
      let delay = 0;
      
      for (let i = index; i < total; i++) {
        setTimeout(() => {
           const p = pages[i];
           p.classList.add("flipping-right");
           p.classList.add("turn");
           // Correctly update index at the end of loop logic
           index = i + 1; 
           updateIndicator();
        }, delay);
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
