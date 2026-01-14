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

    const baseFontSize = 20 + Math.floor(Math.random() * 3); // slightly varied font
    const charHeight = baseFontSize;
    const columnSpeed = 1 + Math.random() * 3; // pixels per frame
    const maxTrailLength = 30; // max number of visible characters
    const totalSpans = 60; // total spans to recycle
    let headY = -Math.random() * 50;

    // pre-create spans
    const spans = [];
    for (let i = 0; i < totalSpans; i++) {
      const span = document.createElement("span");
      span.classList.add("rain");
      span.textContent = randomChar();
      span.style.position = "absolute";
      span.style.top = `${-i * charHeight}px`;
      span.style.fontSize = `${baseFontSize}px`;
      span.style.fontFamily = '"Courier New", monospace';
      if (Math.random() < 0.9) span.style.transform = "scaleX(-1)";
      span.style.textShadow = "0 0 8px #00ff41, 0 0 12px #00ff41, 0 0 16px #00ff41";
      column.appendChild(span);
      spans.push(span);
    }

    let isActive = true;

    function updateColumn() {
      if (!isActive) {
        // small chance to restart
        if (Math.random() < 0.02) {
          headY = -maxTrailLength * charHeight;
          isActive = true;
        }
      } else {
        headY += columnSpeed;

        // move spans relative to head
        spans.forEach((span, idx) => {
          const relativeIndex = idx - Math.floor(headY / charHeight);
          if (relativeIndex < 0 || relativeIndex >= maxTrailLength) {
            span.style.display = "none"; // hide spans outside visible trail
          } else {
            span.style.display = "block";
            const y = headY - idx * charHeight;
            span.style.top = `${y}px`;

            // gradient: head white, trailing green
            if (relativeIndex === 0) {
              span.style.color = "#ffffff";
            } else {
              const t = relativeIndex / maxTrailLength;
              const green = Math.floor(255 * Math.pow(1 - t, 2));
              span.style.color = `rgb(0, ${green}, 0)`;
            }

            // occasional character change (~1%)
            if (Math.random() < 0.01) span.textContent = randomChar();
          }
        });

        // randomly terminate column before bottom
        if (headY - maxTrailLength * charHeight > window.innerHeight && Math.random() < 0.05) {
          isActive = false;
        }
      }

      requestAnimationFrame(updateColumn);
    }

    requestAnimationFrame(updateColumn);
  }

  // wider columns for performance
  const columnWidth = 28;
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












