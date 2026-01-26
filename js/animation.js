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
  
      const baseFontSize = 20 + Math.floor(Math.random() * 3); // larger base font for fewer columns
      const charHeight = baseFontSize;
      const columnSpeed = 1 + Math.random() * 3; // pixels per frame
      const trailLength = Math.floor(Math.random() * 15 + 15);
      let headY = -Math.random() * 50;
  
      const spans = [];
      for (let i = 0; i < trailLength; i++) {
        const span = document.createElement("span");
        span.classList.add("rain");
        span.textContent = randomChar();
        span.style.position = "absolute";
        span.style.top = `${-i * charHeight}px`;
        span.style.fontSize = `${baseFontSize}px`;
        span.style.fontFamily = '"Courier New", monospace';
        if (Math.random() < 0.9) span.style.transform = "scaleX(-1)";
        span.style.textShadow = "0 0 6px #00ff41, 0 0 12px #00ff41, 0 0 18px #00ff41";
  
        column.appendChild(span);
        spans.push(span);
      }
  
      let isActive = true; // for random termination
  
      function updateColumn() {
        if (!isActive) {
          // small chance to restart column
          if (Math.random() < 0.02) {
            headY = -trailLength * charHeight;
            isActive = true;
          }
        } else {
          headY += columnSpeed;
  
          spans.forEach((span, idx) => {
            const y = headY - idx * charHeight;
            span.style.top = `${y}px`;
  
            // gradient trail: head white, trailing green
            if (idx === 0) {
              span.style.color = "#ffffff"; // head
            } else {
              const t = idx / trailLength;
              const green = Math.floor(255 * Math.pow(1 - t, 2));
              span.style.color = `rgb(0, ${green}, 0)`;
            }
  
            // occasional character change (~1%)
            if (Math.random() < 0.01) span.textContent = randomChar();
          });
  
          // end the column randomly before reaching bottom
          if (headY - trailLength * charHeight > window.innerHeight && Math.random() < 0.05) {
            isActive = false;
          }
        }
  
        requestAnimationFrame(updateColumn);
      }
  
      requestAnimationFrame(updateColumn);
    }
  
    // fewer columns due to larger font
    const columnWidth = 32; // wider columns
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
  // Auto-start based on theme
  // ----------------------
  const THEME_ANIMATIONS = {
  matrix: "matrix-rain",
  diehard: "snow",
  default: null
  };

  const theme = document.body.dataset.theme || "default";
  const animation = THEME_ANIMATIONS[theme] || null;
  
  if (animation) {
    startAnimation(animation);
  } else {
    clearContainer(); // no animation
  }

  // Expose for manual control if needed
  window.startAnimation = startAnimation;
});
















