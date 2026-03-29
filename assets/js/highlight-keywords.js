function highlightKeywords() {
  const config = {
    keywords: ['docker compose', 'docker', 'ollama', 'git', 'npm install', 'npm run', 'pip install'],
  };

  const keywordPattern = config.keywords
    .sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'))
    .join('|');

  const mainRegex = new RegExp(`(${keywordPattern}|<[^>]+>|--?[\\w-]+)`, 'gi');

  const codeBlocks = document.querySelectorAll("div.language-bash code, div.language-sh code");

  codeBlocks.forEach((block) => {
    if (block.dataset.highlighted === "true") return;

    // --- STEP 1: CAREFUL UNWRAPPING (Same as before) ---
    const existingSpans = block.querySelectorAll('span');
    existingSpans.forEach(span => {
      if (span.matches('.c, .c1, .cm, .cp, .ch') || span.id || span.querySelector('a')) return;
      const textNode = document.createTextNode(span.textContent);
      span.parentNode.replaceChild(textNode, span);
    });
    block.normalize();

    // --- STEP 2: HIGHLIGHTING WITH POSITION CHECK ---
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()) textNodes.push(currentNode);

    textNodes.forEach((node) => {
      const parent = node.parentElement;
      if (parent.closest('.c, .c1, .cm, .cp, .ch')) return;

      // 1. Check Previous Siblings: Are we physically at the start of the line?
      // We ignore the MkDocs line number anchor (<a> tag)
      let isStartOfLine = true;
      let sibling = node.previousSibling;
      while (sibling) {
        const isLineAnchor = sibling.tagName === 'A' && (sibling.className === 'lineno' || sibling.id.startsWith('__codelineno'));
        // If we find text or an element that isn't the line anchor, we are not at start
        if (!isLineAnchor && sibling.textContent && sibling.textContent.trim().length > 0) {
          isStartOfLine = false;
          break;
        }
        sibling = sibling.previousSibling;
      }

      const text = node.textContent;
      if (!mainRegex.test(text)) return;
      mainRegex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      const parts = text.split(mainRegex);

      parts.forEach((part) => {
        if (!part) return;

        // If part is just whitespace, append and continue (don't change isStartOfLine)
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }

        const lowerPart = part.toLowerCase();
        const normalizedPart = lowerPart.replace(/\s+/g, ' ');
        const isKeyword = config.keywords.some(k => k.toLowerCase() === normalizedPart);

        // 2. Logic: Only highlight keyword IF we are still at the start of the line
        if (isKeyword && isStartOfLine) {
          
          // Split for cli-keyword vs cli-keyword2
          const wordParts = part.split(/(\s+)/);
          let wordIndex = 0;
          wordParts.forEach(wp => {
            if (/^\s+$/.test(wp)) {
              fragment.appendChild(document.createTextNode(wp));
            } else if (wp) {
              wordIndex++;
              fragment.appendChild(createSpan(wp, wordIndex === 1 ? 'cli-keyword' : 'cli-keyword2'));
            }
          });

          // Once we've highlighted a command, the "start" of the line is over
          isStartOfLine = false;

        } else if (part.startsWith('<') && part.endsWith('>')) {
          const italicEl = document.createElement('em');
          italicEl.textContent = part;
          fragment.appendChild(italicEl);
          isStartOfLine = false; // Arguments mean command is done
        } else if (part.startsWith('-')) {
          fragment.appendChild(createSpan(part, 'cli-option'));
          isStartOfLine = false; 
        } else {
          // Regular word / Non-start keyword
          fragment.appendChild(createSpan(part, 'other-word'));
          isStartOfLine = false;
        }
      });

      parent.replaceChild(fragment, node);
    });

    block.dataset.highlighted = "true";
  });
}

function createSpan(text, className) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}

if (typeof document$ !== "undefined") {
  document$.subscribe(() => highlightKeywords());
}