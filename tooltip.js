// js для tooltip помогла сделать нейронка

const tooltip = document.createElement("div");
tooltip.className = "cursor-tooltip";
tooltip.hidden = true;
document.body.append(tooltip);

function moveTooltip(event) {
    if (tooltip.hidden) return;

    const gap = 0;
    const margin = 8;
    const { width, height } = tooltip.getBoundingClientRect();
    let x = event.clientX + gap;
    let y = event.clientY + gap;

    if (x + width > window.innerWidth - margin) x = event.clientX - width - gap;
    if (y + height > window.innerHeight - margin) y = event.clientY - height - gap;

    tooltip.style.transform = `translate(${Math.max(margin, x)}px, ${Math.max(margin, y)}px)`;
}

function hideTooltip() {
    tooltip.hidden = true;
}

document.querySelectorAll(".has-tooltip").forEach(element => {
    element.addEventListener("pointerenter", event => {
        if (event.pointerType === "touch" || !element.dataset.tooltip) return;

        tooltip.textContent = element.dataset.tooltip;
        tooltip.hidden = false;
        moveTooltip(event);
    });
    element.addEventListener("pointermove", moveTooltip);
    element.addEventListener("pointerleave", hideTooltip);
    element.addEventListener("pointercancel", hideTooltip);
});

window.addEventListener("blur", hideTooltip);
window.addEventListener("resize", hideTooltip);
document.addEventListener("scroll", hideTooltip, true);
document.addEventListener("visibilitychange", hideTooltip);
document.addEventListener("keydown", event => {
    if (event.key === "Escape") hideTooltip();
});
