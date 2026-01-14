// ----------------------
// animations.js
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("animation-container");
  if (!container) return;

  let matrixInterval = null;

  // ----------------------
  // Helpers
  // ----------------------
  function clearContainer() {
    container.innerHTML = "";
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
  }

  // ----------------------
  // SNOWFLAKE ANIMATION
  // ----------------------
  function startSnowflakes() {
    clearContainer();
    const SNOWFLAKES = 50;

    for (let i = 0; i < SNOWFLAKES; i++) {
      const flake = document.createElement("div");
      flake.classList.add("snowflake");

      flake.style.left = Math.random() * 100 + "vw";
      flake.style.animationDuration = (5 + Math.random() * 10) + "s";
      flake.style.width = flake.style.height = (5 + Math.random() * 10) + "px";
      flake.style.animationDelay = Math.random() * 15 + "s";

      container.appendChild(flake);
    }
  }

// ----------------------
// MATRIX DIGITAL RAIN (optimized)
// ----------------------
function startMatrixRain() {
  clearContainer(); // remove previous animations
  const letters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789日Z:・.=*+-<>¦|";

  function randomChar() {
    return letters.charAt(Math.floor(Math.random() * letters.length));
  }

  function createRainColumn(xPosition) {
    const column = document.createElement("div");
    column.style.position = "absolute";
    column.style.left = `${xPosition}px`;

    const columnSpeed = 3 + Math.random() * 2; // 3–5s per fall
    const numChars = 30;
    const charHeight = 14;

    const spans = [];

    for (let i = 0; i < numChars; i++) {
      const span = document.createElement("span");
      span.classList.add("rain");
      span.textContent = randomChar();
      span.style.top = `${i * charHeight}px`;

      // horizontal flip 90% of the time
      if (Math.random() < 0.9) {
        span.style.transform = "scaleX(-1)";
      }

      // staggered animation start
      span.style.animationDelay = `${Math.random() * 5}s`;
      span.style.animationDuration = `${columnSpeed}s`;
      span.style.animationName = "matrix-rain";

      column.appendChild(span);
      spans.push(span);
    }

    container.appendChild(column);

    // Each column has its own update loop
    function updateColumn() {
      spans.forEach(span => {
        if (Math.random() < 0.3) { // ~30% chance to change per frame
          span.textContent = randomChar();
        }
      });
      requestAnimationFrame(updateColumn);
    }
    requestAnimationFrame(updateColumn);
  }

  const columnWidth = 14;
  for (let x = 0; x < window.innerWidth; x += columnWidth) {
    createRainColumn(x);
  }
}

  // ----------------------
  // MAIN ENTRY
  // ----------------------
  function startAnimation(type) {
    if (type === "snow") {
      startSnowflakes();
    } else if (type === "matrix-rain") {
      startMatrixRain();
    }
  }

  // ----------------------
  // Auto-start based on theme (optional)
  // ----------------------
  // You can set a data-attribute on body, e.g., <body data-theme="matrix">
  const theme = document.body.dataset.theme || "matrix-rain";
  startAnimation(theme);

  // Expose for manual control if needed
  window.startAnimation = startAnimation;
});

