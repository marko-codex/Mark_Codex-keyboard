document.addEventListener("DOMContentLoaded", () => {
  const keyboard = document.querySelector(".keyboard");
  const typingDisplay = document.querySelector(".typing-display");
  const toggleButton = document.querySelector(".keyboard-toggle");
  let shiftPressed = false;
  let capsLockActive = false;
  let currentText = "";
  let isPhysicalKeyboard = false;
  
  const animateKey = (keyChar) => {
    const keyElement = Array.from(document.querySelectorAll(".key")).find(
      (key) => {
        const mainChar = key.querySelector(".main-char");
        return (
          mainChar &&
          mainChar.textContent.toLowerCase() === keyChar.toLowerCase()
        );
      }
    );

    if (keyElement) {
      keyElement.classList.add("pressed");
      setTimeout(() => {
        keyElement.classList.remove("pressed");
      }, 150);
    }
  };

  const animateSpecialKey = (keyName) => {
    let selector;
    switch (keyName) {
      case "Backspace":
        selector = '.key.special:contains("⌫")';
        break;
      case "Enter":
        selector = '.key.special:contains("Enter")';
        break;
      case "Shift":
        selector = '.key.special:contains("Shift")';
        break;
      case "Control":
        selector = '.key.special:contains("Ctrl")';
        break;
      case "Alt":
        selector = '.key.special:contains("Alt")';
        break;
      case "Escape":
        selector = ".key.escape";
        break;
      case " ":
        selector = ".key.space";
        break;
      case "CapsLock":
        selector = '.key.special:contains("Caps")';
        break;
    }

    if (selector) {
      const keys = document.querySelectorAll(selector);
      keys.forEach((key) => {
        key.classList.add("pressed");
        setTimeout(() => {
          key.classList.remove("pressed");
        }, 150);
      });
    }
  };

  const updateDisplay = () => {
    typingDisplay.textContent = currentText + "▋";
  };

  toggleButton.addEventListener("click", () => {
    isPhysicalKeyboard = !isPhysicalKeyboard;
    toggleButton.textContent = ` Keyboard Mode: ${
      isPhysicalKeyboard ? "Physical" : "Virtual"
    }`;
    toggleButton.classList.toggle("active");
    keyboard.style.opacity = isPhysicalKeyboard ? "1" : "1";
    if (isPhysicalKeyboard) {
      typingDisplay.focus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!isPhysicalKeyboard) return;

    if (e.key === "Shift") {
      shiftPressed = true;
      keyboard.classList.add("shift-active");
      animateSpecialKey("Shift");
    } else if (e.key === "CapsLock") {
      capsLockActive = !capsLockActive;
      animateSpecialKey("CapsLock");
    } else if (e.key === "Backspace") {
      currentText = currentText.slice(0, -1);
      animateSpecialKey("Backspace");
    } else if (e.key === "Escape") {
      currentText = "";
      animateSpecialKey("Escape");
    } else if (e.key === "Enter") {
      currentText += "\n";
      animateSpecialKey("Enter");
    } else if (e.key === " ") {
      currentText += " ";
      animateSpecialKey(" ");
    } else if (e.key === "Control") {
      animateSpecialKey("Control");
    } else if (e.key === "Alt") {
      animateSpecialKey("Alt");
    } else if (e.key.length === 1) {
      let char = e.key;
      if (capsLockActive || shiftPressed) {
        char = char.toUpperCase();
      } else {
        char = char.toLowerCase();
      }
      currentText += char;
      animateKey(char);
    }

    updateDisplay();
    e.preventDefault();
  });

  document.addEventListener("keyup", (e) => {
    if (!isPhysicalKeyboard) return;

    if (e.key === "Shift") {
      shiftPressed = false;
      keyboard.classList.remove("shift-active");
    }
  });

  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("mousedown", () => {
      if (isPhysicalKeyboard) return;

      key.classList.add("pressed");

      if (key.textContent === "Shift") {
        shiftPressed = true;
        keyboard.classList.add("shift-active");
      } else if (key.textContent === "Caps") {
        capsLockActive = !capsLockActive;
        key.classList.toggle("active");
      } else if (key.textContent === "⌫") {
        currentText = currentText.slice(0, -1);
      } else if (key.textContent === "Esc") {
        currentText = "";
      } else if (key.textContent === "Enter") {
        currentText += "\n";
      } else if (key.classList.contains("space")) {
        currentText += " ";
      } else if (
        !key.classList.contains("special") &&
        !key.classList.contains("function")
      ) {
        const shiftChar = key.querySelector(".shift-char");
        const mainChar = key.querySelector(".main-char");

        if (shiftPressed && shiftChar) {
          currentText += shiftChar.textContent;
        } else if (mainChar) {
          let char = mainChar.textContent;
          if (capsLockActive) {
            char = shiftPressed ? char.toLowerCase() : char.toUpperCase();
          } else {
            char = shiftPressed ? char.toUpperCase() : char.toLowerCase();
          }
          currentText += char;
        }
      }

      updateDisplay();
    });

    key.addEventListener("mouseup", () => {
      if (isPhysicalKeyboard) return;

      key.classList.remove("pressed");

      if (key.textContent === "Shift") {
        shiftPressed = false;
        keyboard.classList.remove("shift-active");
      }
    });

    key.addEventListener("mouseleave", () => {
      if (isPhysicalKeyboard) return;
      key.classList.remove("pressed");
    });
  });

  keyboard.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  typingDisplay.addEventListener("click", () => {
    if (isPhysicalKeyboard) {
      typingDisplay.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!typingDisplay.contains(e.target) && isPhysicalKeyboard) {
      typingDisplay.style.outline = "none";
    }
  });

  updateDisplay();
});
