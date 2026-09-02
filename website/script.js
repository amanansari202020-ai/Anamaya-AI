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

function getTreatmentCost(severity, location, age) {
  const base = severity === 'Severe' ? 1800 : severity === 'Moderate' ? 950 : 450;
  const ageBoost = age === '60+' ? 250 : 0;
  const locationBoost = location === 'District hospital' ? 600 : location === 'Block PHC' ? 200 : 0;
  const consultation = 200 + (severity === 'Severe' ? 250 : severity === 'Moderate' ? 150 : 100);
  const tests = 300 + (severity === 'Severe' ? 700 : severity === 'Moderate' ? 350 : 150) + locationBoost;
  const medicines = 200 + (severity === 'Severe' ? 600 : severity === 'Moderate' ? 300 : 150) + ageBoost;
  const total = consultation + tests + medicines;

  return { consultation, tests, medicines, total, base };
}

function getRiskAssessment(severity, fever, breath, weakness, age) {
  let score = 0;
  let riskLevel = 'Low';
  let urgency = 'Routine review';
  let recommendation = 'Continue routine primary care review and hydration monitoring.';

  if (severity === 'Severe') score += 3;
  else if (severity === 'Moderate') score += 2;
  else score += 1;

  if (fever === 'High') score += 2;
  else if (fever === 'Low') score += 1;

  if (breath === 'Often') score += 3;
  else if (breath === 'Sometimes') score += 1;

  if (weakness === 'Yes') score += 2;

  if (age === '60+') score += 1;

  if (score >= 7) {
    riskLevel = 'High';
    urgency = 'Urgent care';
    recommendation = 'Refer to CHC or district hospital within 24 hours for urgent evaluation and oxygen monitoring.';
  } else if (score >= 4) {
    riskLevel = 'Moderate';
    urgency = 'Same-day review';
    recommendation = 'Book a same-day PHC review for symptom monitoring and basic diagnostics.';
  }

  if (age === '60+' && riskLevel !== 'High') {
    riskLevel = 'Moderate';
    urgency = 'Senior pathway';
    recommendation = 'Senior patient pathway recommended: same-day clinical assessment and blood pressure review.';
  }

  return { score, riskLevel, urgency, recommendation };
}

function getFacilityCards(level) {
  const facilities = {
    High: [
      { name: 'District Hospital', distance: '22 km', status: 'Emergency ready' },
      { name: 'CHC Borgaon', distance: '8.2 km', status: 'Rapid triage' },
      { name: 'PHC Khandwa', distance: '4.8 km', status: 'Stabilization support' }
    ],
    Moderate: [
      { name: 'CHC Borgaon', distance: '8.2 km', status: 'Queue: 12 min' },
      { name: 'PHC Khandwa', distance: '4.8 km', status: 'Open now' },
      { name: 'District Hospital', distance: '22 km', status: 'Referral ready' }
    ],
    Low: [
      { name: 'PHC Khandwa', distance: '4.8 km', status: 'Open now' },
      { name: 'CHC Borgaon', distance: '8.2 km', status: 'Routine check' },
      { name: 'Community outreach clinic', distance: '3.1 km', status: 'Follow-up care' }
    ]
  };

  return facilities[level] || facilities.Low;
}

function getSchemeCards(level) {
  const schemes = {
    High: [
      { name: 'PM-JAY', text: 'High-priority hospital support for eligible families.', badge: 'Priority' },
      { name: 'Ayushman Bharat', text: 'Cashless treatment support for emergency and referral care.', badge: 'Eligible' },
      { name: 'District emergency aid', text: 'Additional transport and hospital support may be available.', badge: 'Check status' }
    ],
    Moderate: [
      { name: 'PM-JAY', text: 'Hospital treatment support for eligible families and women.', badge: 'Eligible' },
      { name: 'Ayushman Bharat', text: 'Cashless secondary care assistance for eligible patients.', badge: 'Eligible' },
      { name: 'National TB Elimination', text: 'Screening and treatment support for rural patients.', badge: 'Check status' }
    ],
    Low: [
      { name: 'PM-JAY', text: 'Primary and follow-up treatment support for eligible households.', badge: 'Eligible' },
      { name: 'Ayushman Bharat', text: 'Preventive and outpatient support for eligible families.', badge: 'Eligible' },
      { name: 'Maternal care grant', text: 'Support for regular checkups and follow-up visits.', badge: 'Review' }
    ]
  };

  return schemes[level] || schemes.Low;
}

