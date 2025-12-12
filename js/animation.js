// animation.js
const container = document.getElementById("animation-container");
const SNOWFLAKES = 50; // number of snowflakes

for (let i = 0; i < SNOWFLAKES; i++) {
  const flake = document.createElement("div");
  flake.classList.add("snowflake");

  // random horizontal start position (0% - 100%)
  flake.style.left = Math.random() * 100 + "vw";

  // random animation duration (5s - 15s)
  flake.style.animationDuration = (5 + Math.random() * 10) + "s";

  // random size
  flake.style.width = flake.style.height = (5 + Math.random() * 10) + "px";

  // random delay to spread them out
  flake.style.animationDelay = Math.random() * 15 + "s";

  container.appendChild(flake);
}
