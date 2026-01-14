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

function startMatrixRain() {
  clearContainer();

  const letters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789日Z:・.=*+-<>¦|";

  function randomChar() {
    return letters.charAt(Math.floor(Math.random() * letters.length));
  }

  function createRainColumn(xPosition) {
    const column = document.createElement("div");
    column.style.position = "absolute";
    column.style.left = `${xPosition}px`;
    container.appendChild(column);

    const charHeight = 18;
    const columnHeight = window.innerHeight + 200;
    const trailLength = Math.floor(Math.random() * 15 + 15);
    const columnSpeed = 1 + Math.random() * 3; // pixels per frame
    let headY = -Math.random() * 50; // start above screen

    // Create spans for visible trail
    const spans = [];
    for (let i = 0; i < trailLength; i++) {
      const span = document.createElement("span");
      span.classList.add("rain");
      span.textContent = randomChar();
      span.style.position = "absolute";
      span.style.top = `${-i * charHeight}px`; // stack vertically upward
      span.style.fontSize = `${charHeight}px`;
      span.style.fontFamily = '"Courier New", monospace';

      if (Math.random() < 0.9) span.style.transform = "scaleX(-1)";
      column.appendChild(span);
      spans.push(span);
    }

    function updateColumn() {
      headY += columnSpeed;

      // move each span relative to head
      spans.forEach((span, idx) => {
        const y = headY - idx * charHeight;
        span.style.top = `${y}px`;

        // update color: head white, trail fading smoothly
        if (idx === 0) {
          span.style.color = "#ffffff"; // head white
        } else {
          const t = idx / trailLength;
          const green = Math.floor(255 * Math.pow(1 - t, 2));
          span.style.color = `rgb(0, ${green}, 0)`;
        }

        // occasional character change (~5%)
        if (Math.random() < 0.05) span.textContent = randomChar();
      });

      // restart column if it goes off screen
      if (headY - trailLength * charHeight > window.innerHeight) {
        headY = -Math.random() * 50;
      }

      requestAnimationFrame(updateColumn);
    }

    requestAnimationFrame(updateColumn);
  }

  // wider columns, fewer total
  const columnWidth = 24;
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








