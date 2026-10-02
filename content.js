(() => {
  if (window.__domFeedback) {
    window.__domFeedback.toggle();
    return;
  }

  const MAX_TEXT = 120;
  const MAX_ATTR = 80;
  const TEST_ATTRS = ['data-testid', 'data-test', 'data-cy', 'data-qa'];
  const IS_MAC = navigator.userAgent.includes('Mac');

  const CSS_TEXT = `
    :host { all: initial; }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    .ui {
      --bg: #18181b;
      --bg-2: #27272a;
      --border: #3f3f46;
      --text: #fafafa;
      --muted: #a1a1aa;
      --accent: #6d5efc;
      --accent-soft: rgba(109, 94, 252, 0.14);
      font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }
    button { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; }
    .card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .highlight {
      position: fixed;
      pointer-events: none;
      outline: 2px solid var(--accent);
      outline-offset: -1px;
      background: var(--accent-soft);
      border-radius: 2px;
      transition: top 60ms, left 60ms, width 60ms, height 60ms;
    }
    .highlight-label {
      position: absolute;
      left: -2px;
      bottom: 100%;
      margin-bottom: 4px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--accent);
      color: #fff;
      font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
      white-space: nowrap;
      max-width: 360px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .highlight.inside .highlight-label { bottom: auto; top: 2px; left: 2px; margin: 0; }

    .pin {
      position: fixed;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      border: 2px solid #fff;
      font-size: 11px;
      font-weight: 700;
      display: grid;
      place-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      font-variant-numeric: tabular-nums;
      transition: transform 120ms;
    }
    .pin:hover { transform: scale(1.15); }

    .popover { position: fixed; width: 320px; padding: 12px; }
    .popover-selector {
      font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }
    textarea {
      display: block;
      width: 100%;
      min-height: 76px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg-2);
      color: var(--text);
      font: inherit;
      resize: vertical;
      outline: none;
    }
    textarea:focus { border-color: var(--accent); }
    .popover-actions { display: flex; align-items: center; gap: 6px; margin-top: 8px; }
    .hint { color: var(--muted); font-size: 11px; margin-right: auto; }

    .btn { height: 28px; padding: 0 10px; border-radius: 7px; }
    .btn:hover { background: var(--bg-2); }
    .btn.primary { background: var(--accent); color: #fff; }
    .btn.primary:hover { filter: brightness(1.1); }
    .btn.danger { color: #f87171; }

    .toolbar {
      position: fixed;
      right: 16px;
      bottom: 16px;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px;
    }
    .tb {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 12px;
      border-radius: 8px;
      white-space: nowrap;
    }
    .tb:hover { background: var(--bg-2); }
    .tb:disabled { opacity: 0.4; cursor: default; background: none; }
    .tb.active { background: var(--accent-soft); color: #c7c0ff; }
    .tb.copy { background: var(--text); color: var(--bg); font-weight: 600; }
    .tb.copy:hover:not(:disabled) { background: #fff; }
    .tb.icon { width: 32px; padding: 0; justify-content: center; color: var(--muted); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
    .active .dot { background: var(--accent); box-shadow: 0 0 0 3px rgba(109, 94, 252, 0.3); }
    .count {
      min-width: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--bg-2);
      font-size: 11px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .divider { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }

    .panel {
      position: fixed;
      right: 16px;
      bottom: 64px;
      width: 340px;
      max-height: 50vh;
      overflow: auto;
      padding: 6px;
    }
    .list { list-style: none; margin: 0; padding: 0; }
    .item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
    }
    .item:hover { background: var(--bg-2); }
    .item.missing { opacity: 0.5; }
    .num {
      flex: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      display: grid;
      place-items: center;
    }
    .item-body { flex: 1; min-width: 0; }
    .item-text { margin: 0 0 2px; white-space: pre-wrap; word-break: break-word; }
    .item-selector {
      display: block;
      font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .remove { flex: none; width: 22px; height: 22px; border-radius: 6px; color: var(--muted); }
    .remove:hover { background: var(--border); color: var(--text); }
    .empty { margin: 0; padding: 16px; text-align: center; color: var(--muted); }

    .toast {
      position: fixed;
      right: 16px;
      bottom: 64px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--text);
      color: var(--bg);
      font-weight: 500;
    }
  `;

  const host = document.createElement('div');
  host.style.cssText = 'all:initial;position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <div class="ui">
      <div class="highlight" hidden><span class="highlight-label"></span></div>
      <div class="pins"></div>
      <div class="popover card" hidden>
        <div class="popover-selector"></div>
        <textarea placeholder="What should change?"></textarea>
        <div class="popover-actions">
          <span class="hint">${IS_MAC ? '⌘' : 'Ctrl'}+Enter to save</span>
          <button class="btn danger" data-action="delete" hidden>Delete</button>
          <button class="btn" data-action="cancel">Cancel</button>
          <button class="btn primary" data-action="save">Save</button>
        </div>
      </div>
      <div class="panel card" hidden>
        <ul class="list"></ul>
        <p class="empty">No comments yet. Click Select, then click any element.</p>
      </div>
      <div class="toast" hidden></div>
      <div class="toolbar card">
        <button class="tb" data-action="pick" title="Select an element (Esc to stop)"><span class="dot"></span>Select</button>
        <button class="tb" data-action="list" title="Show comments">Comments <span class="count">0</span></button>
        <div class="divider"></div>
        <button class="tb copy" data-action="copy">Copy JSON</button>
        <button class="tb icon" data-action="clear" title="Clear all comments on this page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
        <button class="tb icon" data-action="close" title="Hide (Alt+Shift+F)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `;
  adoptStyles(root, CSS_TEXT);
  document.documentElement.appendChild(host);

  const $ = (sel) => root.querySelector(sel);
  const highlight = $('.highlight');
  const highlightLabel = $('.highlight-label');
  const pins = $('.pins');
  const popover = $('.popover');
  const popoverSelector = $('.popover-selector');
  const textarea = $('textarea');
  const deleteBtn = $('[data-action="delete"]');
  const panel = $('.panel');
  const list = $('.list');
  const empty = $('.empty');
  const count = $('.count');
  const pickBtn = $('[data-action="pick"]');
  const copyBtn = $('[data-action="copy"]');
  const toast = $('.toast');

  const cursorSheet = new CSSStyleSheet();
  cursorSheet.replaceSync('* { cursor: crosshair !important; }');

  const pageKey = () => 'feedback:' + location.href;
  let key = pageKey();
  let comments = [];
  let visible = true;
  let picking = false;
  let hovered = null;
  let draft = null;
  let toastTimer = 0;
  let layoutQueued = false;

  function adoptStyles(target, cssText) {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      target.adoptedStyleSheets = [sheet];
    } catch {
      const style = document.createElement('style');
      style.textContent = cssText;
      target.prepend(style);
    }
  }

  const looksGenerated = (s) =>
    /^(css|sc|jsx|emotion|svelte|styled)-/i.test(s) ||
    /^:/.test(s) ||
    /\d{3,}/.test(s) ||
    /(^|[-_])(?=[a-z]*\d)(?=\d*[a-z])[a-z0-9]{5,}($|[-_])/i.test(s);

  const isUnique = (sel) => {
    try {
      return document.querySelectorAll(sel).length === 1;
    } catch {
      return false;
    }
  };

  const find = (sel) => {
    try {
      return document.querySelector(sel);
    } catch {
      return null;
    }
  };

  function segment(el) {
    if (el.id && !looksGenerated(el.id)) return '#' + CSS.escape(el.id);
    let part = CSS.escape(el.localName);
    const classes = [...el.classList].filter((c) => !looksGenerated(c)).slice(0, 2);
    part += classes.map((c) => '.' + CSS.escape(c)).join('');
    const parent = el.parentElement;
    if (parent) {
      const siblings = [...parent.children].filter((c) => c.localName === el.localName);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(el) + 1})`;
    }
    return part;
  }

  function getSelector(el) {
    for (const attr of TEST_ATTRS) {
      const value = el.getAttribute(attr);
      if (value) {
        const sel = `[${attr}="${CSS.escape(value)}"]`;
        if (isUnique(sel)) return sel;
      }
    }
    const parts = [];
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      parts.unshift(segment(node));
      const sel = parts.join(' > ');
      if (isUnique(sel)) return sel;
    }
    return parts.join(' > ');
  }

  function describe(el) {
    const truncate = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
    const attrs = [...el.attributes]
      .filter((a) => a.name !== 'style')
      .map((a) => (a.value ? `${a.name}="${truncate(a.value, MAX_ATTR)}"` : a.name))
      .join(' ');
    const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    const info = { tag: el.localName, html: `<${el.localName}${attrs ? ' ' + attrs : ''}>` };
    if (text) info.text = truncate(text, MAX_TEXT);
    return info;
  }

  function viewport() {
    const width = innerWidth;
    const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    return { width, height: innerHeight, device };
  }

  function label(el) {
    const r = el.getBoundingClientRect();
    let name = el.localName;
    if (el.id) name += '#' + el.id;
    else if (el.classList.length) name += '.' + [...el.classList].slice(0, 2).join('.');
    return `${name}  ${Math.round(r.width)}×${Math.round(r.height)}`;
  }

  function showHighlight(el) {
    const r = el.getBoundingClientRect();
    Object.assign(highlight.style, {
      top: r.top + 'px',
      left: r.left + 'px',
      width: r.width + 'px',
      height: r.height + 'px',
    });
    highlight.classList.toggle('inside', r.top < 24);
    highlightLabel.textContent = label(el);
    highlight.hidden = false;
  }

  function hideHighlight() {
    highlight.hidden = true;
    hovered = null;
  }

  function positionPopover(el) {
    const r = el.getBoundingClientRect();
    const w = popover.offsetWidth;
    const h = popover.offsetHeight;
    const gap = 8;
    let top = r.bottom + gap;
    if (top + h > innerHeight - gap) top = r.top - h - gap;
    top = Math.min(Math.max(top, gap), innerHeight - h - gap);
    const left = Math.min(Math.max(r.left, gap), innerWidth - w - gap);
    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
  }

  function openPopover(el, comment = null) {
    draft = { el, comment, selector: comment ? comment.selector : getSelector(el) };
    hovered = null;
    showHighlight(el);
    popoverSelector.textContent = draft.selector;
    popoverSelector.title = draft.selector;
    textarea.value = comment ? comment.comment : '';
    deleteBtn.hidden = !comment;
    popover.hidden = false;
    positionPopover(el);
    textarea.focus();
  }

  function closePopover() {
    draft = null;
    popover.hidden = true;
    hideHighlight();
  }

  function saveDraft() {
    const text = textarea.value.trim();
    if (!text) {
      textarea.focus();
      return;
    }
    if (draft.comment) {
      draft.comment.comment = text;
    } else {
      comments.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        selector: draft.selector,
        comment: text,
        element: describe(draft.el),
        viewport: viewport(),
      });
    }
    closePopover();
    persist();
  }

  function removeComment(id) {
    comments = comments.filter((c) => c.id !== id);
    if (draft?.comment?.id === id) closePopover();
    persist();
  }

  async function load() {
    key = pageKey();
    const data = await chrome.storage.local.get(key);
    comments = data[key] || [];
    render();
  }

  function persist() {
    if (comments.length) chrome.storage.local.set({ [key]: comments });
    else chrome.storage.local.remove(key);
    render();
  }

  function render() {
    count.textContent = comments.length;
    copyBtn.disabled = !comments.length;
    empty.hidden = comments.length > 0;

    pins.replaceChildren(
      ...comments.map((c, i) => {
        const pin = document.createElement('button');
        pin.className = 'pin';
        pin.dataset.id = c.id;
        pin.textContent = i + 1;
        pin.title = c.comment;
        return pin;
      })
    );

    list.replaceChildren(
      ...comments.map((c, i) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.dataset.id = c.id;
        if (!find(c.selector)) {
          li.classList.add('missing');
          li.title = 'Element not found on this page';
        }
        li.innerHTML = `
          <span class="num">${i + 1}</span>
          <div class="item-body"><p class="item-text"></p><code class="item-selector"></code></div>
          <button class="remove" data-action="remove" title="Delete">×</button>
        `;
        li.querySelector('.item-text').textContent = c.comment;
        li.querySelector('.item-selector').textContent = c.selector;
        return li;
      })
    );

    layout();
  }

  function layout() {
    for (const pin of pins.children) {
      const c = comments.find((c) => c.id === pin.dataset.id);
      const r = c && find(c.selector)?.getBoundingClientRect();
      const onScreen = r && r.width + r.height > 0 && r.bottom > 0 && r.top < innerHeight;
      pin.hidden = !onScreen;
      if (onScreen) {
        pin.style.top = Math.max(r.top - 10, 4) + 'px';
        pin.style.left = Math.max(r.left - 10, 4) + 'px';
      }
    }
    if (draft) {
      showHighlight(draft.el);
      positionPopover(draft.el);
    } else if (hovered) {
      showHighlight(hovered);
    }
  }

  function queueLayout() {
    if (layoutQueued || !visible) return;
    layoutQueued = true;
    requestAnimationFrame(() => {
      layoutQueued = false;
      layout();
    });
  }

  function setPicking(on) {
    picking = on;
    pickBtn.classList.toggle('active', on);
    const sheets = document.adoptedStyleSheets.filter((s) => s !== cursorSheet);
    document.adoptedStyleSheets = on ? [...sheets, cursorSheet] : sheets;
    if (!on && !draft) hideHighlight();
  }

  function setVisible(on) {
    visible = on;
    host.style.display = on ? '' : 'none';
    if (on) {
      setPicking(true);
      load();
    } else {
      closePopover();
      setPicking(false);
      panel.hidden = true;
    }
  }

  async function copyJson() {
    if (!comments.length) return;
    const json = JSON.stringify(
      {
        url: location.href,
        title: document.title,
        viewport: viewport(),
        comments: comments.map(({ selector, comment, element, viewport }) => ({ selector, comment, element, viewport })),
      },
      null,
      2
    );
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = json;
      root.querySelector('.ui').appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast(`Copied ${comments.length} comment${comments.length === 1 ? '' : 's'}`);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    panel.hidden = true;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 1800);
  }

  const isOurs = (e) => e.composedPath().includes(host);

  function onMove(e) {
    if (!picking || draft || isOurs(e)) return;
    hovered = e.target;
    showHighlight(hovered);
  }

  function onBlock(e) {
    if (!picking || isOurs(e)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  function onClick(e) {
    if (!picking || isOurs(e)) return;
    onBlock(e);
    if (draft && textarea.value.trim()) {
      textarea.focus();
      return;
    }
    openPopover(e.target);
  }

  function onKey(e) {
    if (e.key !== 'Escape' || !visible) return;
    if (draft) closePopover();
    else if (picking) setPicking(false);
    else return;
    e.preventDefault();
    e.stopPropagation();
  }

  root.addEventListener('click', (e) => {
    const pin = e.target.closest('.pin');
    if (pin) {
      const c = comments.find((c) => c.id === pin.dataset.id);
      const el = c && find(c.selector);
      if (el) openPopover(el, c);
      return;
    }

    const action = e.target.closest('[data-action]')?.dataset.action;
    const item = e.target.closest('.item');

    if (action === 'remove' && item) return removeComment(item.dataset.id);
    if (item && !action) {
      const c = comments.find((c) => c.id === item.dataset.id);
      const el = c && find(c.selector);
      if (!el) return;
      el.scrollIntoView({ block: 'center' });
      openPopover(el, c);
      return;
    }

    switch (action) {
      case 'pick':
        return setPicking(!picking);
      case 'list':
        panel.hidden = !panel.hidden;
        toast.hidden = true;
        return;
      case 'copy':
        return copyJson();
      case 'clear':
        if (comments.length && confirm(`Delete all ${comments.length} comments on this page?`)) {
          comments = [];
          closePopover();
          persist();
        }
        return;
      case 'close':
        return setVisible(false);
      case 'save':
        return saveDraft();
      case 'cancel':
        return closePopover();
      case 'delete':
        return draft?.comment && removeComment(draft.comment.id);
    }
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveDraft();
    }
  });

  for (const type of ['keydown', 'keyup', 'keypress']) {
    root.addEventListener(type, (e) => e.stopPropagation());
  }

  window.addEventListener('mousemove', onMove, true);
  window.addEventListener('click', onClick, true);
  for (const type of ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'auxclick']) {
    window.addEventListener(type, onBlock, true);
  }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('scroll', queueLayout, { capture: true, passive: true });
  window.addEventListener('resize', queueLayout);

  setInterval(() => {
    if (!visible) return;
    if (pageKey() !== key) {
      closePopover();
      load();
    } else {
      layout();
    }
  }, 500);

  window.__domFeedback = { toggle: () => setVisible(!visible) };
  setVisible(true);
})();
