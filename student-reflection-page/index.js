function setLanguage(lang) {
  const t = translations[lang];
  
  // Update text content
  document.getElementById("title").innerText = t.title;
  document.getElementById("greeting").innerText = t.greeting;
  document.getElementById("q1").innerText = t.q1;
  document.getElementById("q2").innerText = t.q2;
  document.getElementById("q3").innerText = t.q3;
  document.getElementById("clearText").innerText = t.clearText;
  document.getElementById("submitText").innerText = t.submitText;
  
  // Update placeholders
  document.getElementById("answer1").placeholder = t.placeholders.q1;
  document.getElementById("answer2").placeholder = t.placeholders.q2;
  document.getElementById("answer3").placeholder = t.placeholders.q3;
  
  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });
  
  // Store language preference
  localStorage.setItem("lang", lang);
}

function clearForm() {
  const textareas = document.querySelectorAll('.form-textarea');
  textareas.forEach(textarea => {
    textarea.value = '';
  });
  
  // Add animation effect
  textareas.forEach((textarea, index) => {
    setTimeout(() => {
      textarea.style.transform = 'scale(0.98)';
      setTimeout(() => {
        textarea.style.transform = 'scale(1)';
      }, 100);
    }, index * 50);
  });
}

function submitReflection(event) {
  event.preventDefault();
  
  const answers = {
    question1: document.getElementById("answer1").value.trim(),
    question2: document.getElementById("answer2").value.trim(),
    question3: document.getElementById("answer3").value.trim(),
    language: localStorage.getItem("lang") || "en",
    timestamp: new Date().toISOString()
  };
  
  // Validate form
  if (!answers.question1 || !answers.question2 || !answers.question3) {
    alert("Please fill in all fields before submitting.");
    return;
  }
  
  // Simulate form submission
  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    // Store in localStorage (in a real app, this would be sent to a server)
    const existingReflections = JSON.parse(localStorage.getItem("reflections") || "[]");
    existingReflections.push(answers);
    localStorage.setItem("reflections", JSON.stringify(existingReflections));
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    document.getElementById("reflectionForm").reset();
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

function showSuccessMessage() {
  const currentLang = localStorage.getItem("lang") || "en";
  const message = translations[currentLang].successMessage;
  
  // Create success message element if it doesn't exist
  let successDiv = document.querySelector('.success-message');
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    const form = document.querySelector('.reflection-form');
    form.insertBefore(successDiv, form.firstChild);
  } else {
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  }
  
  successDiv.classList.add('show');
  
  // Hide after 5 seconds
  setTimeout(() => {
    successDiv.classList.remove('show');
  }, 5000);
}

function initializeApp() {
  // Set default language
  const defaultLang = localStorage.getItem("lang") || "en";
  setLanguage(defaultLang);
  
  // Add event listeners
  document.getElementById("clearBtn").addEventListener("click", clearForm);
  document.getElementById("reflectionForm").addEventListener("submit", submitReflection);
  
  // Add fade-in animation to main elements
  document.querySelector('.hero-section').classList.add('fade-in');
  setTimeout(() => {
    document.querySelector('.reflection-form').classList.add('fade-in');
  }, 200);
  
  // Auto-save functionality
  const textareas = document.querySelectorAll('.form-textarea');
  textareas.forEach((textarea, index) => {
    textarea.addEventListener('input', () => {
      const draftKey = `draft_answer${index + 1}`;
      localStorage.setItem(draftKey, textarea.value);
    });
    
    // Restore draft on load
    const draftKey = `draft_answer${index + 1}`;
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      textarea.value = draft;
    }
  });
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', initializeApp);