function renderDashboardAssessment(riskLevel, recommendation, referralId) {
  const riskKpi = document.getElementById('riskKpi');
  const referralKpi = document.getElementById('referralKpi');
  const distanceKpi = document.getElementById('distanceKpi');
  const schemeKpi = document.getElementById('schemeKpi');
  const dashboardRecommendation = document.getElementById('dashboardRecommendation');
  const dashboardStatus = document.getElementById('dashboardStatus');

  if (riskKpi) riskKpi.textContent = riskLevel;
  if (referralKpi) referralKpi.textContent = referralId;
  if (distanceKpi) distanceKpi.textContent = riskLevel === 'High' ? '8.2 km' : riskLevel === 'Moderate' ? '4.8 km' : '3.1 km';
  if (schemeKpi) schemeKpi.textContent = riskLevel === 'High' ? 'Ayushman Bharat' : 'PM-JAY';
  if (dashboardRecommendation) dashboardRecommendation.textContent = recommendation;
  if (dashboardStatus) dashboardStatus.textContent = riskLevel === 'High' ? t('Digital passport synced with district emergency queue.') : t('Digital passport synced with nearest PHC referral lane.');
}

function renderFacilityRecommendations(level) {
  const list = document.getElementById('facilityList');
  if (!list) return;

  list.innerHTML = getFacilityCards(level).map((facility) => `
    <div class="facility-card">
      <div>
        <h4>${facility.name}</h4>
        <p>${facility.status} · ${facility.distance}</p>
      </div>
      <span class="badge">${facility.distance === '22 km' ? 'Referral' : 'Open'}</span>
    </div>
  `).join('');
}

function renderSchemeRecommendations(level) {
  const list = document.getElementById('schemeList');
  if (!list) return;

  list.innerHTML = getSchemeCards(level).map((scheme) => `
    <div class="scheme-card">
      <h4>${scheme.name}</h4>
      <p>${scheme.text}</p>
      <span>${scheme.badge}</span>
    </div>
  `).join('');
}

function runAssessment() {
  const severity = document.getElementById('severity').value;
  const fever = document.getElementById('fever').value;
  const breath = document.getElementById('breath').value;
  const weakness = document.getElementById('weakness').value;
  const age = document.getElementById('ageGroup').value;
  const location = document.getElementById('location').value;
  const patientName = document.getElementById('patientNameInput')?.value?.trim() || 'Patient';

  const risk = getRiskAssessment(severity, fever, breath, weakness, age);
  const cost = getTreatmentCost(severity, location, age);
  const referralId = generateReferralId();

  document.getElementById('assessmentResult').innerHTML = `
    <h4>Assessment result</h4>
    <p><strong>Risk level:</strong> ${risk.riskLevel}<br>
    <strong>Recommendation:</strong> ${risk.recommendation}<br>
    <strong>Urgency:</strong> ${risk.urgency}</p>
  `;

  document.getElementById('consultationCost').textContent = `₹${cost.consultation}`;
  document.getElementById('testCost').textContent = `₹${cost.tests}`;
  document.getElementById('medicineCost').textContent = `₹${cost.medicines}`;
  document.getElementById('totalCost').textContent = `₹${cost.total}`;

  renderDashboardAssessment(risk.riskLevel, risk.recommendation, referralId);
  renderFacilityRecommendations(risk.riskLevel);
  renderSchemeRecommendations(risk.riskLevel);

  const chatLog = document.getElementById('chatLog');
  if (chatLog) {
    const botReply = document.createElement('div');
    botReply.className = 'chat-bubble bot';
    botReply.textContent = `${t('AI guidance:')} ${risk.recommendation} ${t('Estimated care cost is about')} ₹${cost.total}. ${patientName}, ${t('please speak to a nearby clinic or primary care center if symptoms worsen.')}`;
    chatLog.appendChild(botReply);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
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
    statusCard.classList.remove('connected');
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Demo mode active — backend not running yet, but the app is ready for local preview.</span>
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

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem('anamaya-users')) || [];
  } catch (error) {
    return [];
  }
}

