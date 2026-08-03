const sheetLayer = document.querySelector(".sheet-layer");
const downloadSheet = document.querySelector(".download-sheet");
const closeButton = document.querySelector(".close-button");
const backdrop = document.querySelector(".backdrop");
const getButton = document.querySelector(".get-button");
const dragZone = document.querySelector(".drag-zone");
const openButtons = document.querySelectorAll("[data-open-sheet]");

let dragStartY = null;
let dragY = 0;

function setSheetControlsEnabled(enabled) {
  const tabIndex = enabled ? 0 : -1;
  closeButton.tabIndex = tabIndex;
  backdrop.tabIndex = tabIndex;
  getButton.tabIndex = tabIndex;
}

function openSheet() {
  sheetLayer.classList.add("is-open");
  sheetLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("sheet-open");
  setSheetControlsEnabled(true);

  window.setTimeout(() => {
    closeButton.focus();
  }, 420);
}

function closeSheet() {
  sheetLayer.classList.remove("is-open");
  sheetLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sheet-open");
  downloadSheet.style.transform = "";
  dragY = 0;
  setSheetControlsEnabled(false);
}

openButtons.forEach((button) => {
  button.addEventListener("click", openSheet);
});

closeButton.addEventListener("click", closeSheet);
backdrop.addEventListener("click", closeSheet);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sheetLayer.classList.contains("is-open")) {
    closeSheet();
  }
});

dragZone.addEventListener("pointerdown", (event) => {
  dragStartY = event.clientY;
  dragZone.setPointerCapture(event.pointerId);
});

dragZone.addEventListener("pointermove", (event) => {
  if (dragStartY === null) return;

  dragY = Math.max(0, event.clientY - dragStartY);
  downloadSheet.style.transform = `translateY(${dragY}px)`;
});

function finishDrag() {
  if (dragStartY === null) return;

  if (dragY > 76) {
    closeSheet();
  } else {
    downloadSheet.style.transform = "";
  }

  dragStartY = null;
  dragY = 0;
}

dragZone.addEventListener("pointerup", finishDrag);
dragZone.addEventListener("pointercancel", finishDrag);

window.addEventListener("load", () => {
  window.setTimeout(openSheet, 480);
});
