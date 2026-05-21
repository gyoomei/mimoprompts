/**
 * MimoPrompts UI controller.
 * - Reads window.PROMPTS (loaded from prompts.js)
 * - Renders cards, populates filters, handles search + filter + copy
 * - Pure client-side, no build step
 */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const state = {
    query: "",
    model: "all",
    category: "all",
  };

  /* ------------------------------------------------------------------ */
  /*  Init                                                              */
  /* ------------------------------------------------------------------ */
  function init() {
    if (!Array.isArray(window.PROMPTS) || window.PROMPTS.length === 0) {
      console.error("PROMPTS not loaded");
      return;
    }
    populateCategoryFilter();
    bindEvents();
    render();
  }

  /* ------------------------------------------------------------------ */
  /*  Filter population                                                 */
  /* ------------------------------------------------------------------ */
  function populateCategoryFilter() {
    const categories = Array.from(
      new Set(window.PROMPTS.map((p) => p.category))
    ).sort();
    const container = $("#category-filter");
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.dataset.filter = "category";
      btn.dataset.value = cat;
      btn.textContent = cat;
      container.appendChild(btn);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Events                                                            */
  /* ------------------------------------------------------------------ */
  function bindEvents() {
    $("#search").addEventListener("input", (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });

    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) {
        handleChipClick(chip);
        return;
      }
      const copyBtn = e.target.closest(".copy-btn");
      if (copyBtn) {
        handleCopy(copyBtn);
        return;
      }
    });
  }

  function handleChipClick(chip) {
    const filter = chip.dataset.filter;
    const value = chip.dataset.value;
    state[filter] = value;
    $$(`.chip[data-filter="${filter}"]`).forEach((c) =>
      c.classList.toggle("active", c.dataset.value === value)
    );
    render();
  }

  /* ------------------------------------------------------------------ */
  /*  Filtering                                                         */
  /* ------------------------------------------------------------------ */
  function matches(prompt) {
    if (state.model !== "all" && prompt.model !== state.model) return false;
    if (state.category !== "all" && prompt.category !== state.category)
      return false;
    if (state.query) {
      const haystack = [
        prompt.title,
        prompt.useCase,
        prompt.category,
        prompt.model,
        (prompt.tags || []).join(" "),
        prompt.user || "",
        prompt.system || "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(state.query)) return false;
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  function render() {
    const grid = $("#grid");
    const empty = $("#empty");
    const tpl = $("#card-template");

    grid.innerHTML = "";

    const filtered = window.PROMPTS.filter(matches);
    $("#count").textContent = `${filtered.length} prompt${
      filtered.length === 1 ? "" : "s"
    }`;

    if (filtered.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    const frag = document.createDocumentFragment();
    filtered.forEach((p) => frag.appendChild(buildCard(tpl, p)));
    grid.appendChild(frag);
  }

  function buildCard(tpl, p) {
    const node = tpl.content.cloneNode(true);

    // badges
    const modelBadge = node.querySelector(".badge.model");
    modelBadge.textContent = p.model;
    modelBadge.dataset.value = p.model;

    const categoryBadge = node.querySelector(".badge.category");
    categoryBadge.textContent = p.category;

    // title + use case
    node.querySelector(".card-title").textContent = p.title;
    node.querySelector(".card-usecase").textContent = p.useCase;

    // system block (optional)
    const systemBlock = node.querySelector(".prompt-block.system");
    if (p.system) {
      systemBlock.classList.remove("hidden");
      node.querySelector(".system-text").textContent = p.system;
    }

    // user block (always)
    node.querySelector(".user-text").textContent = p.user || "";

    // expected
    node.querySelector(".expected-text").textContent =
      p.expectedOutput || "—";

    // params
    const paramsBox = node.querySelector(".params");
    if (p.params && Object.keys(p.params).length > 0) {
      Object.entries(p.params).forEach(([k, v]) => {
        const span = document.createElement("span");
        span.textContent = `${k}: ${formatParamValue(v)}`;
        paramsBox.appendChild(span);
      });
    } else {
      paramsBox.remove();
    }

    // tags
    const tagsBox = node.querySelector(".tags");
    (p.tags || []).forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = `#${t}`;
      tagsBox.appendChild(span);
    });

    // copy
    const copyBtn = node.querySelector(".copy-btn");
    copyBtn.dataset.id = p.id;

    return node;
  }

  function formatParamValue(v) {
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  }

  /* ------------------------------------------------------------------ */
  /*  Copy                                                              */
  /* ------------------------------------------------------------------ */
  function handleCopy(btn) {
    const id = btn.dataset.id;
    const prompt = window.PROMPTS.find((p) => p.id === id);
    if (!prompt) return;

    const lines = [];
    if (prompt.system) lines.push(`# System\n${prompt.system}\n`);
    lines.push(`# User\n${prompt.user || ""}`);
    if (prompt.params && Object.keys(prompt.params).length > 0) {
      lines.push(
        `\n# Recommended params\n${JSON.stringify(prompt.params, null, 2)}`
      );
    }
    const text = lines.join("\n");

    navigator.clipboard.writeText(text).then(
      () => flashCopied(btn),
      () => fallbackCopy(text, btn)
    );
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      flashCopied(btn);
    } catch (_) {
      console.error("Copy failed");
    } finally {
      document.body.removeChild(ta);
    }
  }

  function flashCopied(btn) {
    btn.classList.add("copied");
    btn.textContent = "Copied ✓";
    showToast();
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.textContent = "Copy";
    }, 1500);
  }

  function showToast() {
    const toast = $("#toast");
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1500);
  }

  /* ------------------------------------------------------------------ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
