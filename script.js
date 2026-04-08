/* ============================================================
   script.js
   - Language toggle (EN / 中) with localStorage persistence
   - RPG World progress renderer (reads window.RPG_TASKS)
   ============================================================ */

(function () {
  "use strict";

  // ----------------------------------------------------------
  // Language toggle
  // ----------------------------------------------------------
  const STORAGE_KEY = "cz-portfolio-lang";
  const VALID_LANGS = ["en", "zh"];

  function getInitialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VALID_LANGS.includes(stored)) return stored;
    } catch (_) {
      /* localStorage may be disabled */
    }
    // fall back to browser preference
    const browser = (navigator.language || "en").toLowerCase();
    return browser.startsWith("zh") ? "zh" : "en";
  }

  function applyLang(lang) {
    if (!VALID_LANGS.includes(lang)) lang = "en";
    document.body.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    document.querySelectorAll("[data-lang-set]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langSet === lang);
      btn.setAttribute("aria-pressed", btn.dataset.langSet === lang ? "true" : "false");
    });
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }
  }

  function setupLangToggle() {
    document.querySelectorAll("[data-lang-set]").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.langSet));
    });
    applyLang(getInitialLang());
  }

  // ----------------------------------------------------------
  // RPG World progress renderer
  // ----------------------------------------------------------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      const arr = Array.isArray(children) ? children : [children];
      arr.forEach((c) => {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function bilingual(en, zh) {
    return [
      el("span", { class: "en" }, en),
      el("span", { class: "zh" }, zh),
    ];
  }

  function renderRpgProgress() {
    const container = document.getElementById("rpg-progress");
    if (!container) return;
    if (!window.RPG_TASKS) {
      container.innerHTML =
        '<p style="color: var(--text-muted); text-align: center; font-family: var(--font-mono); font-size: 0.85rem;">No task data found. Run <code>node scripts/sync-progress.mjs</code> to generate it.</p>';
      return;
    }

    const data = window.RPG_TASKS;
    const completed = data.completed || [];
    const inProgress = data.inProgress || [];
    const todo = data.todo || [];
    const total = completed.length + inProgress.length + todo.length;
    const percent = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    container.innerHTML = "";

    // --- Stat row ---
    const statRow = el("div", { class: "rpg-stat-row" });
    const stats = [
      { num: completed.length, cls: "completed", en: "Completed", zh: "已完成" },
      { num: todo.length, cls: "todo", en: "To Do", zh: "待办" },
    ];
    stats.forEach((s) => {
      const stat = el("div", { class: "rpg-stat" }, [
        el("div", { class: `rpg-stat-num ${s.cls}` }, String(s.num)),
        el("div", { class: "rpg-stat-label" }, bilingual(s.en, s.zh)),
      ]);
      statRow.appendChild(stat);
    });
    container.appendChild(statRow);

    // --- Progress bar ---
    const barWrapper = el("div", { class: "rpg-bar-wrapper" }, [
      el("div", { class: "rpg-bar-meta" }, [
        el("span", null, bilingual("Overall progress", "整体进度")),
        el("span", { class: "rpg-bar-percent" }, `${percent}%`),
      ]),
      el("div", { class: "rpg-bar" }, [
        el("div", { class: "rpg-bar-fill" }),
      ]),
    ]);
    container.appendChild(barWrapper);

    // animate the bar fill after a tick
    requestAnimationFrame(() => {
      const fill = barWrapper.querySelector(".rpg-bar-fill");
      if (fill) fill.style.width = `${percent}%`;
    });

    // --- Two columns: recent completions + up next ---
    const cols = el("div", { class: "rpg-cols" });

    // Column 1: completed tasks (all, newest first)
    const sortedCompleted = [...completed]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const colDone = el("div", null, [
      el("div", { class: "rpg-col-title" }, bilingual("Completed tasks", "已完成任务")),
      ...sortedCompleted.map((t) =>
        el("div", { class: "rpg-task" }, [
          el("span", { class: "rpg-task-id" }, t.id || ""),
          el("span", { class: "rpg-task-name" }, t.name || ""),
          el("span", { class: "rpg-task-date" }, t.date || ""),
        ])
      ),
    ]);
    cols.appendChild(colDone);

    // Column 2: pending tasks (in progress + todo)
    const pendingTasks = [
      ...inProgress.map((t) => ({ ...t, _state: "inprogress" })),
      ...todo.map((t) => ({ ...t, _state: "todo" })),
    ];
    const colTodo = el("div", null, [
      el("div", { class: "rpg-col-title" }, bilingual("Pending tasks", "待处理任务")),
      ...(pendingTasks.length
        ? pendingTasks.map((t) => {
            const priority = (t.priority || "medium").toLowerCase();
            const stateLabel = t._state === "inprogress" ? "in progress" : "todo";
            return el("div", { class: "rpg-task" }, [
              el("span", { class: `rpg-priority ${priority}` }, priority),
              el("span", { class: "rpg-task-id" }, t.id || ""),
              el("span", { class: "rpg-task-name" }, t.name || ""),
              el("span", { class: "rpg-task-date" }, stateLabel),
            ]);
          })
        : [
            el(
              "div",
              { class: "rpg-task" },
              [
                el("span", { class: "rpg-task-name" }, bilingual("No pending tasks", "暂无待处理任务")),
              ]
            ),
          ]),
    ]);
    cols.appendChild(colTodo);

    container.appendChild(cols);

    // --- Source line ---
    const sourceLine = el("div", { class: "rpg-source-line" });
    sourceLine.appendChild(
      el("span", { class: "en" }, [
        document.createTextNode("Synced from "),
        el("code", null, "rpg-world/tasks.json"),
        document.createTextNode(` · Last updated ${data.lastUpdated || "—"}`),
      ])
    );
    sourceLine.appendChild(
      el("span", { class: "zh" }, [
        document.createTextNode("从 "),
        el("code", null, "rpg-world/tasks.json"),
        document.createTextNode(` 同步 · 最近更新 ${data.lastUpdated || "—"}`),
      ])
    );
    container.appendChild(sourceLine);
  }

  // ----------------------------------------------------------
  // Screenshot zoom (click to toggle)
  // ----------------------------------------------------------
  function setupScreenshotZoom() {
    const cards = document.querySelectorAll(".screenshot-card");
    if (!cards.length) return;

    let overlay = null;
    let savedOverflow = "";
    let closing = false;

    function show(src, alt) {
      if (overlay || closing) return;
      overlay = document.createElement("div");
      overlay.className = "zoom-overlay";
      // Keep RPG screenshots slightly smaller in lightbox mode for better context.
      if (typeof src === "string" && src.includes("assets/rpg-world/")) {
        overlay.classList.add("zoom-overlay-rpg");
      }
      overlay.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.src = src;
      if (alt) img.alt = alt;
      img.draggable = false;
      overlay.appendChild(img);

      const hint = document.createElement("div");
      hint.className = "zoom-overlay-hint";
      hint.textContent = "click anywhere to close";
      overlay.appendChild(hint);

      // Click anywhere on the overlay closes it
      overlay.addEventListener("click", hide);

      document.body.appendChild(overlay);
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Trigger reflow then add .visible so the opacity/transform transition runs
      // (rather than the element appearing already at its final state).
      void overlay.offsetWidth;
      overlay.classList.add("visible");
    }

    function hide() {
      if (!overlay || closing) return;
      closing = true;
      const dying = overlay;
      overlay = null;
      dying.classList.remove("visible");
      // Restore scroll right away so the page is interactive during the fade
      document.body.style.overflow = savedOverflow;
      // Wait for the opacity transition to finish, then remove the node.
      // Use transitionend with a safety timeout in case the event doesn't fire.
      let removed = false;
      const cleanup = () => {
        if (removed) return;
        removed = true;
        dying.removeEventListener("transitionend", onEnd);
        dying.remove();
        closing = false;
      };
      const onEnd = (e) => {
        if (e.target === dying && e.propertyName === "opacity") cleanup();
      };
      dying.addEventListener("transitionend", onEnd);
      setTimeout(cleanup, 400);
    }

    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      card.addEventListener("click", (e) => {
        e.preventDefault();
        show(img.src, img.alt);
      });
    });

    // Escape key closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hide();
    });
  }

  // ----------------------------------------------------------
  // Boot
  // ----------------------------------------------------------
  function init() {
    setupLangToggle();
    renderRpgProgress();
    setupScreenshotZoom();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