function setStoredUsers(users) {
  localStorage.setItem('anamaya-users', JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('anamaya-current-user'));
  } catch (error) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem('anamaya-current-user', JSON.stringify(user));
}

function updateUserProfile() {
  const userName = document.getElementById('userName');
  const patientInput = document.getElementById('patientNameInput');

  if (!userName || !patientInput) return;

  const name = patientInput.value.trim() || 'Patient';
  userName.textContent = name;
  localStorage.setItem('anamaya-user-name', name);

  const currentUser = getCurrentUser();
  if (currentUser) {
    const users = getStoredUsers();
    const index = users.findIndex((entry) => entry.email === currentUser.email);
    if (index >= 0) {
      users[index].name = name;
      setStoredUsers(users);
      setCurrentUser(users[index]);
    }
  }
}

function showAuthState() {
  const currentUser = getCurrentUser();
  const authSection = document.getElementById('authSection');
  const demoApp = document.getElementById('demoApp');

  if (currentUser) {
    if (authSection) authSection.classList.add('hidden');
    if (demoApp) demoApp.classList.remove('hidden');
    const patientInput = document.getElementById('patientNameInput');
    const userName = document.getElementById('userName');
    if (patientInput) patientInput.value = currentUser.name || '';
    if (userName) userName.textContent = currentUser.name || 'Patient';
    localStorage.setItem('anamaya-user-name', currentUser.name || 'Patient');
    speakAssistant(`Welcome ${currentUser.name}. Anamaya AI will guide you through the app. Choose a language and tap Launch demo to begin.`);
  } else {
    if (authSection) authSection.classList.remove('hidden');
    if (demoApp) demoApp.classList.add('hidden');
  }
}

function showAuthMessage(message, isError = false) {
  const authMessage = document.getElementById('authMessage');
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = isError ? '#d9485f' : '#0a7b67';
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const address = document.getElementById('registerAddress').value.trim();

  if (!name || !email || !phone || !address) {
    showAuthMessage('Please fill in all registration details.', true);
    return;
  }

  const users = getStoredUsers();
  const existingUser = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() || entry.phone === phone);

  if (existingUser) {
    setCurrentUser(existingUser);
    showAuthMessage('Welcome back. Your account is already saved.');
    showAuthState();
    return;
  }

  const newUser = { name, email, phone, address };
  users.push(newUser);
  setStoredUsers(users);
  setCurrentUser(newUser);
  showAuthMessage('Registration successful. Welcome to Anamaya AI.');
  showAuthState();
  speakAssistant(`Welcome ${name}. Please choose a language, then open the app. Anamaya AI will guide you step by step.`);
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const phone = document.getElementById('loginPhone').value.trim();

  if (!email || !phone) {
    showAuthMessage('Please enter your email and phone to login.', true);
    return;
  }

  const users = getStoredUsers();
  const matchedUser = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.phone === phone);

  if (!matchedUser) {
    showAuthMessage('No matching account found. Please register first.', true);
    return;
  }

  setCurrentUser(matchedUser);
  showAuthMessage(`Logged in as ${matchedUser.name}.`);
  showAuthState();
  speakAssistant(`Welcome back ${matchedUser.name}. You can use the app now. Select a language and tap Launch demo for guided support.`);
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) {
  saveProfileBtn.addEventListener('click', updateUserProfile);
}

const savedUserName = localStorage.getItem('anamaya-user-name');
if (savedUserName) {
  const patientInput = document.getElementById('patientNameInput');
  const userName = document.getElementById('userName');
  if (patientInput) patientInput.value = savedUserName;
  if (userName) userName.textContent = savedUserName;
}

showAuthState();

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

let currentSelectedImageBase64 = null;

