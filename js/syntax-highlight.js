!function ($) {
  var storage = window.localStorage;
  var recentLanguages = [];
  var lastStyle = "Default";
  var els = {};
  var loadedHighlightLanguages = false;

  var languageNames = {
    html: "HTML",
    xml: "XML",
    css: "CSS",
    javascript: "JavaScript",
    json: "JSON",
    bash: "Bash",
    python: "Python",
    typescript: "TypeScript",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    ruby: "Ruby",
    go: "Go",
    rust: "Rust",
    sql: "SQL",
    yaml: "YAML",
    markdown: "Markdown",
    powershell: "PowerShell",
    dockerfile: "Dockerfile",
    plaintext: "Plain text"
  };

  var preferredLanguages = [
    "html", "css", "javascript", "json", "xml", "bash", "python", "typescript",
    "java", "cpp", "csharp", "php", "ruby", "go", "rust", "sql", "yaml",
    "markdown", "powershell", "dockerfile", "plaintext"
  ];

  if (storage) {
    try {
      lastStyle = storage.lastStyle || lastStyle;
      var saved = JSON.parse(storage.recentLanguages || "[]");
      if ($.isArray(saved)) recentLanguages = saved;
    } catch (ignore) {}
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function displayName(language) {
    return languageNames[language] || language.replace(/-/g, " ").replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  function allLanguages() {
    var seen = {};
    var languages = [];

    function add(language) {
      if (!language || seen[language]) return;
      seen[language] = true;
      languages.push(language);
    }

    preferredLanguages.forEach(add);
    if (window.hljs && hljs.listLanguages) {
      hljs.listLanguages().sort().forEach(add);
    }

    return languages;
  }

  function optionHtml(language) {
    return '<option value="' + language + '">' + displayName(language) + "</option>";
  }

  function renderRecentLanguages() {
    var html = "";
    recentLanguages.forEach(function (language) {
      html += optionHtml(language);
    });
    els.groupRecent.html(html);
  }

  function rememberLanguage(language) {
    if (!language) return;

    recentLanguages.unshift(language);
    var unique = [];
    recentLanguages.forEach(function (item) {
      if ($.inArray(item, unique) === -1) unique.push(item);
    });

    recentLanguages = unique.slice(0, 10);
    if (storage) storage.recentLanguages = JSON.stringify(recentLanguages);
    renderRecentLanguages();
    els.language.val(language);
  }

  function highlightCode(input) {
    var code = els.code[0];
    var language = els.language.val() || "plaintext";
    var result;

    if (!code) return "";

    if (window.hljs && hljs.listLanguages && !loadedHighlightLanguages) {
      loadedHighlightLanguages = true;
      populateLanguages();
      els.language.val(language);
    }

    code.removeAttribute("data-highlighted");
    code.className = "hljs language-" + language;

    try {
      if (window.hljs && language !== "plaintext" && hljs.getLanguage(language)) {
        result = hljs.highlight(String(input), {
          language: language,
          ignoreIllegals: true
        }).value;
      } else if (window.hljs && language !== "plaintext" && hljs.highlightAuto) {
        result = hljs.highlightAuto(String(input)).value;
      } else {
        result = escapeHtml(input);
      }
    } catch (ignore) {
      result = escapeHtml(input);
    }

    code.innerHTML = result;
    rememberLanguage(language);
    return input;
  }

  function populateLanguages() {
    var selected = els.language.val() || recentLanguages[0] || "html";
    var html = "";
    allLanguages().forEach(function (language) {
      html += optionHtml(language);
    });
    els.groupAll.html(html);
    renderRecentLanguages();
    els.language.val(selected);
    if (!els.language.val()) els.language.val("html");
  }

  function populateStyles() {
    var options = "";
    $('link[title]').each(function () {
      options += '<option value="' + this.title + '">' + this.title + "</option>";
    });
    els.style.html(options).val(lastStyle);
    if (!els.style.val()) els.style.val("Default");
    applyStyle();
  }

  function applyStyle() {
    var style = els.style.val();
    $('link[title]').prop("disabled", true);
    $('link[title]').filter(function () {
      return this.title === style;
    }).prop("disabled", false);
    if (storage) storage.lastStyle = style;
  }

  function refreshHighlightLanguages() {
    if (!window.hljs || !hljs.listLanguages || loadedHighlightLanguages) return false;
    loadedHighlightLanguages = true;
    populateLanguages();
    return true;
  }

  window.highlight = highlightCode;

  $(document).ready(function () {
    els.code = $("pre.syntax-highlight code");
    els.language = $("#language");
    els.groupRecent = els.language.find('[label="Recent"]');
    els.groupAll = els.language.find('[label="All"]');
    els.style = $("#style");

    els.language.on("change", function () {
      rememberLanguage(els.language.val());
      if (window.ot && ot.autoUpdate) ot.autoUpdate();
    });

    els.style.on("change", applyStyle);

    populateLanguages();
    populateStyles();

    if (!refreshHighlightLanguages()) {
      var languageTimer = setInterval(function () {
        if (refreshHighlightLanguages()) clearInterval(languageTimer);
      }, 50);
      setTimeout(function () {
        clearInterval(languageTimer);
      }, 5000);
    }
  });
}(jQuery);
