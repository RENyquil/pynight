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
    column.style.top = `-${Math.random() * 50}px`; 
    column.style.display = "flex";
    column.style.flexDirection = "column";

    const charHeight = 18; 
    const columnHeight = window.innerHeight + 200;
    const numChars = Math.ceil(columnHeight / charHeight);

    const spans = [];

    for (let i = 0; i < numChars; i++) {
      const span = document.createElement("span");
      span.classList.add("rain");
      span.textContent = randomChar();
      span.style.display = "block";
      span.style.height = `${charHeight}px`;

      if (Math.random() < 0.9) {
        span.style.transform = "scaleX(-1)";
      }

      column.appendChild(span);
      spans.push(span);
    }

    container.appendChild(column);

    // ----------------------
    // Per-column speed variation (consistent)
    // ----------------------
    const columnSpeed = 1 + Math.random() * 3; // pixels per frame
    let columnOffset = -Math.random() * 50; // start slightly above
    let trailLength = Math.floor(Math.random() * 10 + 10);

    function updateColumn() {
      columnOffset += columnSpeed; // consistent per column
      column.style.top = `${columnOffset}px`;

      // dynamic gradient trail
      for (let i = 0; i < spans.length; i++) {
        const relativeIndex = i - Math.floor(columnOffset / charHeight);
        if (relativeIndex === 0) {
          spans[i].style.color = "#ffffff"; // head white
        } else if (relativeIndex > 0 && relativeIndex < trailLength) {
          const brightness = 1 - relativeIndex / trailLength;
          const greenValue = Math.floor(255 * brightness);
          spans[i].style.color = `rgb(0, ${greenValue}, 0)`;
        } else {
          spans[i].style.color = "rgb(0,0,0)"; // invisible
        }
      }

      // random character updates (~5%)
      spans.forEach(span => {
        if (Math.random() < 0.05) {
          span.textContent = randomChar();
        }
      });

      // occasionally end the column trail and restart
      if (columnOffset > window.innerHeight + Math.random() * 200) {
        columnOffset = -Math.random() * 50;
        trailLength = Math.floor(Math.random() * 10 + 10);
      }

      requestAnimationFrame(updateColumn);
    }

    requestAnimationFrame(updateColumn);
  }

  // ----------------------
  // Fill screen with wider columns
  // ----------------------
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







