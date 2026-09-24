"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const can = document.querySelector(".can");

  if (!can) return;

  // Keep the hero can rotating as a visual product showcase.
  can.setAttribute("role", "img");
  can.setAttribute("aria-label", "Rotating Duff can");

  // Pause briefly while the visitor points at the can so the 3D shape
  // can be inspected more easily.
  can.addEventListener("mouseenter", () => {
    can.style.animationPlayState = "paused";
  });

  can.addEventListener("mouseleave", () => {
    can.style.animationPlayState = "running";
  });
});
