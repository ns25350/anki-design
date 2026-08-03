const sheetLayer = document.querySelector(".sheet-layer");
const downloadSheet = document.querySelector(".download-sheet");
const closeButton = document.querySelector(".close-button");
const backdrop = document.querySelector(".backdrop");
const getButton = document.querySelector(".get-button");
const dragZone = document.querySelector(".drag-zone");
const openButtons = document.querySelectorAll("[data-open-sheet]");
const ankiCard = document.querySelector(".anki-card");
const answerSlot = document.querySelector(".anki-answer-slot");
const exampleList = document.querySelector(".anki-examples");
const cardSideButtons = document.querySelectorAll("[data-card-side]");

let dragStartY = null;
let dragY = 0;

function setCardSide(showAnswer) {
  ankiCard.classList.toggle("is-answer-visible", showAnswer);
  ankiCard.setAttribute("aria-pressed", String(showAnswer));
  ankiCard.setAttribute(
    "aria-label",
    showAnswer ? "カードの表面を表示" : "カードの裏面を表示"
  );
  answerSlot.setAttribute("aria-hidden", String(!showAnswer));
  exampleList.setAttribute("aria-hidden", String(!showAnswer));

  cardSideButtons.forEach((button) => {
    const isActive =
      button.dataset.cardSide === (showAnswer ? "back" : "front");
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

cardSideButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCardSide(button.dataset.cardSide === "back");
  });
});

ankiCard.addEventListener("click", () => {
  setCardSide(!ankiCard.classList.contains("is-answer-visible"));
});

ankiCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setCardSide(!ankiCard.classList.contains("is-answer-visible"));
  }
});

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
