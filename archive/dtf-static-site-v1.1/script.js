(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.getElementById("themeButton");
  const themeIcon = document.getElementById("themeIcon");
  const year = document.getElementById("year");

  let pointerX = window.innerWidth / 2;
  let animationFrame = null;
  let manualTheme = "split";

  year.textContent = new Date().getFullYear();

  function setSplit(x) {
    const clamped = Math.max(0, Math.min(window.innerWidth, x));
    root.style.setProperty("--mx", `${clamped}px`);
  }

  function followPointer(x) {
    pointerX = x;

    if (manualTheme !== "split") return;

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(() => {
        setSplit(pointerX);
        animationFrame = null;
      });
    }
  }

  window.addEventListener("pointermove", event => {
    followPointer(event.clientX);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (manualTheme === "split") setSplit(pointerX);
  });

  themeButton.addEventListener("click", () => {
    if (manualTheme === "split") {
      manualTheme = "light";
      body.classList.remove("split-active");
      root.style.setProperty("--mx", "0px");
      themeIcon.textContent = "☀";
      themeButton.querySelector("span").textContent = "Light";
    } else if (manualTheme === "light") {
      manualTheme = "dark";
      root.style.setProperty("--mx", `${window.innerWidth}px`);
      themeIcon.textContent = "☾";
      themeButton.querySelector("span").textContent = "Dark";
    } else {
      manualTheme = "split";
      body.classList.add("split-active");
      setSplit(pointerX);
      themeIcon.textContent = "◐";
      themeButton.querySelector("span").textContent = "Theme";
    }
  });

  // Initialise the split interaction.
  body.classList.add("split-active");
  setSplit(pointerX);
})();
