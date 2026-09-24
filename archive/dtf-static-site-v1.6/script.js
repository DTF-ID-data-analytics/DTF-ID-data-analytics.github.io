(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeButtons = document.querySelectorAll(".themeButton");
  const yearSpans = document.querySelectorAll(".year");

  let pointerX = window.innerWidth / 2;
  let animationFrame = null;
  let manualTheme = "split";

  // Dynamic Year Calculation
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = currentYear;
  });

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

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (manualTheme === "split") {
        manualTheme = "light";
        body.classList.remove("mode-dark");
        body.classList.add("mode-light");
        updateButtons("☀", "Light");
      } else if (manualTheme === "light") {
        manualTheme = "dark";
        body.classList.remove("mode-light");
        body.classList.add("mode-dark");
        updateButtons("☾", "Dark");
      } else {
        manualTheme = "split";
        body.classList.remove("mode-light", "mode-dark");
        setSplit(pointerX);
        updateButtons("◐", "Theme");
      }
    });
  });

  function updateButtons(icon, text) {
    themeButtons.forEach(btn => {
      btn.querySelector(".themeIcon").textContent = icon;
      btn.querySelector("span").textContent = text;
    });
  }

  // Initialise split view
  setSplit(pointerX);
})();
