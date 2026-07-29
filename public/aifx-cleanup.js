(() => {
  const creditText = /made\s+in\s+aidesigner/i;

  function removeFrom(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll('a[href*="aidesigner.ai"], [data-aifx-credit], .aifx-credit, #aifx-credit').forEach((node) => {
      if (creditText.test(node.textContent || '') || node.matches('[data-aifx-credit], .aifx-credit, #aifx-credit')) node.remove();
    });

    root.querySelectorAll('*').forEach((node) => {
      if (node.shadowRoot) removeFrom(node.shadowRoot);
      const text = (node.textContent || '').trim();
      if (node.children.length === 0 && creditText.test(text)) {
        let target = node;
        while (
          target.parentElement &&
          target.parentElement !== document.body &&
          creditText.test((target.parentElement.textContent || '').trim()) &&
          target.parentElement.children.length <= 2
        ) target = target.parentElement;
        target.remove();
      }
    });
  }

  const clean = () => removeFrom(document);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', clean, { once: true });
  else clean();

  new MutationObserver(clean).observe(document.documentElement, { childList: true, subtree: true });
})();
