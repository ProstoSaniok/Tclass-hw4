/* Круг помогла мне написать нейронка */

const circleLabels = document.querySelectorAll(
    ".game-choice-label, .game-choice-icon"
);

let pointerX = 0;
let pointerY = 0;
let frameId = null;
let circlesVisible = false;
let hasPointerPosition = false;
let choiceCircleLocked = false;
const pointerStorageKey = "game-circle-pointer";

function savePointerPosition() {
    if (!hasPointerPosition) return;
    try {
        sessionStorage.setItem(pointerStorageKey, JSON.stringify({
            x: pointerX,
            y: pointerY
        }));
    } catch {}
}

function updateCircles() {
    frameId = null;
    const rects = Array.from(circleLabels, label => label.getBoundingClientRect());

    if (choiceCircleLocked) {
        circleLabels.forEach(label => label.classList.remove("has-pointer"));
        return;
    }

    circleLabels.forEach((label, index) => {
        label.style.setProperty("--mouse-x", `${pointerX - rects[index].left}px`);
        label.style.setProperty("--mouse-y", `${pointerY - rects[index].top}px`);
    });

    if (!circlesVisible) {
        circleLabels.forEach(label => {
            const circle = label.querySelector(".icon-effect") || label;
            getComputedStyle(circle, "::before").transform;
        });
        circleLabels.forEach(label => label.classList.add("has-pointer"));
        circlesVisible = true;
    }
}

document.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;

    pointerX = event.clientX;
    pointerY = event.clientY;
    hasPointerPosition = true;
    if (frameId === null) frameId = requestAnimationFrame(updateCircles);
});

function hideCircles() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    circlesVisible = false;
    circleLabels.forEach(label => {
        label.classList.remove("has-pointer");
    });
}

function drawChoiceCircle(target, clientX, clientY) {
    if (!target || choiceCircleLocked) return;

    const rect = target.getBoundingClientRect();
    const x = Number.isFinite(clientX) ? clientX - rect.left : rect.width / 2;
    const y = Number.isFinite(clientY) ? clientY - rect.top : rect.height / 2;

    choiceCircleLocked = true;
    circleLabels.forEach(label => label.classList.remove("has-pointer"));

    const targets = target.matches(".game-choice")
        ? [
            target.querySelector(".game-choice-icon"),
            target.querySelector(".game-choice-label")
        ].filter(Boolean)
        : [target];

    targets.forEach(animatedTarget => {
        const targetRect = animatedTarget.getBoundingClientRect();
        animatedTarget.style.setProperty(
            "--mouse-x",
            `${x + rect.left - targetRect.left}px`
        );
        animatedTarget.style.setProperty(
            "--mouse-y",
            `${y + rect.top - targetRect.top}px`
        );
        animatedTarget.classList.remove("is-rippling");
        void animatedTarget.offsetWidth;
        animatedTarget.classList.add("is-rippling");

        const effect = animatedTarget.querySelector(".icon-effect");
        if (effect) {
            effect.classList.remove("is-rippling");
            void effect.offsetWidth;
            effect.classList.add("is-rippling");
        }
    });
}

function resetChoiceCircle(target) {
    const targets = target
        ? [target, target.querySelector?.(".icon-effect")].filter(Boolean)
        : [...circleLabels, ...document.querySelectorAll(".icon-effect")];

    if (!target) choiceCircleLocked = false;

    targets.forEach(element => {
        element.classList.remove("is-rippling");
    });

    if (!target) {
        circleLabels.forEach(label => label.classList.remove("has-pointer"));
    }
}

circleLabels.forEach(label => {
    label.addEventListener("animationend", event => {
        if (event.animationName === "choice-circle-shrink") {
            label.classList.remove("is-rippling");
        }
    });
});

document.querySelectorAll(".icon-effect").forEach(effect => {
    effect.addEventListener("animationend", event => {
        if (event.animationName === "choice-circle-shrink") {
            effect.classList.remove("is-rippling");
        }
    });
});

window.resetChoiceCircle = resetChoiceCircle;
window.drawChoiceCircle = drawChoiceCircle;

document.documentElement.addEventListener("pointerleave", hideCircles);
document.addEventListener("pointercancel", hideCircles);
window.addEventListener("blur", hideCircles);
window.addEventListener("resize", hideCircles);
document.addEventListener("scroll", hideCircles, true);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) savePointerPosition();
    hideCircles();
});
window.addEventListener("pagehide", savePointerPosition);

try {
    const savedPointer = JSON.parse(sessionStorage.getItem(pointerStorageKey));
    if (savedPointer && Number.isFinite(savedPointer.x) && Number.isFinite(savedPointer.y)) {
        pointerX = savedPointer.x;
        pointerY = savedPointer.y;
        hasPointerPosition = true;
        updateCircles();
    }
} catch {}

window.addEventListener("load", () => {
    if (!circlesVisible) return;
    hideCircles();
    updateCircles();
});
