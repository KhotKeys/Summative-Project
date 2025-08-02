class ReflectionApp {
  constructor() {
    this.currentLanguage = "en"; // Default language
    this.formData = {};
    this.isDraftMode = false;

    // Initialize the application
    this.init();
  }

  // Initialize the application
  init() {
    this.detectBrowserLanguage();
    this.loadSavedLanguagePreference();
    this.loadSavedDraft();
    this.setupEventListeners();
    this.updateLanguage(this.currentLanguage);
    this.createMessageCard(); //

    console.log("Reflection App initialized");
  }

  createMessageCard() {
    if (document.getElementById("message-card")) return; // Already exists

    const messageCard = document.createElement("div");
    messageCard.id = "message-card";
    messageCard.className = "message-card hidden";

    messageCard.innerHTML = `
            <div class="message-card-content">
                <div class="message-card-header">
                    <div class="message-icon">
                        <svg id="success-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg id="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg id="info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <button class="message-card-close" id="close-message-card" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="message-card-body">
                    <h3 class="message-card-title" id="message-card-title">Success!</h3>
                    <p class="message-card-text" id="message-card-text">Your reflection has been submitted successfully.</p>
                    <div class="message-card-actions" id="message-card-actions">
                        <!-- Dynamic action buttons will be added here -->
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(messageCard);

    // Add close event listener
    document
      .getElementById("close-message-card")
      .addEventListener("click", () => {
        this.hideMessageCard();
      });

    // Close on background click
    messageCard.addEventListener("click", (e) => {
      if (e.target === messageCard) {
        this.hideMessageCard();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !messageCard.classList.contains("hidden")) {
        this.hideMessageCard();
      }
    });
  }

  showMessageCard(title, message, type = "success", actions = []) {
    const messageCard = document.getElementById("message-card");
    const titleEl = document.getElementById("message-card-title");
    const textEl = document.getElementById("message-card-text");
    const actionsEl = document.getElementById("message-card-actions");

    // Update content
    titleEl.textContent = title;
    textEl.textContent = message;

    // Clear previous actions
    actionsEl.innerHTML = "";

    // Add action buttons
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.className = `message-card-btn ${action.type || "primary"}`;
      button.textContent = action.text;
      button.addEventListener("click", action.onClick);
      actionsEl.appendChild(button);
    });

    // Set type classes
    messageCard.className = `message-card ${type}`;

    // Show icons based on type
    document.getElementById("success-icon").style.display =
      type === "success" ? "block" : "none";
    document.getElementById("error-icon").style.display =
      type === "error" ? "block" : "none";
    document.getElementById("info-icon").style.display =
      type === "info" ? "block" : "none";

    // Show card with animation
    setTimeout(() => {
      messageCard.classList.add("show");
    }, 10);
  }

  hideMessageCard() {
    const messageCard = document.getElementById("message-card");
    messageCard.classList.remove("show");

    setTimeout(() => {
      messageCard.className = "message-card hidden";
    }, 300);
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split("-")[0];

    if (window.translations && window.translations[langCode]) {
      this.currentLanguage = langCode;
      console.log(`Browser language detected: ${langCode}`);
    }
  }

  loadSavedLanguagePreference() {
    const savedLang = localStorage.getItem("reflectionPageLanguage");
    if (savedLang && window.translations[savedLang]) {
      this.currentLanguage = savedLang;
      console.log(`Loaded saved language preference: ${savedLang}`);
    }
  }

  loadSavedDraft() {
    const savedDraft = localStorage.getItem("reflectionDraft");
    if (savedDraft) {
      try {
        this.formData = JSON.parse(savedDraft);
        this.populateForm();
        console.log("Loaded saved draft");
      } catch (error) {
        console.error("Error loading draft:", error);
        localStorage.removeItem("reflectionDraft");
      }
    }
  }

  setupEventListeners() {
    // Language switcher
    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        this.changeLanguage(e.target.value);
      });
    }

    // Form submission
    const reflectionForm = document.getElementById("reflection-form");
    if (reflectionForm) {
      reflectionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitReflection();
      });
    }

    // Save draft button
    const saveDraftBtn = document.getElementById("save-draft");
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener("click", () => {
        this.saveDraft();
      });
    }

    // Clear form button
    const clearFormBtn = document.getElementById("clear-form");
    if (clearFormBtn) {
      clearFormBtn.addEventListener("click", () => {
        this.clearForm();
      });
    }

    // Edit responses button
    const editResponsesBtn = document.getElementById("edit-responses");
    if (editResponsesBtn) {
      editResponsesBtn.addEventListener("click", () => {
        this.editResponses();
      });
    }

    // Auto-save on input change (debounced)
    const textareas = document.querySelectorAll(".answer-textarea");
    textareas.forEach((textarea) => {
      textarea.addEventListener(
        "input",
        this.debounce(() => {
          this.autoSave();
        }, 2000)
      );
    });

    // Form validation on blur
    textareas.forEach((textarea) => {
      textarea.addEventListener("blur", () => {
        this.validateField(textarea);
      });
    });
  }

  changeLanguage(langCode) {
    if (window.translations[langCode]) {
      this.currentLanguage = langCode;
      this.updateLanguage(langCode);
      this.saveLanguagePreference(langCode);
      console.log(`Language changed to: ${langCode}`);
    }
  }

  updateLanguage(langCode) {
    const translation = window.translations[langCode];
    if (!translation) return;

    document.title = translation.page.title;

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translatedText = this.getNestedTranslation(translation, key);
      if (translatedText) {
        element.textContent = translatedText;
      }
    });

    const placeholderElements = document.querySelectorAll(
      "[data-i18n-placeholder]"
    );
    placeholderElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translatedText = this.getNestedTranslation(translation, key);
      if (translatedText) {
        element.placeholder = translatedText;
      }
    });

    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
      languageSelect.value = langCode;
    }

    const currentLangDisplay = document.getElementById("current-lang-display");
    if (currentLangDisplay && window.languageNames) {
      currentLangDisplay.textContent =
        window.languageNames[langCode] || langCode.toUpperCase();
    }

    document.documentElement.lang = langCode;

    document.body.classList.add("fade-in");
    setTimeout(() => {
      document.body.classList.remove("fade-in");
    }, 500);
  }

  getNestedTranslation(translation, key) {
    return key.split(".").reduce((obj, k) => obj && obj[k], translation);
  }

  saveLanguagePreference(langCode) {
    localStorage.setItem("reflectionPageLanguage", langCode);
  }

  collectFormData() {
    const formData = {};
    const form = document.getElementById("reflection-form");
    const formElements = form.querySelectorAll("textarea, input, select");

    formElements.forEach((element) => {
      if (element.name) {
        formData[element.name] = element.value;
      }
    });

    formData.language = this.currentLanguage;
    formData.timestamp = new Date().toISOString();
    formData.userAgent = navigator.userAgent;
    formData.browserLanguage = navigator.language;

    return formData;
  }

  populateForm() {
    Object.keys(this.formData).forEach((key) => {
      const element = document.querySelector(`[name="${key}"]`);
      if (element && this.formData[key]) {
        element.value = this.formData[key];
      }
    });
  }

  validateField(field) {
    const isRequired = field.hasAttribute("required");
    const isEmpty = !field.value.trim();

    if (isRequired && isEmpty) {
      field.classList.add("error");
      return false;
    } else {
      field.classList.remove("error");
      return true;
    }
  }

  validateForm() {
    const requiredFields = document.querySelectorAll("textarea[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  autoSave() {
    this.formData = this.collectFormData();
    localStorage.setItem("reflectionDraft", JSON.stringify(this.formData));
    console.log("Auto-saved draft");
  }

  saveDraft() {
    this.formData = this.collectFormData();
    localStorage.setItem("reflectionDraft", JSON.stringify(this.formData));
    this.isDraftMode = true;

    const translation = window.translations[this.currentLanguage];

    //  Show card instead of alert
    this.showMessageCard(
      "Draft Saved!",
      translation.messages.draftSaved,
      "success",
      [
        {
          text: "Continue Editing",
          type: "primary",
          onClick: () => this.hideMessageCard(),
        },
      ]
    );

    console.log("Draft saved manually");
  }

  submitReflection() {
    if (!this.validateForm()) {
      const translation = window.translations[this.currentLanguage];

      // Show error card instead of alert
      this.showMessageCard(
        "Form Incomplete",
        translation.messages.pleaseComplete,
        "error",
        [
          {
            text: "Fix Form",
            type: "primary",
            onClick: () => {
              this.hideMessageCard();
              // Focus on first error field
              const firstError = document.querySelector(
                ".answer-textarea.error"
              );
              if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            },
          },
        ]
      );
      return;
    }

    // Collect final form data
    this.formData = this.collectFormData();
    this.formData.isSubmitted = true;
    this.formData.submittedAt = new Date().toISOString();

    // Save to localStorage as final submission
    localStorage.setItem("reflectionSubmission", JSON.stringify(this.formData));

    // Clear draft
    localStorage.removeItem("reflectionDraft");

    const translation = window.translations[this.currentLanguage];

    // Show success card with actions
    this.showMessageCard(
      "Reflection Submitted!",
      translation.messages.submissionSuccess,
      "success",
      [
        {
          text: "View Summary",
          type: "primary",
          onClick: () => {
            this.hideMessageCard();
            this.showResponseSection();
          },
        },
        {
          text: "Submit Another",
          type: "secondary",
          onClick: () => {
            this.hideMessageCard();
            this.clearForm();
          },
        },
      ]
    );

    console.log("Reflection submitted:", this.formData);
  }

  clearForm() {
    const translation = window.translations[this.currentLanguage];

    // Show confirmation card instead of confirm()
    this.showMessageCard(
      "Clear Form?",
      "Are you sure you want to clear all responses? This action cannot be undone.",
      "info",
      [
        {
          text: "Yes, Clear All",
          type: "danger",
          onClick: () => {
            const form = document.getElementById("reflection-form");
            form.reset();

            localStorage.removeItem("reflectionDraft");
            this.formData = {};

            this.hideResponseSection();
            this.hideMessageCard();

            // Show success card
            setTimeout(() => {
              this.showMessageCard(
                "Form Cleared",
                translation.messages.formCleared,
                "success",
                [
                  {
                    text: "Start Fresh",
                    type: "primary",
                    onClick: () => this.hideMessageCard(),
                  },
                ]
              );
            }, 500);

            console.log("Form cleared");
          },
        },
        {
          text: "Cancel",
          type: "secondary",
          onClick: () => this.hideMessageCard(),
        },
      ]
    );
  }

  editResponses() {
    this.hideResponseSection();
    this.populateForm();
  }

  showResponseSection() {
    const form = document.getElementById("reflection-form");
    const responseSection = document.getElementById("response-display");

    if (form && responseSection) {
      form.style.display = "none";
      responseSection.style.display = "block";
      responseSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  hideResponseSection() {
    const form = document.getElementById("reflection-form");
    const responseSection = document.getElementById("response-display");

    if (form && responseSection) {
      form.style.display = "block";
      responseSection.style.display = "none";
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  getCurrentData() {
    return this.collectFormData();
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  exportData() {
    const data = this.collectFormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `reflection-${this.currentLanguage}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Data exported");
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.reflectionApp = new ReflectionApp();

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      window.reflectionApp.saveDraft();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      window.reflectionApp.submitReflection();
    }
  });

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "📥 Export Data";
  exportBtn.className = "export-button";
  exportBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 10px 15px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1000;
    `;
  exportBtn.addEventListener("click", () => {
    window.reflectionApp.exportData();
  });
  document.body.appendChild(exportBtn);

  console.log("Reflection page fully loaded and initialized");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.reflectionApp) {
    window.reflectionApp.autoSave();
  }
});

window.addEventListener("beforeunload", () => {
  if (window.reflectionApp) {
    window.reflectionApp.autoSave();
  }
});
