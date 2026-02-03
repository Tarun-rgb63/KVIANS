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
