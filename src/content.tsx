import React from 'react';
import { createRoot } from 'react-dom/client';
import { EditorConsole } from './EditorConsole';
import './index.css';

let inspecting = false;
let hoveredElement: HTMLElement | null = null;
let savedStyles = new Map<HTMLElement, string>();
let editorContainer: HTMLDivElement | null = null;
let styleTag: HTMLStyleElement | null = null;

// The glowing highlight box
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
    // Ignore hovering over our own extension elements
    if (target === highlightBox || target.closest('#style-duel-root')) return;

    e.stopPropagation();
    hoveredElement = target;
    updateHighlight(target);
};

const handleEditorClose = () => {
    if (editorContainer) {
        editorContainer.remove();
        editorContainer = null;
    }
    if (styleTag) {
        styleTag.remove();
        styleTag = null;
    }
};

const handleEditorApply = (cssText: string) => {
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'style-duel-injected';
        document.head.appendChild(styleTag);
    }

    // Scoped to the hovered element to prevent breaking the rest of the page layout
    if (hoveredElement) {
        const duelClass = `style-duel-target-${Date.now()}`;
        hoveredElement.classList.add(duelClass);
        styleTag.textContent = `.${duelClass} { ${cssText} }`;
    }
};

const handleClick = (e: MouseEvent) => {
    if (!inspecting || !hoveredElement) return;
    const target = e.target as HTMLElement;
    if (target.closest('#style-duel-root')) return;

    e.preventDefault();
    e.stopPropagation();

    // Strip element bare
    savedStyles.set(hoveredElement, hoveredElement.getAttribute('style') || '');
    hoveredElement.className = '';
    hoveredElement.setAttribute('style', 'all: initial !important;');

    // Stop picking mode
    toggleInspectMode(false);

    // Mount the React Editor
    if (!editorContainer) {
        editorContainer = document.createElement('div');
        editorContainer.id = 'style-duel-root';
        document.body.appendChild(editorContainer);

        const root = createRoot(editorContainer);
        root.render(
            <EditorConsole
                targetElement={hoveredElement}
                onClose={handleEditorClose}
                onApply={handleEditorApply}
            />
        );
    }
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
