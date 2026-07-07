/* ==========================================
   AUTH.JS — Login & Register Logic
   ========================================== */

// ── Utility ────────────────────────────────────────────────────────────────
function showErr(inputEl, errEl) {
  inputEl.classList.add("is-invalid");
  inputEl.classList.remove("is-valid");
  errEl.style.display = "block";
}

function clearErr(inputEl, errEl) {
  inputEl.classList.remove("is-invalid");
  inputEl.classList.add("is-valid");
  errEl.style.display = "none";
}

function showErrOnly(errEl) {
  errEl.style.display = "block";
}

function clearErrOnly(errEl) {
  errEl.style.display = "none";
}

function validEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

// ── Password visibility toggle ─────────────────────────────────────────────
document.querySelectorAll(".auth-toggle-pw").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.previousElementSibling;
    const icon = btn.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const roleEl = document.getElementById("loginRole");
  const emailEl = document.getElementById("loginEmail");
  const pwEl = document.getElementById("loginPassword");
  const roleErr = document.getElementById("loginRoleErr");
  const emailErr = document.getElementById("loginEmailErr");
  const pwErr = document.getElementById("loginPasswordErr");

  // Live clear on change/input
  roleEl.addEventListener("change", () => {
    if (roleEl.value) clearErr(roleEl, roleErr);
  });

  emailEl.addEventListener("input", () => {
    if (validEmail(emailEl.value)) clearErr(emailEl, emailErr);
  });

  pwEl.addEventListener("input", () => {
    if (pwEl.value) clearErr(pwEl, pwErr);
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    if (!roleEl.value) {
      showErr(roleEl, roleErr);
      valid = false;
    } else {
      clearErr(roleEl, roleErr);
    }

    if (!validEmail(emailEl.value)) {
      showErr(emailEl, emailErr);
      valid = false;
    } else {
      clearErr(emailEl, emailErr);
    }

    if (!pwEl.value) {
      showErr(pwEl, pwErr);
      valid = false;
    } else {
      clearErr(pwEl, pwErr);
    }

    if (!valid) return;

    const btn = loginForm.querySelector(".auth-submit-btn");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Signing in…`;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `<span class="btn-text">Sign In</span><i class="fa-solid fa-arrow-right ms-2"></i>`;
      alert("Login successful! (Connect to your backend to proceed.)");
    }, 1200);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
//  REGISTER PAGE
// ══════════════════════════════════════════════════════════════════════════════
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  // ── Elements ──────────────────────────────────────────────────────────────
  const usernameEl = document.getElementById("regUsername");
  const roleEl = document.getElementById("regRole");
  const emailEl = document.getElementById("regEmail");
  const pwEl = document.getElementById("regPassword");
  const confirmEl = document.getElementById("regConfirmPassword");
  const termsEl = document.getElementById("regTerms");

  const usernameErr = document.getElementById("regUsernameErr");
  const roleErr = document.getElementById("regRoleErr");
  const emailErr = document.getElementById("regEmailErr");
  const pwErr = document.getElementById("regPasswordErr");
  const confirmErr = document.getElementById("regConfirmPasswordErr");
  const termsErr = document.getElementById("regTermsErr");

  // Strength meter elements
  const strengthFill = document.getElementById("pwStrengthFill");
  const strengthLabel = document.getElementById("pwStrengthLabel");
  const ruleLen = document.getElementById("ruleLen");
  const ruleUpper = document.getElementById("ruleUpper");
  const ruleNum = document.getElementById("ruleNum");
  const ruleSpecial = document.getElementById("ruleSpecial");

  // ── Username: block numbers & special chars ───────────────────────────────
  usernameEl.addEventListener("keydown", (e) => {
    const nav = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Home",
      "End",
    ];
    if (nav.includes(e.key)) return;
    if (!/^[a-zA-Z\s]$/.test(e.key)) e.preventDefault();
  });

  usernameEl.addEventListener("paste", (e) => {
    e.preventDefault();
    const cleaned = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/[^a-zA-Z\s]/g, "");
    document.execCommand("insertText", false, cleaned);
  });

  // ── Password strength ─────────────────────────────────────────────────────
  function evaluatePassword(pw) {
    const r = {
      len: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      num: /[0-9]/.test(pw),
      special: /[^a-zA-Z0-9]/.test(pw),
    };
    ruleLen.classList.toggle("passed", r.len);
    ruleUpper.classList.toggle("passed", r.upper);
    ruleNum.classList.toggle("passed", r.num);
    ruleSpecial.classList.toggle("passed", r.special);

    const score = Object.values(r).filter(Boolean).length;
    const levels = ["", "weak", "fair", "good", "strong"];
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    strengthFill.className = "pw-strength-fill " + (levels[score] || "");
    strengthLabel.className = "pw-strength-label " + (levels[score] || "");
    strengthLabel.textContent = pw.length ? labels[score] : "";
    return score;
  }

  // ── Live validation listeners ─────────────────────────────────────────────
  usernameEl.addEventListener("input", () => {
    if (usernameEl.value.trim() && !/[^a-zA-Z\s]/.test(usernameEl.value))
      clearErr(usernameEl, usernameErr);
  });

  roleEl.addEventListener("change", () => {
    if (roleEl.value) clearErr(roleEl, roleErr);
  });

  emailEl.addEventListener("input", () => {
    if (validEmail(emailEl.value)) clearErr(emailEl, emailErr);
  });

  pwEl.addEventListener("input", () => {
    const score = evaluatePassword(pwEl.value);
    if (score >= 3) clearErr(pwEl, pwErr);
    // re-check confirm match live
    if (confirmEl.value) {
      if (confirmEl.value === pwEl.value) clearErr(confirmEl, confirmErr);
      else showErr(confirmEl, confirmErr);
    }
  });

  confirmEl.addEventListener("input", () => {
    if (confirmEl.value === pwEl.value) clearErr(confirmEl, confirmErr);
    else if (confirmEl.value) showErr(confirmEl, confirmErr);
  });

  termsEl.addEventListener("change", () => {
    if (termsEl.checked) clearErrOnly(termsErr);
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Username
    if (!usernameEl.value.trim() || /[^a-zA-Z\s]/.test(usernameEl.value)) {
      showErr(usernameEl, usernameErr);
      valid = false;
    } else clearErr(usernameEl, usernameErr);

    // Role
    if (!roleEl.value) {
      showErr(roleEl, roleErr);
      valid = false;
    } else clearErr(roleEl, roleErr);

    // Email
    if (!validEmail(emailEl.value)) {
      showErr(emailEl, emailErr);
      valid = false;
    } else clearErr(emailEl, emailErr);

    // Password
    const score = evaluatePassword(pwEl.value);
    if (score < 3) {
      showErr(pwEl, pwErr);
      valid = false;
    } else clearErr(pwEl, pwErr);

    // Confirm password
    if (!confirmEl.value || confirmEl.value !== pwEl.value) {
      showErr(confirmEl, confirmErr);
      valid = false;
    } else clearErr(confirmEl, confirmErr);

    // Terms
    if (!termsEl.checked) {
      showErrOnly(termsErr);
      valid = false;
    } else clearErrOnly(termsErr);

    if (!valid) return;

    const btn = registerForm.querySelector(".auth-submit-btn");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Creating account…`;
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1400);
  });
}
