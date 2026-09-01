const apiBase =
  window.HEALTHSPHERE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://your-backend-domain.example.com');

const translations = {
  en: {
    heroEyebrow: 'AI-powered rural healthcare navigation',
    heroHeading: 'Connecting every patient to the right care, at the right place, at the right time.',
    heroText: 'Anamaya AI helps communities find suitable facilities, understand symptoms, track referrals, and access scheme support through a digital health passport.',
    ctaPrimary: 'Try the platform',
    ctaSecondary: 'View patient journey',
    statusChecking: 'Checking backend connection...',
    voicePrompt: 'Anamaya AI is ready to guide patients with easier care navigation and support.',
    voiceIntro: 'Anamaya AI voice assistant is active. Please choose a language and listen to the guidance.'
  },
  hi: {
    heroEyebrow: 'कृषि स्वास्थ्य सेवा नेविगेशन',
    heroHeading: 'हर रोगी को सही समय पर सही देखभाल से जोड़ना।',
    heroText: 'Anamaya AI ग्रामीण समुदायों को उचित सुविधा चुनने, लक्षण समझने, रेफरल ट्रैक करने और डिज़िटल हेल्थ पासपोर्ट के माध्यम से योजना सहायता प्राप्त करने में मदद करता है।',
    ctaPrimary: 'प्लेटफ़ॉर्म आज़माएँ',
    ctaSecondary: 'मरीज की यात्रा देखें',
    statusChecking: 'बैकएंड कनेक्शन जाँच रहा है...',
    voicePrompt: 'Anamaya AI ग्रामीण लोगों को आसान देखभाल मार्गदर्शन प्रदान करता है।',
    voiceIntro: 'Anamaya AI वॉयस असिस्टेंट सक्रिय है। कृपया भाषा चुनें और मार्गदर्शन सुनें।'
  },
  mr: {
    heroEyebrow: 'ग्रामीण आरोग्य नेव्हिगेशन',
    heroHeading: 'प्रत्येक रुग्णाला योग्य काळात योग्य उपचाराकडे नेणे.',
    heroText: 'Anamaya AI ग्रामीण समुदायांना योग्य सुविधा निवडण्यास, लक्षण समजण्यास, रेफरल ट्रॅक करण्यास आणि डिजिटल हेल्थ पासपोर्टद्वारे योजना सल्ला मिळण्यास मदत करते.',
    ctaPrimary: 'प्लॅटफॉर्म वापरा',
    ctaSecondary: 'रुग्ण प्रवास पहा',
    statusChecking: 'बॅकएंड जोडणी तपासत आहे...',
    voicePrompt: 'Anamaya AI ग्रामीण लोकांसाठी सोपी आरोग्य दिशा देतो.',
    voiceIntro: 'Anamaya AI ध्वनी सहाय्यक सक्रिय आहे. कृपया भाषा निवडा आणि माहिती ऐका.'
  }
};

function applyTheme(theme) {
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', resolvedTheme);
  const button = document.getElementById('themeToggle');
  if (button) {
    button.textContent = resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    button.setAttribute('aria-label', `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`);
  }
  localStorage.setItem('healthsphere-theme', resolvedTheme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('healthsphere-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
}

function showDemoApp() {
  document.getElementById('demoApp').classList.remove('hidden');
  document.getElementById('journey').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('demoApp').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setActivePanel(panelId) {
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.panel === panelId);
  });
  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === panelId);
  });
}

function runAssessment() {
  const severity = document.getElementById('severity').value;
  const fever = document.getElementById('fever').value;
  const breath = document.getElementById('breath').value;
  const weakness = document.getElementById('weakness').value;
  const age = document.getElementById('ageGroup').value;

  let riskLevel = 'Low';
  let recommendation = 'Continue routine primary care review and hydration monitoring.';

  if (severity === 'Severe' || fever === 'High' || breath === 'Often' || weakness === 'Yes') {
    riskLevel = 'High';
    recommendation = 'Refer to CHC or district hospital within 24 hours for urgent evaluation and oxygen monitoring.';
  } else if (severity === 'Moderate' || fever === 'Low' || breath === 'Sometimes') {
    riskLevel = 'Moderate';
    recommendation = 'Book a same-day PHC review for symptom monitoring and basic diagnostics.';
  }

  if (age === '60+' && riskLevel !== 'High') {
    riskLevel = 'Moderate';
    recommendation = 'Senior patient pathway recommended: same-day clinical assessment and blood pressure review.';
  }

  document.getElementById('assessmentResult').innerHTML = `
    <h4>Assessment result</h4>
    <p><strong>Risk level:</strong> ${riskLevel}<br>
    <strong>Recommendation:</strong> ${recommendation}</p>
  `;
}

function generateReferralId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HS-${random}`;
}

async function checkBackend() {
  const statusCard = document.getElementById('backendStatus');
  if (!statusCard) return;

  try {
    const response = await fetch(`${apiBase}/health`, { method: 'GET', mode: 'cors' });
    if (!response.ok) throw new Error('Backend not responding');

    const data = await response.json();
    statusCard.classList.add('connected');
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Backend connected: ${data.service || 'Anamaya AI'} (${data.status})</span>
    `;
  } catch (error) {
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Backend offline — set HEALTHSPHERE_API_URL or start the API on localhost:8000</span>
    `;
  }
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

function setLanguage(lang) {
  const dictionary = translations[lang] || translations.en;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = lang;
  }
}

function speakAssistant(text) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById('languageSelect')?.value === 'hi' ? 'hi-IN' : document.getElementById('languageSelect')?.value === 'mr' ? 'mr-IN' : 'en-US';
  utterance.rate = 0.92;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const voiceButton = document.getElementById('voiceAssistantBtn');
if (voiceButton) {
  voiceButton.addEventListener('click', () => {
    const selectedLang = document.getElementById('languageSelect')?.value || 'en';
    const prompt = translations[selectedLang]?.voicePrompt || translations.en.voicePrompt;
    speakAssistant(prompt);
  });
}

const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
  languageSelect.addEventListener('change', (event) => {
    const value = event.target.value;
    setLanguage(value);
    speakAssistant(translations[value]?.voiceIntro || translations.en.voiceIntro);
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

setLanguage('en');
initTheme();

document.getElementById('tryPlatformBtn').addEventListener('click', showDemoApp);
document.getElementById('launchDemoBtn').addEventListener('click', showDemoApp);
document.getElementById('journeyBtn').addEventListener('click', () => {
  document.getElementById('journey').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => setActivePanel(button.dataset.panel));
});

document.getElementById('assessBtn').addEventListener('click', runAssessment);
document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('demoApp').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const referralId = generateReferralId();
const summary = document.createElement('div');
summary.className = 'result-box';
summary.innerHTML = `<h4>Generated referral</h4><p><strong>ID:</strong> ${referralId}<br><strong>Destination:</strong> CHC Borgaon · Follow-up in 48 hours</p>`;
document.getElementById('assessmentResult').appendChild(summary);

checkBackend();
