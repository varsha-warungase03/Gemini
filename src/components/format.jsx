// src/utils/formatApiResponse.js


export function removeBoxed(text) {
    return text.replace(/\\boxed{([^}]+)}/g, '$1');
}

// export function removeCodeBlocks(text) {
//     return text.replace(/```[\s\S]*?```/g, "");
// }

export function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function removeInlineCode(text) {
    return text.replace(/`([^`]+)`/g, '$1');
}

export function replaceBold(text) {
    return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function replaceItalic(text) {
    return text.replace(/\*([^*]+)\*/g, '$1');
}

export function replaceBullets(text) {
    return text.replace(/^\s*[-*]\s*/gm, '• ');
}

export function removeHeaders(text) {
    return text.replace(/#+\s*(.*)/g, '$1');
}

export function cleanNewLines(text) {
    return text.replace(/\n{2,}/g, '\n\n');
}

export function removedoller(text) {
    if (!text) return "";
    return text.replace(/\$(\d+)\$/g, '$1');
}

export function space(text) {

    return text.replace(/\n{2,}/g, '<br /><br />');
}

export function trimText(text) {
    if (!text) return [];
    return text.trim();
}

export function removeBackticks(text) {
    if (!text) return "";
    return text
        .replace(/''/g, '')
        .replace(/`+/g, '')
}

// export function formatApiResponse(rawText) {
//     if (!rawText) return "";

//     // Remove Markdown syntax
//     let cleanText = rawText
//         .replace(/\\boxed{([^}]+)}/g, '$1')            // ✅ remove \boxed{...}
//         .replace(/```[\s\S]*?```/g, "")                // remove code blocks
//         .replace(/`([^`]+)`/g, '$1')                   // inline code
//         .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')             // bold
//         .replace(/\*([^*]+)\*/g, '$1')                 // italic
//         .replace(/^\s*[-*]\s*/gm, '• ')                // bullets
//         .replace(/#+\s*(.*)/g, '$1')                   // headers
//         .replace(/\n{2,}/g, '\n\n')                    // multiple new lines
//         .trim();

//     return cleanText;
// }

export function formatApiResponse(rawText) {
    if (!rawText) return "";

    const cleaners = [
        removeBoxed,
        // removeCodeBlocks,
        escapeHtml,
        removeInlineCode,
        replaceBold,
        replaceItalic,
        replaceBullets,
        removeHeaders,
        cleanNewLines,
        trimText,
        space,
        removedoller,
        removeBackticks
    ];

    const cleaned = cleaners.reduce((text, fn) => fn(text), rawText);
    return `<pre class="whitespace-pre-wrap break-words"><code>${cleaned}</code></pre>`;
}
