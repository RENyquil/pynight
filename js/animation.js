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

  function getFireworkTargetArea() {
    const output = document.getElementById("output");

    if (output) {
      return output.getBoundingClientRect();
    }

    const challengeArea = document.querySelector(".card.challenge");
    if (challengeArea) {
      return challengeArea.getBoundingClientRect();
    }

    return {
      left: window.innerWidth * 0.25,
      top: window.innerHeight * 0.55,
      width: window.innerWidth * 0.5,
      height: window.innerHeight * 0.25
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
  // AMERICA FIREWORKS + STARS
  // ----------------------
  function startAmerica() {
    clearContainer();

    startStars();
    launchFireworks();

    fireworkInterval = setInterval(() => {
      launchFireworks();
    }, 1200);
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

  function launchFireworks() {
    const target = getFireworkTargetArea();

    const x = target.left + target.width * (0.25 + Math.random() * 0.5);
    const y = target.top + target.height * (0.15 + Math.random() * 0.7);

    const PARTICLES = 42;

    for (let i = 0; i < PARTICLES; i++) {
      const particle = document.createElement("div");
      particle.classList.add("firework-particle");

      const angle = (Math.PI * 2 * i) / PARTICLES;
      const distance = 55 + Math.random() * 85;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty("--dx", Math.cos(angle) * distance);
      particle.style.setProperty("--dy", Math.sin(angle) * distance);

      container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 2000);
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
