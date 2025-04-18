document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");

  const shortcuts = {
    "/frac": "\\frac{}{}",
    "/sum": "\\sum_{i=1}^{n}",
    "/int": "\\int_{a}^{b}",
    "/sqrt": "\\sqrt{}",
    "/alpha": "\\alpha",
    "/beta": "\\beta",
    "/pi": "\\pi",
  };

  function handleInput(event) {
    const input = event.target;
    const text = input.value;

    for (const [shortcut, replacement] of Object.entries(shortcuts)) {
      if (text.includes(shortcut)) {
        input.value = text.replace(shortcut, replacement);

        const cursorPos = input.value.indexOf("{}") + 1;
        if (cursorPos > 0) {
          input.setSelectionRange(cursorPos, cursorPos);
        }
      }
    }
  }

  function handleKeyDown(event) {
    if (event.ctrlKey && event.key === "c") {
      if (event.target.selectionStart !== event.target.selectionEnd) {
        return;
      }
      event.preventDefault();
      navigator.clipboard
        .writeText(event.target.value)
        .then(() => {
          const info = document.getElementById("info");
          info.textContent = "LaTeX copied to clipboard!";
          setTimeout(() => {
            info.textContent = "";
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  }

  const textInput = document.createElement("textarea");
  textInput.style.width = "100%";
  textInput.style.height = "200px";
  textInput.style.marginTop = "20px";
  textInput.placeholder =
    "Type your LaTeX here. Try shortcuts like /frac, /sum, /int...";

  textInput.addEventListener("input", handleInput);
  textInput.addEventListener("keydown", handleKeyDown);

  const preview = document.createElement("div");
  preview.style.marginTop = "20px";
  preview.style.padding = "10px";
  preview.style.border = "1px solid #ccc";
  preview.style.minHeight = "100px";

  const quitBtn = document.createElement("button");
  quitBtn.style.position = "absolute";
  quitBtn.style.top = "10px";
  quitBtn.style.right = "10px";
  container.appendChild(textInput);
  container.appendChild(preview);

  textInput.addEventListener("input", () => {
    preview.innerHTML = `\\[${textInput.value}\\]`;
    MathJax.typesetPromise([preview]).catch((err) => console.log(err));
  });
});
