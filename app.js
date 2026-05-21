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

  let debounceTimer = null;

  /* ------------------------------------------------------------------ */
  /*  Init                                                              */
  /* ------------------------------------------------------------------ */
  function init() {
    if (!Array.isArray(window.PROMPTS) || window.PROMPTS.length === 0) {
      console.error("PROMPTS not loaded");
      return;
    }
    populateStats();
    populateCategoryFilter();
    bindEvents();
    render();
    initBackToTop();
  }

  /* ------------------------------------------------------------------ */
  /*  Stats hero counters                                                */
  /* ------------------------------------------------------------------ */
  function populateStats() {
    const total = window.PROMPTS.length;
    const cats = new Set(window.PROMPTS.map((p) => p.category));
    animateCount("#stat-prompts", total);
    animateCount("#stat-categories", cats.size);
  }

  function animateCount(selector, target) {
    const el = $(selector);
    if (!el) return;
    const dur = 900;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ */
  /*  Filter population                                                 */
  /* ------------------------------------------------------------------ */
  function populateCategoryFilter() {
    const counts = countBy("category");
    const categories = Array.from(
      new Set(window.PROMPTS.map((p) => p.category))
    ).sort();
    const container = $("#category-filter");

    const allBtn = container.querySelector('.chip[data-value="all"]');
    if (allBtn) {
      allBtn.innerHTML = `All <span class="chip-count">${window.PROMPTS.length}</span>`;
    }

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.dataset.filter = "category";
      btn.dataset.value = cat;
      btn.innerHTML = `${cat} <span class="chip-count">${counts[cat] || 0}</span>`;
      container.appendChild(btn);
    });

    const modelCounts = countBy("model");
    $$("#model-filter .chip").forEach((btn) => {
      const v = btn.dataset.value;
      if (v === "all") {
        btn.innerHTML = `All <span class="chip-count">${window.PROMPTS.length}</span>`;
      } else {
        const label = btn.textContent.trim();
        btn.innerHTML = `${label} <span class="chip-count">${modelCounts[v] || 0}</span>`;
      }
    });
  }

  function countBy(field) {
    const out = {};
    window.PROMPTS.forEach((p) => {
      out[p[field]] = (out[p[field]] || 0) + 1;
    });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /*  Events                                                            */
  /* ------------------------------------------------------------------ */
  function bindEvents() {
    // Search input with debounce
    $("#search").addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.query = e.target.value.trim().toLowerCase();
        updateClearBtn();
        render();
      }, 150);
    });

    // Clear button
    const clearBtn = $(".search-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const input = $("#search");
        input.value = "";
        state.query = "";
        updateClearBtn();
        render();
        input.focus();
      });
    }

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

  function updateClearBtn() {
    const btn = $(".search-clear");
    if (btn) {
      btn.classList.toggle("visible", state.query.length > 0);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Search: multi-token matching                                       */
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

      // Split query into tokens — ALL must match (AND logic)
      const tokens = state.query.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        if (!haystack.includes(token)) return false;
      }
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
    const countEl = $("#count");
    countEl.textContent = `${filtered.length} prompt${
      filtered.length === 1 ? "" : "s"
    }`;

    // Highlight count when filtered
    countEl.classList.toggle("active", state.query.length > 0 || state.model !== "all" || state.category !== "all");

    if (filtered.length === 0) {
      empty.classList.remove("hidden");
      // Update empty state message
      const emptyMsg = empty.querySelector("p");
      if (emptyMsg && state.query) {
        emptyMsg.innerHTML = `No prompts match "<strong>${escapeHtml(state.query)}</strong>".<br>Try different keywords or clear the filters.`;
      } else if (emptyMsg) {
        emptyMsg.innerHTML = "No prompts match your filter.<br>Try a different keyword or clear the filters.";
      }
      return;
    }
    empty.classList.add("hidden");

    const frag = document.createDocumentFragment();
    filtered.forEach((p) => frag.appendChild(buildCard(tpl, p)));
    grid.appendChild(frag);

    revealCards();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------ */
  /*  Search highlight                                                  */
  /* ------------------------------------------------------------------ */
  function highlightText(text, query) {
    if (!query || !text) return escapeHtml(text || "");
    const tokens = query.split(/\s+/).filter(Boolean);
    let result = escapeHtml(text);
    tokens.forEach((token) => {
      if (token.length < 2) return; // skip single char
      const regex = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      result = result.replace(regex, '<mark>$1</mark>');
    });
    return result;
  }

  /* ------------------------------------------------------------------ */
  /*  Scroll-reveal                                                     */
  /* ------------------------------------------------------------------ */
  let revealObserver = null;
  function revealCards() {
    if (revealObserver) revealObserver.disconnect();
    const cards = $$(".card:not(.revealed)");
    if (!cards.length) return;
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("revealed"));
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "40px" }
    );
    cards.forEach((c) => revealObserver.observe(c));
  }

  /* ------------------------------------------------------------------ */
  /*  Keyboard shortcut (Ctrl+K / Cmd+K)                                */
  /* ------------------------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      const search = $("#search");
      search.focus();
      search.select();
    }
    if (e.key === "Escape") {
      const search = $("#search");
      if (document.activeElement === search) {
        if (search.value) {
          search.value = "";
          state.query = "";
          updateClearBtn();
          render();
        } else {
          search.blur();
        }
      }
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Back to top                                                       */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = $(".back-to-top");
    if (!btn) return;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle("visible", window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function buildCard(tpl, p) {
    const node = tpl.content.cloneNode(true);

    // badges
    const modelBadge = node.querySelector(".badge.model");
    modelBadge.textContent = p.model;
    modelBadge.dataset.value = p.model;

    const categoryBadge = node.querySelector(".badge.category");
    categoryBadge.textContent = p.category;

    // title + use case (with highlight)
    const titleEl = node.querySelector(".card-title");
    const usecaseEl = node.querySelector(".card-usecase");

    if (state.query) {
      titleEl.innerHTML = highlightText(p.title, state.query);
      usecaseEl.innerHTML = highlightText(p.useCase, state.query);
    } else {
      titleEl.textContent = p.title;
      usecaseEl.textContent = p.useCase;
    }

    // preview teaser
    const previewEl = node.querySelector(".card-preview");
    const userText = (p.user || "").replace(/\s+/g, " ").trim();
    const preview = userText.length > 100 ? userText.slice(0, 100) + "…" : userText;
    if (preview) {
      if (state.query) {
        previewEl.innerHTML = "▸ " + highlightText(preview, state.query);
      } else {
        previewEl.textContent = "▸ " + preview;
      }
    } else {
      previewEl.remove();
    }

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

    // tags (with highlight)
    const tagsBox = node.querySelector(".tags");
    (p.tags || []).slice(0, 4).forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag";
if (state.query && state.query.split(/\s+/).some(tok => tok.length >= 2 && t.toLowerCase().includes(tok)))
        span.innerHTML = "#" + highlightText(t, state.query);
        span.classList.add("tag-match");
      } else {
        span.textContent = `#${t}`;
      }
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
    const label = btn.querySelector(".copy-label");
    if (label) label.textContent = "Copied";
    showToast();
    setTimeout(() => {
      btn.classList.remove("copied");
      if (label) label.textContent = "Copy";
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