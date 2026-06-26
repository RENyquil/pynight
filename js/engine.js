// ----------------------
// Pyodide Loader
// ----------------------
let pyodideReady = null;

async function getPyodideInstance() {
  if (!pyodideReady) {
    pyodideReady = loadPyodide();
  }
  return await pyodideReady;
}

// ----------------------
// Theme Animation Helpers
// ----------------------
function startThemeAnimation(template) {
  const THEME_ANIMATIONS = {
    matrix: "matrix-rain",
    diehard: "snow",
    america: "america",
    jaws: null,
    unthemed: null
  };

  const animation = THEME_ANIMATIONS[template];

  if (animation && window.startAnimation) {
    requestAnimationFrame(() => {
      window.startAnimation(animation);
    });
  }
}

function triggerSuccessAnimation() {
  if (window.launchFireworks) {
    window.launchFireworks({
      mode: "victory",
      burstCount: 7
    });
  }
}

// ----------------------
// Load Challenge
// ----------------------
async function loadChallenge() {
  const params = new URLSearchParams(window.location.search);
  const challengeId = params.get("challenge");

  if (!challengeId) {
    document.body.innerHTML =
      "<h2 style='color:red'>❌ No challenge specified in URL.</h2>";
    return;
  }

  let challenges;

  try {
    const res = await fetch("challenges.json");
    challenges = await res.json();
  } catch (e) {
    document.body.innerHTML =
      "<h2 style='color:red'>❌ Failed to load challenges.json</h2>";
    return;
  }

  const c = Array.isArray(challenges)
    ? challenges.find(ch => ch.id === challengeId)
    : null;

  if (!c) {
    document.body.innerHTML = `
      <h2 style="color:red">❌ Challenge not found: ${challengeId}</h2>
      <p>Check spelling or challenges.json</p>
    `;
    return;
  }

  // ----------------------
  // Load Template CSS
  // ----------------------
  let templates = [];

  try {
    const templateListURL = new URL(
      "templates/template_list.json",
      document.baseURI
    );

    const res = await fetch(templateListURL);
    templates = await res.json();
  } catch {
    console.warn(
      "⚠️ Failed to load template_list.json, falling back to unthemed"
    );
  }

  const template =
    typeof c.template === "string" && templates.includes(c.template)
      ? c.template
      : "unthemed";

  const themeCss = document.getElementById("theme-css");

  themeCss.href = new URL(`templates/${template}.css`, document.baseURI).href;

  document.body.dataset.theme = template;

  // Start background animation after theme stylesheet is attached.
  startThemeAnimation(template);

  // ----------------------
  // Load Challenge Text
  // ----------------------
  document.getElementById("challenge-description").textContent =
    c.challenge_description || "";

  document.getElementById("challenge-stamp").textContent =
    c.challenge_stamp || "";

  const taskList = document.getElementById("challenge-tasks");
  taskList.innerHTML = "";

  (c.tasks || []).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    taskList.appendChild(li);
  });

  document.getElementById("challenge-example").textContent = c.example || "";

  Editor.setValue(c.starter_code || "");

  // ----------------------
  // Setup challenge variables
  // ----------------------
  window.__SETUP_CODE__ = c.setup_code || "";
  window.__TEST_CODE__ = c.test_code || "output";
  window.__FLAG__ = c.flag || "";
  window.__REQUIRED_TERMS__ = c.required_terms || [];
  window.__FORBIDDEN_TERMS__ = c.forbidden_terms || [];
  window.__CURRENT_TEMPLATE__ = template;

  // ----------------------
  // Handle expected output
  // ----------------------
  if (c.expected) {
    if (typeof c.expected === "string" && c.expected.startsWith("assets/")) {
      try {
        const res = await fetch(c.expected);
        window.__EXPECTED__ = await res.text();
      } catch {
        console.warn(`Failed to load expected file ${c.expected}`);
        window.__EXPECTED__ = "";
      }
    } else {
      window.__EXPECTED__ = c.expected;
    }
  } else {
    window.__EXPECTED__ = "";
  }
}

// ----------------------
// Run User Code
// ----------------------
async function runCode() {
  const userCode = Editor.getValue();
  const outputEl = document.getElementById("output");

  outputEl.value = "";

  try {
    const pyodide = await getPyodideInstance();

    // ----------------------
    // Load setup_code
    // ----------------------
    let setupCode = window.__SETUP_CODE__ || "";

    if (Array.isArray(setupCode)) {
      setupCode = setupCode.join("\n");
    }

    const fileAssignRegex = /=\s*"(.*?)"/g;
    const matches = [...setupCode.matchAll(fileAssignRegex)];

    for (const match of matches) {
      const fullMatch = match[0];
      const filePath = match[1];

      try {
        const res = await fetch(filePath);
        const content = await res.text();

        const escapedContent = content
          .replace(/\\/g, "\\\\")
          .replace(/"""/g, '\\"\\"\\"');

        setupCode = setupCode.replace(
          fullMatch,
          `= """${escapedContent}"""`
        );
      } catch {
        console.warn(
          `Failed to load file ${filePath}, keeping original string`
        );
      }
    }

    // ----------------------
    // Run setup code
    // ----------------------
    if (setupCode) {
      await pyodide.runPythonAsync(setupCode);
    }

    // ----------------------
    // Check forbidden terms
    // ----------------------
    const userCodeLower = userCode.toLowerCase();

    for (const term of window.__FORBIDDEN_TERMS__ || []) {
      if (term && userCodeLower.includes(term.toLowerCase())) {
        outputEl.value = `❌ Forbidden term used: "${term}"`;
        return;
      }
    }

    // ----------------------
    // Check required terms
    // ----------------------
    let missingRequired = false;

    for (const term of window.__REQUIRED_TERMS__ || []) {
      if (term && !userCodeLower.includes(term.toLowerCase())) {
        missingRequired = true;
        break;
      }
    }

    // ----------------------
    // Run user code
    // ----------------------
    await pyodide.runPythonAsync(userCode);

    // ----------------------
    // Run test code
    // ----------------------
    const result = await pyodide.runPythonAsync(
      window.__TEST_CODE__ || "output"
    );

    // ----------------------
    // Normalize output
    // ----------------------
    const normalize = str =>
      String(str ?? "")
        .replace(/\r\n/g, "\n")
        .trim();

    const normalizedResult = normalize(result);
    const normalizedExpected = normalize(window.__EXPECTED__);

    // ----------------------
    // Compare result
    // ----------------------
    if (!missingRequired && normalizedResult === normalizedExpected) {
      outputEl.value = `✅ SUCCESS\n${window.__FLAG__}`;

      triggerSuccessAnimation();
    } else {
      outputEl.value = `▶️ Python Output:\n${normalizedResult}`;
    }
  } catch (err) {
    outputEl.value = "⚠️ Error while running code:\n" + err;
  }
}

window.runCode = runCode;

// ----------------------
// Initialize
// ----------------------
loadChallenge();
