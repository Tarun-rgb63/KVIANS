const IMAGE_BASE_PATH = "../media/";
const MUSIC_BASE_PATH = "../media/";

window.addEventListener("DOMContentLoaded", () => {

  const pages = document.querySelectorAll(".page");
  const indicator = document.getElementById("pageIndicator");
  const book = document.querySelector(".book");
  const total = pages.length;

  /* LOAD IMAGES */
  pages.forEach(p => {
    const img = p.querySelector("img");
    img.src = IMAGE_BASE_PATH + img.dataset.img;
  });

  let index = 0;
  pages[0].classList.add("active");

  function updateIndicator() {
    indicator.textContent = `${index + 1} / ${total}`;
  }

  function goTo(newIndex) {
    if (newIndex < 0 || newIndex >= total || newIndex === index) return;

    const current = pages[index];
    const next = pages[newIndex];

    current.classList.remove("active");
    current.classList.add("hide");

    next.classList.remove("hide");
    next.classList.add("active");

    index = newIndex;
    updateIndicator();
  }

  /* BUTTON CONTROLS */
  window.next = () => goTo(index + 1);
  window.prev = () => goTo(index - 1);
  window.goStart = () => goTo(0);
  window.goEnd = () => goTo(total - 1);

  updateIndicator();

  /* TAP LEFT / RIGHT ON BOOK */
  if (book) {
    book.addEventListener("click", (e) => {
      const rect = book.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x < rect.width / 2) {
        prev();   // LEFT HALF
      } else {
        next();   // RIGHT HALF
      }
    });
  }

  /* MUSIC */
  const musicEl = document.getElementById("bgMusic");
  const src = musicEl.querySelector("source[data-music]");
  src.src = MUSIC_BASE_PATH + src.dataset.music;
  musicEl.load();

  let musicPlaying = false;
  window.toggleMusic = () => {
    musicPlaying ? musicEl.pause() : musicEl.play();
    musicEl.volume = 0.4;
    musicPlaying = !musicPlaying;
  };

  /* FALLING FLOWERS */
  const fallLayer = document.querySelector(".fall-layer");
  if (fallLayer) {
    const symbols = ["🌸", "🌼", "❤️", "💖"];
    const rand = (a, b) => Math.random() * (b - a) + a;

    setInterval(() => {
      const el = document.createElement("div");
      el.className = "fall-item";
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = rand(5, 95) + "vw";
      el.style.fontSize = rand(18, 26) + "px";
      el.style.animationDuration = rand(10, 18) + "s";
      fallLayer.appendChild(el);
      setTimeout(() => el.remove(), 20000);
    }, 1200);
  }

});

/* UI TOGGLE */
let uiVisible = true;
function toggleUI() {
  uiVisible = !uiVisible;
  document.body.classList.toggle("ui-hidden", !uiVisible);
  document.getElementById("eyeToggle").textContent = uiVisible ? "👁" : "🙈";
}
