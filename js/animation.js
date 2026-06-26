// ----------------------
// animations.js
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("animation-container");
  if (!container) return;

  let matrixInterval = null;
  let fireworkInterval = null;

  // ----------------------
  // Helpers
  // ----------------------
  function clearContainer() {
    container.innerHTML = "";

    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }

    if (fireworkInterval) {
      clearInterval(fireworkInterval);
      fireworkInterval = null;
    }
  }

  function randomCharFrom(text) {
    return text.charAt(Math.floor(Math.random() * text.length));
  }

  function getFireworkTargetArea(mode = "ambient") {
    if (mode === "victory") {
      const output = document.getElementById("output");

      if (output) {
        return output.getBoundingClientRect();
      }
    }

    // Ambient America fireworks stay near the top of the screen.
    return {
      left: window.innerWidth * 0.08,
      top: window.innerHeight * 0.05,
      width: window.innerWidth * 0.84,
      height: window.innerHeight * 0.28
    };
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
      flake.style.animationDuration = 5 + Math.random() * 10 + "s";
      flake.style.width = flake.style.height = 5 + Math.random() * 10 + "px";
      flake.style.animationDelay = Math.random() * 15 + "s";

      container.appendChild(flake);
    }
  }

  // ----------------------
  // MATRIX RAIN ANIMATION
  // ----------------------
  function startMatrixRain() {
    clearContainer();

    const letters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789日Z:・.=*+-<>¦|";

    function randomChar() {
      return randomCharFrom(letters);
    }

    function createRainColumn(xPosition) {
      const column = document.createElement("div");
      column.style.position = "absolute";
      column.style.left = `${xPosition}px`;
      container.appendChild(column);

      const baseFontSize = 20 + Math.floor(Math.random() * 3);
      const charHeight = baseFontSize;
      const columnSpeed = 1 + Math.random() * 3;
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

        if (Math.random() < 0.9) {
          span.style.transform = "scaleX(-1)";
        }

        span.style.textShadow =
          "0 0 6px #00ff41, 0 0 12px #00ff41, 0 0 18px #00ff41";

        column.appendChild(span);
        spans.push(span);
      }

      let isActive = true;

      function updateColumn() {
        if (!isActive) {
          if (Math.random() < 0.02) {
            headY = -trailLength * charHeight;
            isActive = true;
          }
        } else {
          headY += columnSpeed;

          spans.forEach((span, idx) => {
            const y = headY - idx * charHeight;
            span.style.top = `${y}px`;

            if (idx === 0) {
              span.style.color = "#ffffff";
            } else {
              const t = idx / trailLength;
              const green = Math.floor(255 * Math.pow(1 - t, 2));
              span.style.color = `rgb(0, ${green}, 0)`;
            }

            if (Math.random() < 0.01) {
              span.textContent = randomChar();
            }
          });

          if (
            headY - trailLength * charHeight > window.innerHeight &&
            Math.random() < 0.05
          ) {
            isActive = false;
          }
        }

        requestAnimationFrame(updateColumn);
      }

      requestAnimationFrame(updateColumn);
    }

    const columnWidth = 32;

    for (let x = 0; x < window.innerWidth; x += columnWidth) {
      createRainColumn(x);
    }
  }

  // ----------------------
  // AMERICA STARS + FIREWORKS
  // ----------------------
  function startAmerica() {
    clearContainer();

    startStars();

    launchFireworks({
      mode: "ambient",
      burstCount: 1
    });

    fireworkInterval = setInterval(() => {
      launchFireworks({
        mode: "ambient",
        burstCount: 1
      });
    }, 1700);
  }

  function startStars() {
    const STAR_COUNT = 120;

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const size = 1 + Math.random() * 3;

      star.style.left = Math.random() * 100 + "vw";
      star.style.top = Math.random() * 100 + "vh";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.animationDelay = Math.random() * 4 + "s";

      container.appendChild(star);
    }
  }

  function launchFireworks(options = {}) {
    const mode = options.mode || "ambient";
    const burstCount = options.burstCount || 1;
    const dramatic = mode === "victory";

    for (let burst = 0; burst < burstCount; burst++) {
      setTimeout(() => {
        const target = getFireworkTargetArea(mode);

        const x = target.left + target.width * (0.15 + Math.random() * 0.7);
        const y = target.top + target.height * (0.15 + Math.random() * 0.7);

        const PARTICLES = dramatic ? 95 : 42;
        const MIN_DISTANCE = dramatic ? 90 : 55;
        const MAX_DISTANCE = dramatic ? 190 : 85;

        for (let i = 0; i < PARTICLES; i++) {
          const particle = document.createElement("div");
          particle.classList.add("firework-particle");

          if (dramatic) {
            particle.classList.add("victory-firework");

            // Make victory sparks solid glowing red/white/blue immediately.
            const victoryColors = ["#ff1f1f", "#ffffff", "#2f6bff"];
            const color = victoryColors[i % victoryColors.length];
            
            particle.style.backgroundColor = color;
            particle.style.color = color;
            particle.style.opacity = "1";
            particle.style.boxShadow = `
              0 0 8px ${color},
              0 0 18px ${color},
              0 0 32px ${color},
              0 0 52px ${color}
            `;
          }

          const angle = (Math.PI * 2 * i) / PARTICLES;
          const distance =
            MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE);

          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.setProperty("--dx", Math.cos(angle) * distance);
          particle.style.setProperty("--dy", Math.sin(angle) * distance);

          container.appendChild(particle);

          setTimeout(() => {
            particle.remove();
          }, dramatic ? 2800 : 2000);
        }
      }, burst * 280);
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
    } else if (type === "america" || type === "fireworks") {
      startAmerica();
    }
  }

  window.startAnimation = startAnimation;
  window.launchFireworks = launchFireworks;
});