const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const chatImageInput = document.getElementById('chatImageInput');
const chatImagePreviewContainer = document.getElementById('chatImagePreviewContainer');
const chatImagePreview = document.getElementById('chatImagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');

if (uploadPhotoBtn && chatImageInput) {
  uploadPhotoBtn.addEventListener('click', () => {
    chatImageInput.click();
  });

  chatImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        currentSelectedImageBase64 = evt.target.result;
        if (chatImagePreview && chatImagePreviewContainer) {
          chatImagePreview.src = currentSelectedImageBase64;
          chatImagePreviewContainer.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

if (removeImageBtn) {
  removeImageBtn.addEventListener('click', () => {
    currentSelectedImageBase64 = null;
    if (chatImageInput) chatImageInput.value = '';
    if (chatImagePreviewContainer) chatImagePreviewContainer.classList.add('hidden');
  });
}

function renderVisualAnalysisCard(data) {
  const card = document.createElement('div');
  card.className = 'visual-analysis-card';

  const severityClass = (data.severity || 'low').toLowerCase().replace(/\s+/g, '-');

  card.innerHTML = `
    <div class="analysis-header">
      <span class="analysis-title">🔍 ${data.condition_name || t('Visual Reaction Analysis')}</span>
      <span class="severity-tag ${severityClass}">${data.severity || 'Moderate'}</span>
    </div>

    ${data.symptoms && data.symptoms.length ? `
    <div class="analysis-section">
      <h5>📋 ${t('Expected Symptoms')}</h5>
      <ul>${data.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
    ` : ''}

    ${data.precautions && data.precautions.length ? `
    <div class="analysis-section">
      <h5>🛡️ ${t('Immediate Precautions')}</h5>
      <ul>${data.precautions.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
    ` : ''}

    <div class="analysis-section">
      <h5>👨‍⚕️ ${t('Doctor to Consult')}</h5>
      <p><strong>${data.doctor_specialist || 'General Physician / Dermatologist'}</strong> at <em>${data.recommended_facility || 'Primary Health Centre (PHC)'}</em></p>
    </div>

    ${data.next_steps && data.next_steps.length ? `
    <div class="analysis-section">
      <h5>🚀 ${t('What to Do Next')}</h5>
      <ul>${data.next_steps.map(n => `<li>${n}</li>`).join('')}</ul>
    </div>
    ` : ''}

    <div class="disclaimer-note">
      ⚠️ ${data.disclaimer || 'Visual screening tool only. Please consult a qualified doctor for medical diagnosis.'}
    </div>
  `;
  return card;
}

const chatSendBtn = document.getElementById('chatSendBtn');
if (chatSendBtn) {
  chatSendBtn.addEventListener('click', async () => {
    const input = document.getElementById('chatInput');
    const chatLog = document.getElementById('chatLog');
    if (!input || !chatLog) return;

    const textValue = input.value.trim();
    const hasImage = Boolean(currentSelectedImageBase64);

    if (!textValue && !hasImage) return;

    // Create user message bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    if (textValue) {
      const textDiv = document.createElement('div');
      textDiv.textContent = textValue;
      userBubble.appendChild(textDiv);
    }
    if (hasImage) {
      const img = document.createElement('img');
      img.src = currentSelectedImageBase64;
      img.className = 'chat-image-thumb';
      img.alt = 'Attached symptom photo';
      userBubble.appendChild(img);
    }
    chatLog.appendChild(userBubble);
    chatLog.scrollTop = chatLog.scrollHeight;

    // Clear input & image preview bar immediately
    const attachedImage = currentSelectedImageBase64;
    input.value = '';
    currentSelectedImageBase64 = null;
    if (chatImageInput) chatImageInput.value = '';
    if (chatImagePreviewContainer) chatImagePreviewContainer.classList.add('hidden');

    // Create thinking bot bubble
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.textContent = hasImage ? t('Analyzing photo and symptoms...') : t('Thinking...');
    chatLog.appendChild(botBubble);
    chatLog.scrollTop = chatLog.scrollHeight;

    if (hasImage) {
      try {
        const res = await fetch(`${apiBase}/api/health/analyze-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: attachedImage, description: textValue })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.analysis) {
            botBubble.textContent = '';
            botBubble.appendChild(renderVisualAnalysisCard(data.analysis));
            chatLog.scrollTop = chatLog.scrollHeight;
            const speakText = `Detected ${data.analysis.condition_name}. Consult a ${data.analysis.doctor_specialist}. Precautions: ${data.analysis.precautions?.[0] || 'Keep area clean'}.`;
            speakAssistant(speakText);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend image analysis offline, using local visual analysis engine:', err);
      }

      // Fallback local visual analysis engine
      const lowerText = textValue.toLowerCase();
      const fallbackAnalysis = {
        condition_name: lowerText.includes('ring') || lowerText.includes('fungal') ? 'Fungal Skin Infection (Ringworm / Tinea)' : lowerText.includes('burn') ? 'Thermal Burn / Blistering' : 'Contact Dermatitis / Skin Rash',
        severity: lowerText.includes('burn') || lowerText.includes('severe') ? 'High' : 'Moderate',
        symptoms: ['Skin redness & irritation', 'Localized itching or tenderness', 'Possible scaling or rash borders'],
        precautions: [
          'Clean the area gently with mild water; do not scratch.',
          'Avoid harsh chemicals, unverified ointments, or tight clothing.',
          'Keep the affected skin clean and dry.'
        ],
        doctor_specialist: 'Dermatologist / General Physician',
        recommended_facility: 'Primary Health Centre (PHC) or Community Health Centre (CHC)',
        next_steps: [
          'Visit a local PHC for doctor consultation and suitable topical medication.',
          'If rash rapidly spreads, oozes, or causes fever, seek urgent hospital care.'
        ],
        disclaimer: 'Visual screening guidance only. Consult a doctor for medical diagnosis.'
      };
      botBubble.textContent = '';
      botBubble.appendChild(renderVisualAnalysisCard(fallbackAnalysis));
      chatLog.scrollTop = chatLog.scrollHeight;
      speakAssistant(`Analysis complete: ${fallbackAnalysis.condition_name}. Recommended doctor: ${fallbackAnalysis.doctor_specialist}.`);
      return;
    }

    // Text-only guidance
    const answer = textValue.toLowerCase().includes('fever') || textValue.toLowerCase().includes('cough') ? t('Please monitor symptoms, drink fluids, and visit a primary health center if fever remains high or breathing worsens.') : textValue.toLowerCase().includes('pain') ? t('Try rest and hydration, and seek a nearby clinic if the pain is severe or persistent.') : t('Please speak with a nearby clinic or health worker for a proper checkup and guidance.');

    botBubble.textContent = answer;
    chatLog.scrollTop = chatLog.scrollHeight;
    speakAssistant(answer);
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
summary.innerHTML = `<h4>${t('js_generated_referral')}</h4><p><strong>${t('js_id')}</strong> ${referralId}<br><strong>${t('js_destination')}</strong> ${t('CHC Borgaon · Follow-up in 48 hours')}</p>`;
const assessmentResult = document.getElementById('assessmentResult');
if (assessmentResult) {
  assessmentResult.appendChild(summary);
}

checkBackend();


// ==========================================
// NEW LOGIC (Map, Donation, and Localization Fixes)
// ==========================================

function t(key) {
  const lang = document.documentElement.lang || 'en';
  const dict = (window.siteTranslations && window.siteTranslations[lang]) || (window.siteTranslations && window.siteTranslations.en) || {};
  return dict[key] || key;
}

// Map Logic
let mapInstance = null;
let facilityMarkers = [];
let allFetchedFacilities = [];

async function initMap() {
  if (mapInstance) return;
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const lat = 21.1458;
  const lon = 79.0882;
  mapInstance = L.map('map').setView([lat, lon], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance);

  L.marker([lat, lon]).addTo(mapInstance)
    .bindPopup('<b>Current Location</b><br>Rural area, near Nagpur.')
    .openPopup();

  document.getElementById('specialtyFilter')?.addEventListener('change', renderFacilities);

  const loadingEl = document.createElement('div');
  loadingEl.id = 'mapLoading';
  loadingEl.innerHTML = `<div style="padding: 10px; background: rgba(255,255,255,0.9); position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; border-radius: 8px; font-weight: 500; font-size: 14px;">${t('i18n_fetchingrealnea_159')}</div>`;
  mapContainer.appendChild(loadingEl);

  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:25000,${lat},${lon});
        node["amenity"="clinic"](around:25000,${lat},${lon});
        way["amenity"="hospital"](around:25000,${lat},${lon});
        way["amenity"="clinic"](around:25000,${lat},${lon});
      );
      out center;
    `;
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await response.json();

    const specializations = ["General", "Emergency", "Pediatrics", "Cardiology", "Maternity / Gynecology", "Neurology", "Orthopedics", "Oncology", "Dermatology", "Psychiatry", "Ophthalmology"];
    
    allFetchedFacilities = data.elements.map((el, index) => {
      let fLat = el.lat || el.center.lat;
      let fLon = el.lon || el.center.lon;
      return {
        id: el.id,
        name: el.tags.name || `Healthcare Facility #${index+1}`,
        lat: fLat,
        lon: fLon,
        specialty: specializations[index % specializations.length],
        distance: (Math.random() * 20 + 1).toFixed(1) + ' km',
        status: (Math.random() > 0.3) ? t('js_open') : t('js_referral')
      };
    });
    
    if (document.getElementById('mapLoading')) {
      document.getElementById('mapLoading').remove();
    }
    
    renderFacilities();
  } catch (error) {
    console.error("Failed to load map data", error);
    if (document.getElementById('mapLoading')) {
      document.getElementById('mapLoading').innerHTML = t('Failed to load facilities.');
    }
  }
}

function renderFacilities() {
  const filter = document.getElementById('specialtyFilter')?.value || 'All';
  const list = document.getElementById('facilityList');
  
  if (facilityMarkers && mapInstance) {
    facilityMarkers.forEach(m => mapInstance.removeLayer(m));
  }
  facilityMarkers = [];
  
  const filtered = allFetchedFacilities.filter(f => filter === 'All' || f.specialty === filter);
  
  if (list) {
    list.innerHTML = filtered.map(f => `
      <div class="facility-card">
        <div>
          <h4>${f.name}</h4>
          <p>${f.specialty} · ${f.distance} ${t('js_km_away')}</p>
        </div>
        <span class="badge ${f.status === t('js_referral') ? 'alt' : ''}">${f.status}</span>
      </div>
    `).join('');
  }
  
  if (mapInstance) {
    filtered.forEach(f => {
      const marker = L.marker([f.lat, f.lon]).addTo(mapInstance)
        .bindPopup(`<b>${f.name}</b><br>${f.specialty}<br>${f.distance} away`);
      facilityMarkers.push(marker);
    });
  }
}

// Donation Logic
const donationBtn = document.getElementById('donationBtn');
const donationModal = document.getElementById('donationModal');
const donationForm = document.getElementById('donationForm');
const donationMessage = document.getElementById('donationMessage');

if (donationBtn) {
  donationBtn.addEventListener('click', () => {
    if (donationModal) {
      donationModal.classList.remove('hidden');
      if(donationMessage) donationMessage.classList.add('hidden');
      if(donationForm) donationForm.style.display = 'flex';
    }
  });
}

document.querySelectorAll('.donation-close').forEach(btn => {
  btn.addEventListener('click', () => {
    if (donationModal) donationModal.classList.add('hidden');
  });
});

if (donationForm) {
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('donationAmount').value;
    
    donationForm.style.display = 'none';
    donationMessage.classList.remove('hidden');
    donationMessage.innerHTML = `<span style=\"color:#e67e22;\">${t('Redirecting to Razorpay secure gateway for ₹')}${amount}...</span>`;
    
    setTimeout(() => {
      donationMessage.innerHTML = `<span style=\"color:#2ecc71;\">${t('Payment of ₹')}${amount}${t(' successful! Thank you for your support.')}</span>`;
      setTimeout(() => {
        donationModal.classList.add('hidden');
      }, 3000);
    }, 2000);
  });
}
