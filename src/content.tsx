import './index.css';

let inspecting = false;
let hoveredElement: HTMLElement | null = null;
let savedStyles = new Map<HTMLElement, string>();

const highlightBox = document.createElement('div');
highlightBox.style.position = 'fixed';
highlightBox.style.pointerEvents = 'none';
highlightBox.style.zIndex = '999999';
highlightBox.style.border = '2px solid #8B5CF6';
highlightBox.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.7), inset 0 0 10px rgba(139, 92, 246, 0.5)';
highlightBox.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
highlightBox.style.borderRadius = '4px';
highlightBox.style.transition = 'all 0.1s ease-out';
highlightBox.style.display = 'none';
document.body.appendChild(highlightBox);

const updateHighlight = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    highlightBox.style.top = `${rect.top}px`;
    highlightBox.style.left = `${rect.left}px`;
    highlightBox.style.width = `${rect.width}px`;
    highlightBox.style.height = `${rect.height}px`;
    highlightBox.style.display = 'block';
};

const handleMouseOver = (e: MouseEvent) => {
    if (!inspecting) return;
    const target = e.target as HTMLElement;
    if (target === highlightBox) return;
    e.stopPropagation();
    hoveredElement = target;
    updateHighlight(target);
};

const handleClick = (e: MouseEvent) => {
    if (!inspecting || !hoveredElement) return;
    e.preventDefault();
    e.stopPropagation();

    // Strip styles and start duel
    const originalStyle = hoveredElement.getAttribute('style') || '';
    savedStyles.set(hoveredElement, originalStyle);

    // Wipe out CSS classes and inline styles to strip it naked
    hoveredElement.className = '';
    hoveredElement.setAttribute('style', 'all: initial !important;');

    // Stop inspecting
    toggleInspectMode(false);
    highlightBox.style.display = 'none';

    // Later we inject React app for editing here
    console.log('StyleDuel Started on Element:', hoveredElement);
};

const toggleInspectMode = (active: boolean) => {
    inspecting = active;
    if (active) {
        document.addEventListener('mouseover', handleMouseOver, true);
        document.addEventListener('click', handleClick, true);
        document.body.style.cursor = 'crosshair';
    } else {
        document.removeEventListener('mouseover', handleMouseOver, true);
        document.removeEventListener('click', handleClick, true);
        document.body.style.cursor = 'default';
        highlightBox.style.display = 'none';
    }
};

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'start_inspect') toggleInspectMode(true);
    if (request.action === 'stop_inspect') toggleInspectMode(false);
});
