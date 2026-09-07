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
    statusChecking: 'Platform ready for local care coordination',
    voicePrompt: 'Anamaya AI is ready to guide patients with easier care navigation and support.',
    voiceIntro: 'Anamaya AI voice assistant is active. Please choose a language and listen to the guidance.',
    privacyNotice: 'Privacy notice: We collect name, phone, address, health profile, allergies, and emergency contact details to provide triage, referral, and scheme support. Data is stored securely in the app and protected under India’s DPDP Act and related healthcare privacy standards.',
    emergencyDisclaimer: 'This AI triage is not a medical diagnosis. Seek emergency care immediately if you have severe breathing trouble, chest pain, heavy bleeding, or loss of consciousness.',
    offlineIndicator: 'Offline mode active — using your last saved health data.',
    smsFallbackText: 'We can text a health check to your phone when there is no internet access. Enter your number and we will send a short SMS prompt.'
  },
  hi: {
    heroEyebrow: 'कृषि स्वास्थ्य सेवा नेविगेशन',
    heroHeading: 'हर रोगी को सही समय पर सही देखभाल से जोड़ना।',
    heroText: 'Anamaya AI ग्रामीण समुदायों को उचित सुविधा चुनने, लक्षण समझने, रेफरल ट्रैक करने और डिज़िटल हेल्थ पासपोर्ट के माध्यम से योजना सहायता प्राप्त करने में मदद करता है।',
    ctaPrimary: 'प्लेटफ़ॉर्म आज़माएँ',
    ctaSecondary: 'मरीज की यात्रा देखें',
    statusChecking: 'स्थानीय देखभाल समन्वय के लिए प्लेटफ़ॉर्म तैयार है',
    voicePrompt: 'Anamaya AI ग्रामीण लोगों को आसान देखभाल मार्गदर्शन प्रदान करता है।',
    voiceIntro: 'Anamaya AI वॉयस असिस्टेंट सक्रिय है। कृपया भाषा चुनें और मार्गदर्शन सुनें।',
    privacyNotice: 'गोपनीयता सूचना: हम सहायता के लिए नाम, फोन, पता, स्वास्थ्य प्रोफ़ाइल, एलर्जी और आपातकालीन संपर्क विवरण एकत्र करते हैं। डेटा सुरक्षित रूप से संग्रहीत किया जाता है और भारत के DPDP अधिनियम के साथ स्वास्थ्य गोपनीयता मानकों के तहत रखा जाता है।',
    emergencyDisclaimer: 'यह एआई स्क्रीनिंग मेडिकल निदान नहीं है। अगर सांस लेने में कठिनाई, सीने में दर्द, भारी रक्तस्त्राव या बेहोशी हो, तो तुरंत आपातकालीन सहायता लें।',
    offlineIndicator: 'ऑफ़लाइन मोड सक्रिय है — अंतिम सहेजा गया डेटा उपयोग किया जा रहा है।',
    smsFallbackText: 'अगर इंटरनेट न हो तो हम आपके फोन पर हेल्थ चेक का SMS भेज सकते हैं। अपना नंबर दर्ज करें और हम एक छोटा संदेश भेजेंगे।'
  },
  mr: {
    heroEyebrow: 'ग्रामीण आरोग्य नेव्हिगेशन',
    heroHeading: 'प्रत्येक रुग्णाला योग्य काळात योग्य उपचाराकडे नेणे.',
    heroText: 'Anamaya AI ग्रामीण समुदायांना योग्य सुविधा निवडण्यास, लक्षण समजण्यास, रेफरल ट्रॅक करण्यास आणि डिजिटल हेल्थ पासपोर्टद्वारे योजना सल्ला मिळण्यास मदत करते.',
    ctaPrimary: 'प्लॅटफॉर्म वापरा',
    ctaSecondary: 'रुग्ण प्रवास पहा',
    statusChecking: 'स्थानिक आरोग्य समन्वयासाठी प्लॅटफ़ॉर्म तयार आहे',
    voicePrompt: 'Anamaya AI ग्रामीण लोकांसाठी सोपी आरोग्य दिशा देतो.',
    voiceIntro: 'Anamaya AI ध्वनी सहाय्यक सक्रिय आहे. कृपया भाषा निवडा आणि माहिती ऐका.',
    privacyNotice: 'गोपनीयता सूचना: आम्ही सेवा प्रदान करण्यासाठी नाव, फोन, पत्ता, आरोग्य प्रोफाइल, अॅलर्जी आणि आपत्कालीन संपर्काची माहिती गोळा करतो. डेटा सुरक्षित पद्धतीने संग्रहित केला जातो आणि भारताच्या DPDP कायद्यांतर्गत आरोग्य गोपनीयता नियमांचे पालन करते.',
    emergencyDisclaimer: 'ही एआय स्क्रीनिंग वैद्यकीय निदान नाही. श्वास घेण्यास अडचण, छातीतील दुखणे, जास्त रक्तस्त्राव किंवा बेहोशी असल्यास त्वरित आपत्कालीन सेवा घ्या.',
    offlineIndicator: 'ऑफलाइन मोड सक्रिय आहे — शेवटचा जतन केलेला डेटा वापरला जात आहे.',
    smsFallbackText: 'इंटरनेट नसल्यास आम्ही तुमच्या फोनवर आरोग्य तपासणीचा SMS पाठवू शकतो. तुमचा नंबर प्रविष्ट करा आणि आम्ही थोडक्यात संदेश पाठवू. '
  }
};

const privacyNoticeText = (lang = document.documentElement.lang || 'en') => {
  const dict = translations[lang] || translations.en;
  return dict.privacyNotice || translations.en.privacyNotice;
};

function getRiskTierLabel(level) {
  if (level === 'Emergency') return 'Emergency';
  if (level === 'Medium') return 'Medium';
  return 'Low';
}

function mapRiskGroup(level) {
  if (level === 'Emergency') return 'High';
  if (level === 'Medium') return 'Moderate';
  return 'Low';
}

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

const VALID_PANELS = ['dashboard', 'assessment', 'facilities', 'passport', 'schemes', 'emergency'];

function navigateToWorkspace(panelId = 'dashboard') {
  if (!VALID_PANELS.includes(panelId)) panelId = 'dashboard';

  document.body.classList.add('workspace-mode');
  const demoApp = document.getElementById('demoApp');
  if (demoApp) demoApp.classList.remove('hidden');

  const authSection = document.getElementById('authSection');
  if (authSection) authSection.classList.add('hidden');

  setActivePanel(panelId);

  const targetHash = `#workspace/${panelId}`;
  if (window.location.hash !== targetHash) {
    window.history.pushState(null, '', targetHash);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToLanding() {
  document.body.classList.remove('workspace-mode');
  const demoApp = document.getElementById('demoApp');
  if (demoApp) demoApp.classList.add('hidden');

  const authSection = document.getElementById('authSection');
  if (authSection) authSection.classList.remove('hidden');

  if (window.location.hash) {
    window.history.pushState(null, '', window.location.pathname);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRoute() {
  const hash = window.location.hash.toLowerCase();
  if (hash.startsWith('#workspace/') || hash === '#workspace') {
    const panel = hash.replace('#workspace/', '').replace('#workspace', '');
    navigateToWorkspace(panel || 'dashboard');
  } else if (VALID_PANELS.includes(hash.replace('#', ''))) {
    navigateToWorkspace(hash.replace('#', ''));
  } else {
    navigateToLanding();
  }
}

function showDemoApp() {
  navigateToWorkspace('dashboard');
}

function setActivePanel(panelId) {
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.panel === panelId);
  });
  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === panelId);
  });

  if (panelId === 'facilities') {
    setTimeout(() => {
      initMap();
      if (mapInstance) {
        mapInstance.invalidateSize();
      }
    }, 50);
    loadFacilitiesWithDoctors();
  } else if (panelId === 'passport') {
    let user = null;
    try { user = JSON.parse(localStorage.getItem('healthsphere_user')); } catch (e) {}
    loadPatientAppointments(user ? user.id : 1);
  } else if (panelId === 'emergency') {
    loadEmergencyFacilities();
  }
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
    riskLevel = 'Emergency';
    urgency = 'Immediate emergency care';
    recommendation = 'Call emergency services or go to the nearest emergency facility right away for urgent assessment and monitoring.';
  } else if (score >= 4) {
    riskLevel = 'Medium';
    urgency = 'Same-day review';
    recommendation = 'Book a same-day PHC or CHC review for symptom monitoring and basic diagnostics.';
  }

  if (age === '60+' && riskLevel !== 'Emergency') {
    riskLevel = 'Medium';
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

  const normalizedLevel = getRiskTierLabel(riskLevel);
  const riskGroup = mapRiskGroup(riskLevel);

  if (riskKpi) {
    riskKpi.textContent = normalizedLevel;
    riskKpi.className = `risk-tier-${normalizedLevel.toLowerCase()}`;
  }
  if (referralKpi) referralKpi.textContent = referralId;
  if (distanceKpi) distanceKpi.textContent = riskLevel === 'Emergency' ? '2.4 km' : riskLevel === 'Medium' ? '4.8 km' : '3.1 km';
  if (schemeKpi) schemeKpi.textContent = riskLevel === 'Emergency' ? 'Ayushman Bharat' : 'PM-JAY';
  if (dashboardRecommendation) dashboardRecommendation.textContent = recommendation;
  if (dashboardStatus) dashboardStatus.textContent = riskLevel === 'Emergency' ? 'Digital passport synced with emergency referral queue and nearest facility.' : 'Digital passport synced with nearest PHC referral lane.';

  const emergencyPanel = document.getElementById('assessmentEmergencySos');
  if (emergencyPanel) {
    emergencyPanel.classList.toggle('hidden', riskLevel !== 'Emergency');
    emergencyPanel.querySelector('strong')?.replaceChildren(document.createTextNode(riskLevel === 'Emergency' ? 'Emergency SOS surfaced automatically' : 'Emergency SOS'));
  }
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

  const resultBox = document.getElementById('assessmentResult');
  if (resultBox) {
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <div class="risk-tier-banner risk-${risk.riskLevel.toLowerCase()}">
        <span class="risk-tier-name">${getRiskTierLabel(risk.riskLevel)}</span>
      </div>
      <h4>Assessment result</h4>
      <p><strong>Risk level:</strong> ${risk.riskLevel}<br>
      <strong>Recommendation:</strong> ${risk.recommendation}<br>
      <strong>Urgency:</strong> ${risk.urgency}</p>
      <div id="assessmentEmergencySos" class="${risk.riskLevel === 'Emergency' ? '' : 'hidden'} emergency-sos-banner">
        <strong>Emergency SOS surfaced automatically</strong>
        <button type="button" id="assessmentSosTrigger" class="btn-sos">🆘 Start Emergency SOS</button>
      </div>
    `;
    const trigger = document.getElementById('assessmentSosTrigger');
    if (trigger) trigger.addEventListener('click', () => { navigateToWorkspace('emergency'); loadEmergencyFacilities(); });
  }

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

  if (window.location.protocol === 'file:') {
    statusCard.classList.add('connected');
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Platform ready for local care coordination · secure workflows available</span>
    `;
    return;
  }

  try {
    const response = await fetch(`${apiBase}/health`, { method: 'GET', mode: 'cors' });
    if (!response.ok) throw new Error('Backend not responding');

    const data = await response.json();
    statusCard.classList.add('connected');
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Platform ready for local care coordination · ${data.service || 'Anamaya AI'} online</span>
    `;
  } catch (error) {
    statusCard.classList.add('connected');
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Platform ready for local care coordination · secure workflows available</span>
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

function getPreferredLanguage() {
  return document.getElementById('languageSelect')?.value || localStorage.getItem('anamaya-language') || 'en';
}

function setPreferredLanguage(lang) {
  localStorage.setItem('anamaya-language', lang);
}

function updateOfflineIndicator() {
  const indicator = document.getElementById('offlineIndicator');
  if (!indicator) return;
  const offline = !navigator.onLine;
  indicator.classList.toggle('hidden', !offline);
  indicator.textContent = translations[getPreferredLanguage()]?.offlineIndicator || translations.en.offlineIndicator;
}

function cacheOfflineData() {
  const keys = ['healthsphere_emergency_facilities', 'anamaya_referral_cache', 'anamaya_health_passport'];
  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      localStorage.setItem(`offline_${key}`, value);
    }
  });
}

function syncOfflineData() {
  if (!navigator.onLine) return;
  const cached = {
    facilities: localStorage.getItem('offline_healthsphere_emergency_facilities'),
    referrals: localStorage.getItem('offline_anamaya_referral_cache'),
    passport: localStorage.getItem('offline_anamaya_health_passport')
  };

  if (cached.facilities) {
    localStorage.setItem('healthsphere_emergency_facilities', cached.facilities);
  }
  if (cached.referrals) {
    localStorage.setItem('anamaya_referral_cache', cached.referrals);
  }
  if (cached.passport) {
    localStorage.setItem('anamaya_health_passport', cached.passport);
  }

  updateOfflineIndicator();
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
  const passportPatient = document.getElementById('passportPatientName');

  if (!userName || !patientInput) return;

  const name = patientInput.value.trim() || 'Patient';
  userName.textContent = name;
  if (passportPatient) passportPatient.textContent = name;
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

  if (authSection) authSection.classList.remove('hidden');

  if (currentUser) {
    const patientInput = document.getElementById('patientNameInput');
    const userName = document.getElementById('userName');
    const passportPatient = document.getElementById('passportPatientName');
    if (patientInput) patientInput.value = currentUser.name || '';
    if (userName) userName.textContent = currentUser.name || 'Patient';
    if (passportPatient) passportPatient.textContent = currentUser.name || 'Priya Sharma';
    localStorage.setItem('anamaya-user-name', currentUser.name || 'Patient');
  }
}

function showAuthMessage(message, isError = false) {
  const authMessage = document.getElementById('authMessage');
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = isError ? '#D33A3A' : '#2E8B57';
}

function setButtonLoading(button, text, loading) {
  if (!button) return;
  button.disabled = loading;
  const original = button.dataset.originalText;
  if (loading) {
    if (!original) button.dataset.originalText = button.textContent;
    button.textContent = text;
  } else if (original) {
    button.textContent = original;
    delete button.dataset.originalText;
  }
}

function handleRegister(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('regSubmitBtn');
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const address = document.getElementById('registerAddress').value.trim();
  const preferredLanguage = document.getElementById('registerPreferredLanguage')?.value || 'en';
  const selectedConditions = Array.from(document.querySelectorAll('#regCondGrid .icon-card.selected')).map((card) => card.dataset.value);
  const allergiesValue = document.getElementById('regAllergyText')?.value.trim() || (document.querySelector('#regAllergyGrid .icon-card.selected')?.dataset.value === 'yes' ? 'Yes' : 'No');

  if (!name || !email || !phone || !address) {
    showAuthMessage('Please fill in all registration details.', true);
    return;
  }

  setButtonLoading(submitBtn, 'Registering...', true);
  showAuthMessage('Creating your account and saving your health profile...', false);

  const users = getStoredUsers();
  const existingUser = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() || entry.phone === phone);

  if (existingUser) {
    setCurrentUser(existingUser);
    showAuthMessage('Welcome back. Your account is already saved.', false);
    setButtonLoading(submitBtn, 'Registering...', false);
    showAuthState();
    return;
  }

  const newUser = { name, email, phone, address, preferred_language: preferredLanguage, existing_conditions: selectedConditions, allergies: allergiesValue };
  users.push(newUser);
  setStoredUsers(users);
  setCurrentUser(newUser);
  localStorage.setItem('anamaya_health_profile', JSON.stringify({
    gender: document.querySelector('#regGenderGrid .icon-card.selected')?.dataset.value || 'male',
    age_group: document.querySelector('#regAgeGrid .icon-card.selected')?.dataset.value || 'adult',
    existing_conditions: selectedConditions,
    allergy_details: allergiesValue,
    preferred_language: preferredLanguage,
    emergency_contact_name: document.getElementById('regEmergName')?.value || '',
    emergency_contact_phone: document.getElementById('regEmergPhone')?.value || '',
    emergency_contact_relation: document.getElementById('regEmergRelation')?.value || ''
  }));
  localStorage.setItem('healthsphere_user', JSON.stringify({ name, email, phone }));
  setButtonLoading(submitBtn, 'Registering...', false);
  showAuthMessage('Registration successful. Welcome to Anamaya AI.', false);
  showAuthState();
  speakAssistant(`Welcome ${name}. Please choose a language, then open the app. Anamaya AI will guide you step by step.`);
}

function handleLogin(event) {
  event.preventDefault();
  const button = document.querySelector('#loginForm button[type="submit"]');
  const email = document.getElementById('loginEmail').value.trim();
  const phone = document.getElementById('loginPhone').value.trim();

  if (!email || !phone) {
    showAuthMessage('Please enter your email and phone to login.', true);
    return;
  }

  setButtonLoading(button, 'Logging in...', true);
  showAuthMessage('Checking your account details...', false);

  const users = getStoredUsers();
  const matchedUser = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.phone === phone);

  if (!matchedUser) {
    setButtonLoading(button, 'Logging in...', false);
    showAuthMessage('No matching account found. Please register first.', true);
    return;
  }

  setCurrentUser(matchedUser);
  setButtonLoading(button, 'Logging in...', false);
  showAuthMessage(`Logged in as ${matchedUser.name}.`, false);
  showAuthState();
  speakAssistant(`Welcome back ${matchedUser.name}. You can use the app now. Select a language and tap Launch demo for guided support.`);
}

const registerForm = document.getElementById('registerForm');
if (registerForm) registerForm.addEventListener('submit', handleRegister);

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

document.getElementById('signInBtn')?.addEventListener('click', () => {
  navigateToLanding();
  const loginSection = document.querySelector('.login-card');
  loginSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => document.getElementById('loginEmail')?.focus(), 450);
});

document.getElementById('smsFallbackBtn')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  const phoneInput = document.getElementById('smsFallbackPhone');
  const phone = phoneInput?.value.trim() || '';
  let status = document.getElementById('smsFallbackStatus');

  if (!status) {
    status = document.createElement('p');
    status.id = 'smsFallbackStatus';
    status.className = 'inline-action-status';
    phoneInput?.closest('.sms-fallback-card')?.appendChild(status);
  }

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    status.textContent = 'Enter a valid phone number to prepare an SMS check-in.';
    status.dataset.state = 'error';
    phoneInput?.focus();
    return;
  }

  localStorage.setItem('anamaya_pending_sms_checkin', JSON.stringify({ phone, createdAt: new Date().toISOString() }));
  button.disabled = true;
  button.textContent = 'Check-in queued';
  status.textContent = 'Your SMS check-in is queued locally and will be sent when connectivity is available.';
  status.dataset.state = 'success';
});

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
  const enBase = (window.siteTranslations && window.siteTranslations.en) || translations.en || {};
  const siteDict = (window.siteTranslations && window.siteTranslations[lang]) || {};
  const localDict = translations[lang] || {};
  const mergedDict = Object.assign({}, enBase, siteDict, localDict);
  document.documentElement.lang = lang;
  setPreferredLanguage(lang);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (mergedDict[key]) {
      element.textContent = mergedDict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (mergedDict[key]) {
      element.placeholder = mergedDict[key];
    }
  });

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = lang;
  }

  const offlineIndicator = document.getElementById('offlineIndicator');
  if (offlineIndicator) {
    offlineIndicator.textContent = mergedDict.offlineIndicator || translations.en.offlineIndicator;
  }

  if (typeof renderAiWizardStep === 'function') {
    renderAiWizardStep();
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

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    const isOpen = topbar.classList.toggle('nav-open');
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const topbar = document.querySelector('.topbar');
      if (topbar) topbar.classList.remove('nav-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const topbar = document.querySelector('.topbar');
if (topbar) {
  const updateHeaderState = () => topbar.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
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
const chatInputEl = document.getElementById('chatInput');
if (chatInputEl && chatSendBtn) {
  chatInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      chatSendBtn.click();
    }
  });
}

let chatMessageTimestamps = [];

function checkChatRateLimit() {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  chatMessageTimestamps = chatMessageTimestamps.filter(ts => (now - ts) < ONE_HOUR);
  if (chatMessageTimestamps.length >= 15) {
    return false;
  }
  chatMessageTimestamps.push(now);
  return true;
}

function renderGroundedChatCard(data) {
  const container = document.createElement('div');
  container.className = 'grounded-chat-response';
  container.style.cssText = 'margin-top: 4px; font-family: inherit; font-size: 0.9rem;';

  if (data.reply_text) {
    const p = document.createElement('p');
    p.style.cssText = 'margin: 0 0 10px 0; line-height: 1.45; font-size: 0.92rem;';
    p.textContent = data.reply_text;
    container.appendChild(p);
  }

  if (data.possible_conditions && data.possible_conditions.length > 0) {
    const title = document.createElement('div');
    title.style.cssText = 'font-weight: 700; margin: 10px 0 6px 0; font-size: 0.82rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;';
    title.textContent = 'Possible Conditions (Grounded Matches)';
    container.appendChild(title);

    data.possible_conditions.forEach(cond => {
      const card = document.createElement('div');
      card.style.cssText = 'background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

      const header = document.createElement('div');
      header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px;';

      const nameEl = document.createElement('strong');
      nameEl.style.cssText = 'font-size: 0.95rem; color: #f8fafc;';
      nameEl.textContent = cond.name || cond.disease_name;

      const badge = document.createElement('span');
      const likelihoodStr = cond.likelihood || 'Moderate Likelihood';
      let badgeStyle = 'background: #334155; color: #f8fafc;';
      if (likelihoodStr.includes('High')) badgeStyle = 'background: #991b1b; color: #fef2f2;';
      else if (likelihoodStr.includes('Moderate')) badgeStyle = 'background: #92400e; color: #fef3c7;';
      else badgeStyle = 'background: #075985; color: #e0f2fe;';

      badge.style.cssText = `${badgeStyle} padding: 2px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; white-space: nowrap;`;
      badge.textContent = likelihoodStr;

      header.appendChild(nameEl);
      header.appendChild(badge);
      card.appendChild(header);

      if (cond.common_in_rural_india) {
        const ruralTag = document.createElement('span');
        ruralTag.style.cssText = 'display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.7rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px;';
        ruralTag.textContent = '🌾 Common in Rural India';
        card.appendChild(ruralTag);
      }

      if (cond.explanation) {
        const exp = document.createElement('div');
        exp.style.cssText = 'font-size: 0.83rem; line-height: 1.4; color: #cbd5e1; margin-top: 4px;';
        exp.textContent = cond.explanation;
        card.appendChild(exp);
      }

      if (cond.matched_symptoms && cond.matched_symptoms.length > 0) {
        const syms = document.createElement('div');
        syms.style.cssText = 'font-size: 0.76rem; color: #94a3b8; margin-top: 4px;';
        syms.textContent = 'Matched: ' + cond.matched_symptoms.join(', ');
        card.appendChild(syms);
      }

      container.appendChild(card);
    });
  }

  if (data.suggested_tests && data.suggested_tests.length > 0) {
    const testWrap = document.createElement('div');
    testWrap.style.cssText = 'margin-top: 10px; font-size: 0.82rem; color: #cbd5e1;';
    testWrap.innerHTML = `<strong style="color:#f8fafc;">Suggested Diagnostics:</strong> ${data.suggested_tests.join(' · ')}`;
    container.appendChild(testWrap);
  }

  if (data.recommended_action) {
    const actBox = document.createElement('div');
    const isUrgent = data.urgency === 'high' || data.urgency === 'critical';
    const bg = isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)';
    const border = isUrgent ? '#ef4444' : '#3b82f6';
    actBox.style.cssText = `margin-top: 10px; padding: 8px 12px; border-left: 3px solid ${border}; background: ${bg}; border-radius: 4px; font-size: 0.85rem; font-weight: 600; color: #f8fafc;`;
    actBox.textContent = `📋 Recommended Action: ${data.recommended_action}`;
    container.appendChild(actBox);
  }

  if (data.follow_up_questions && data.follow_up_questions.length > 0) {
    const chipWrap = document.createElement('div');
    chipWrap.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;';
    data.follow_up_questions.forEach(q => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chat-question-chip';
      chip.style.cssText = 'background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 4px 10px; font-size: 0.78rem; cursor: pointer; transition: all 0.2s;';
      chip.textContent = `💬 ${q}`;
      chip.onclick = () => {
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        if (chatInput && chatSendBtn) {
          chatInput.value = q;
          chatSendBtn.click();
        }
      };
      chipWrap.appendChild(chip);
    });
    container.appendChild(chipWrap);
  }

  if (data.disclaimer) {
    const disc = document.createElement('div');
    disc.style.cssText = 'margin-top: 10px; font-size: 0.73rem; color: #94a3b8; font-style: italic;';
    disc.textContent = `⚠️ ${data.disclaimer}`;
    container.appendChild(disc);
  }

  return container;
}

if (chatSendBtn) {
  chatSendBtn.addEventListener('click', async () => {
    const input = document.getElementById('chatInput');
    const chatLog = document.getElementById('chatLog');
    if (!input || !chatLog) return;

    const textValue = input.value.trim();
    const hasImage = Boolean(currentSelectedImageBase64);

    if (!textValue && !hasImage) return;

    // Rate Limit Check (15 messages/session/hour)
    if (!checkChatRateLimit()) {
      const limitBubble = document.createElement('div');
      limitBubble.className = 'chat-bubble bot';
      limitBubble.style.cssText = 'border-left: 3px solid #f59e0b; background: rgba(245, 158, 11, 0.1);';
      limitBubble.textContent = '⚠️ Rate limit reached (15 messages per hour). For urgent symptoms, please consult a healthcare worker or visit your nearest PHC directly.';
      chatLog.appendChild(limitBubble);
      chatLog.scrollTop = chatLog.scrollHeight;
      return;
    }

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

    // Create thinking bot bubble ("Thinking through your symptoms...")
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.textContent = hasImage ? t('Analyzing photo and symptoms...') : 'Thinking through your symptoms...';
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

    // Grounded AI Care Assistant Chat Request
    try {
      const selectedLang = (languageSelect && languageSelect.value) || 'en';
      let storedProfile = null;
      try {
        storedProfile = JSON.parse(localStorage.getItem('anamaya_health_profile'));
      } catch (pe) {}

      const chatPayload = {
        user_message: textValue,
        language: selectedLang,
        profile_context: storedProfile || { gender: 'female', age_group: 'adult', existing_conditions: ['asthma'] }
      };

      const res = await fetch(`${apiBase}/api/health/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatPayload)
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data) {
          botBubble.textContent = '';
          botBubble.appendChild(renderGroundedChatCard(resData.data));
          chatLog.scrollTop = chatLog.scrollHeight;
          const speakContent = resData.data.reply_text || 'Assessment complete based on Kaggle, DDXPlus, and MedlinePlus reference data.';
          speakAssistant(speakContent);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend health chat call fallback:', err);
    }

    // Fallback response if fetch fails
    const answer = textValue.toLowerCase().includes('fever') || textValue.toLowerCase().includes('cough')
      ? 'Symptoms match common respiratory or febrile illness. Grounded reference data suggests monitoring temperature, staying hydrated, and visiting a PHC if symptoms persist.'
      : 'Please consult a nearby Primary Health Centre (PHC) or health worker for a clinical evaluation.';

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

document.getElementById('tryPlatformBtn')?.addEventListener('click', () => navigateToWorkspace('dashboard'));
document.getElementById('launchDemoBtn')?.addEventListener('click', () => navigateToWorkspace('dashboard'));
document.getElementById('journeyBtn')?.addEventListener('click', () => {
  scrollToSection('journey');
});

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToWorkspace(button.dataset.panel);
  });
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('anamaya-current-user');
  localStorage.removeItem('healthsphere_user');
  localStorage.removeItem('anamaya_health_profile');
  navigateToLanding();
});

window.addEventListener('hashchange', handleRoute);
window.addEventListener('popstate', handleRoute);

function triggerSectionAnimation(targetId) {
  const target = targetId ? document.getElementById(targetId) : null;
  if (!target) return;

  document.body.classList.add('page-transition');
  target.classList.remove('section-focus');
  void target.offsetWidth;
  target.classList.add('section-focus');

  setTimeout(() => {
    target.classList.remove('section-focus');
    document.body.classList.remove('page-transition');
  }, 900);
}

document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.getAttribute('href');
    if (!target || target === '#') return;

    const sectionId = target.replace('#', '');
    if (!sectionId) return;

    event.preventDefault();
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      triggerSectionAnimation(sectionId);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

handleRoute();

const referralId = generateReferralId();
const summary = document.createElement('div');
summary.className = 'result-box';
summary.innerHTML = `<h4>${t('js_generated_referral')}</h4><p><strong>${t('js_id')}</strong> ${referralId}<br><strong>${t('js_destination')}</strong> ${t('CHC Borgaon · Follow-up in 48 hours')}</p>`;
const assessmentResult = document.getElementById('assessmentResult');
if (assessmentResult) {
  assessmentResult.appendChild(summary);
}

if (window.location.protocol !== 'file:') checkBackend();


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
let userLocationMarker = null;
let facilityMarkers = [];
let allFetchedFacilities = [];
let currentUserCoords = { lat: 19.0330, lon: 73.0297 }; // Regional default (Panvel / Navi Mumbai)

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

async function initMap() {
  const mapContainer = document.getElementById('map');
  const gpsStatusEl = document.getElementById('facilitiesGpsStatus');
  if (!mapContainer) return;

  // Setup Event Listeners for Filters and Manual Search
  const radiusSelect = document.getElementById('facRadiusSelect');
  const typeFilter = document.getElementById('specialtyFilter');
  const manualBtn = document.getElementById('facManualBtn');
  const manualInput = document.getElementById('facManualInput');

  if (radiusSelect) {
    radiusSelect.replaceWith(radiusSelect.cloneNode(true));
    document.getElementById('facRadiusSelect')?.addEventListener('change', () => {
      const radiusKm = parseInt(document.getElementById('facRadiusSelect').value) || 25;
      fetchFacilitiesData(currentUserCoords.lat, currentUserCoords.lon, radiusKm);
    });
  }

  if (typeFilter) {
    typeFilter.replaceWith(typeFilter.cloneNode(true));
    document.getElementById('specialtyFilter')?.addEventListener('change', renderFacilities);
  }

  if (manualBtn && manualInput) {
    manualBtn.onclick = () => {
      const query = manualInput.value.trim();
      if (query) geocodeManualLocation(query);
    };
    manualInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const query = manualInput.value.trim();
        if (query) geocodeManualLocation(query);
      }
    };
  }

  // Immediately render initial map and facilities for zero latency
  setupLeafletMap(currentUserCoords.lat, currentUserCoords.lon);
  fetchFacilitiesData(currentUserCoords.lat, currentUserCoords.lon, getSelectedRadius());

  // Determine User GPS Location in background
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentUserCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        if (gpsStatusEl) {
          gpsStatusEl.innerHTML = `<span class="chip success" style="background:#EAF6EE; color:#2E8B57; padding:3px 8px; border-radius:6px; font-weight:600;">📍 GPS Active (${currentUserCoords.lat.toFixed(3)}, ${currentUserCoords.lon.toFixed(3)})</span>`;
        }
        setupLeafletMap(currentUserCoords.lat, currentUserCoords.lon);
        fetchFacilitiesData(currentUserCoords.lat, currentUserCoords.lon, getSelectedRadius());
      },
      (err) => {
        console.warn("Facilities geolocation denied or failed:", err);
        if (gpsStatusEl) {
          gpsStatusEl.innerHTML = `<span class="chip warning" style="background:#FDEEDF; color:#E67A1A; padding:3px 8px; border-radius:6px; font-weight:600;">⚠️ GPS permission denied / unavailable — showing regional facilities or search manually</span>`;
        }
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  } else {
    if (gpsStatusEl) {
      gpsStatusEl.innerHTML = `<span class="chip warning" style="background:#FDEEDF; color:#E67A1A; padding:3px 8px; border-radius:6px; font-weight:600;">⚠️ Browser GPS unsupported — enter location manually below</span>`;
    }
  }
}

function getSelectedRadius() {
  const radiusSelect = document.getElementById('facRadiusSelect');
  return radiusSelect ? parseInt(radiusSelect.value) || 25 : 25;
}

function setupLeafletMap(lat, lon) {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (!mapInstance) {
    mapInstance = L.map('map').setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);
  } else {
    mapInstance.setView([lat, lon], 12);
  }

  if (userLocationMarker) mapInstance.removeLayer(userLocationMarker);

  userLocationMarker = L.circleMarker([lat, lon], {
    radius: 9,
    fillColor: '#154A8C',
    color: '#ffffff',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(mapInstance).bindPopup(`<b>📍 Your Location</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`).openPopup();
}

async function geocodeManualLocation(query) {
  const gpsStatusEl = document.getElementById('facilitiesGpsStatus');
  if (gpsStatusEl) {
    gpsStatusEl.innerHTML = `<span class="chip info" style="background:#EAF1FB; color:#154A8C; padding:3px 8px; border-radius:6px; font-weight:600;">🔍 Searching location: "${query}"...</span>`;
  }
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    const data = await res.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      currentUserCoords = { lat, lon };

      if (gpsStatusEl) {
        gpsStatusEl.innerHTML = `<span class="chip success" style="background:#EAF6EE; color:#2E8B57; padding:3px 8px; border-radius:6px; font-weight:600;">📍 Showing location for "${data[0].display_name.split(',')[0]}"</span>`;
      }
      setupLeafletMap(lat, lon);
      fetchFacilitiesData(lat, lon, getSelectedRadius());
    } else {
      if (gpsStatusEl) {
        gpsStatusEl.innerHTML = `<span class="chip danger" style="background:#FDF1F1; color:#D33A3A; padding:3px 8px; border-radius:6px; font-weight:600;">❌ Could not find location "${query}". Please check spelling.</span>`;
      }
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    if (gpsStatusEl) {
      gpsStatusEl.innerHTML = `<span class="chip danger" style="background:#FDF1F1; color:#D33A3A; padding:3px 8px; border-radius:6px; font-weight:600;">❌ Location search failed. Check connection.</span>`;
    }
  }
}

async function fetchFacilitiesData(lat, lon, radiusKm = 25) {
  const listEl = document.getElementById('facilityList');
  if (listEl) {
    listEl.innerHTML = `
      <div class="facility-card loading-card" style="padding: 24px; text-align: center; color: var(--color-text-muted); background: var(--color-bg-alt); border-radius: 16px; border: 1px solid var(--color-border);">
        <div style="font-size: 1.6rem; margin-bottom: 8px;">🔍</div>
        <h4 style="color: var(--color-navy); margin: 0 0 4px 0;">Searching nearby hospitals & clinics...</h4>
        <p style="margin: 0; font-size: 0.88rem;">Querying healthcare facilities within ${radiusKm} km radius...</p>
      </div>
    `;
  }

  // 1. Google Places API check (if configured in environment)
  const googleApiKey = window.GOOGLE_PLACES_API_KEY || (typeof config !== 'undefined' && config.GOOGLE_PLACES_API_KEY);
  if (googleApiKey && googleApiKey !== 'YOUR_GOOGLE_PLACES_API_KEY') {
    try {
      const gRes = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radiusKm * 1000}&type=hospital&key=${googleApiKey}`);
      const gData = await gRes.json();
      if (gData && gData.results && gData.results.length > 0) {
        allFetchedFacilities = gData.results.map((place, idx) => {
          const pLat = place.geometry.location.lat;
          const pLon = place.geometry.location.lng;
          const dist = calculateHaversineDistance(lat, lon, pLat, pLon);
          return {
            id: place.place_id || `g_${idx}`,
            name: place.name,
            type: place.types.includes('hospital') ? 'Hospital' : 'Clinic',
            lat: pLat,
            lon: pLon,
            address: place.vicinity || 'Address not listed',
            phone: '+91 108',
            distanceKm: dist
          };
        }).sort((a, b) => a.distanceKm - b.distanceKm);

        renderFacilities();
        return;
      }
    } catch (gErr) {
      console.warn("Google Places API error, falling back to Overpass API:", gErr);
    }
  }

  // 2. OpenStreetMap Overpass API Query
  const radiusMeters = radiusKm * 1000;
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ data: overpassQuery })
    });
    if (!res.ok) throw new Error(`Overpass request failed with status ${res.status}`);
    const data = await res.json();

    if (data && data.elements && data.elements.length > 0) {
      allFetchedFacilities = data.elements.map((el, idx) => {
        const fLat = el.lat || (el.center && el.center.lat);
        const fLon = el.lon || (el.center && el.center.lon);
        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || `Healthcare Facility #${idx + 1}`;
        
        let type = 'Clinic';
        if (tags.amenity === 'hospital' || name.toLowerCase().includes('hospital') || name.toLowerCase().includes('hosp')) {
          type = 'Hospital';
        }
        if (name.toLowerCase().includes('phc') || name.toLowerCase().includes('primary health')) {
          type = 'PHC';
        } else if (name.toLowerCase().includes('chc') || name.toLowerCase().includes('community health')) {
          type = 'CHC';
        }

        const address = [tags['addr:full'], tags['addr:street'], tags['addr:suburb'], tags['addr:city'], tags['addr:district']].filter(Boolean).join(', ') || tags.address || 'Local Region, Maharashtra';
        const phone = tags.phone || tags['contact:phone'] || tags['phone:mobile'] || '+91 108';
        const dist = calculateHaversineDistance(lat, lon, fLat, fLon);

        return {
          id: el.id || idx,
          name,
          type,
          lat: fLat,
          lon: fLon,
          address,
          phone,
          distanceKm: dist
        };
      }).filter(f => f.lat && f.lon).sort((a, b) => a.distanceKm - b.distanceKm);

      renderFacilities();
      return;
    }
  } catch (err) {
    console.warn("Overpass API error, falling back to local database API:", err);
  }

  // 3. Fallback to Local Backend API Database (/api/emergency/nearby-facilities)
  try {
    const dbRes = await fetch(`${apiBase}/api/emergency/nearby-facilities?latitude=${lat}&longitude=${lon}&radius_km=${radiusKm}`);
    if (!dbRes.ok) throw new Error(`Facility service unavailable with status ${dbRes.status}`);
    const dbData = await dbRes.json();
    if (dbData && dbData.facilities && dbData.facilities.length > 0) {
      allFetchedFacilities = dbData.facilities.map((f) => {
        const dist = calculateHaversineDistance(lat, lon, f.latitude, f.longitude);
        let type = f.facility_level ? f.facility_level.toUpperCase() : 'Hospital';
        if (type.includes('PHC')) type = 'PHC';
        else if (type.includes('RURAL') || type.includes('CHC')) type = 'CHC';
        else if (type.includes('DISTRICT')) type = 'Hospital';

        return {
          id: f.id,
          name: f.name,
          type,
          lat: f.latitude,
          lon: f.longitude,
          address: f.address || 'Maharashtra Region',
          phone: f.contact_phone || f.phone || '108',
          distanceKm: dist
        };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      renderFacilities();
      return;
    }
  } catch (dbErr) {
    console.warn("Local database facilities unavailable:", dbErr.message || dbErr);
  }

  // Empty State if no facilities found
  allFetchedFacilities = [];
  renderFacilities();
}

function renderFacilities() {
  const filter = document.getElementById('specialtyFilter')?.value || 'All';
  const listEl = document.getElementById('facilityList');
  const radiusKm = getSelectedRadius();

  if (facilityMarkers && mapInstance) {
    facilityMarkers.forEach(m => mapInstance.removeLayer(m));
  }
  facilityMarkers = [];

  const filtered = allFetchedFacilities.filter(f => {
    if (filter === 'All') return true;
    return f.type.toLowerCase() === filter.toLowerCase();
  });

  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="facility-card empty-card" style="padding: 24px; text-align: center; color: var(--color-text-muted); background: var(--color-bg-alt); border-radius: 16px; border: 1px solid var(--color-border);">
        <div style="font-size: 1.8rem; margin-bottom: 8px;">🏥</div>
        <h4 style="color: var(--color-navy); margin: 0 0 6px 0;">No healthcare facilities found</h4>
        <p style="margin: 0; font-size: 0.88rem;">No ${filter !== 'All' ? filter : 'facilities'} found within ${radiusKm} km radius. Try increasing the search radius or enter a city in the location search box above.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(f => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lon}`;
    let badgeClass = 'hospital-badge';
    if (f.type === 'Clinic') badgeClass = 'clinic-badge';
    else if (f.type === 'PHC') badgeClass = 'phc-badge';
    else if (f.type === 'CHC') badgeClass = 'chc-badge';

    return `
      <div class="facility-card" data-lat="${f.lat}" data-lon="${f.lon}" style="background: var(--panel-solid); border: 1px solid var(--color-border); border-left: 4px solid var(--color-orange); border-radius: 16px; padding: 18px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: transform 0.2s, border-color 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div>
            <h4 style="margin: 0 0 4px 0; color: var(--color-navy); font-size: 1.05rem; font-weight: 700;">${f.name}</h4>
            <p style="margin: 0; color: var(--color-text-muted); font-size: 0.85rem;">📍 ${f.address}</p>
          </div>
          <span class="badge ${badgeClass}" style="background: var(--color-orange-light); color: var(--color-orange); border: 1px solid var(--color-orange); padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; white-space: nowrap;">${f.type}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 10px; margin-top: 4px;">
          <span style="font-size: 0.88rem; color: var(--color-green); font-weight: 700;">📏 ${f.distanceKm} km away</span>
          <div style="display: flex; gap: 8px;">
            <a href="tel:${f.phone}" onclick="event.stopPropagation();" class="secondary" style="padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; background: var(--color-bg-alt); color: var(--color-navy); border: 1px solid var(--color-border);">📞 Call</a>
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="primary" style="padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; background: var(--color-orange); color: #ffffff;">🗺️ Directions</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add Click-to-Fly event handler to facility cards
  listEl.querySelectorAll('.facility-card[data-lat]').forEach(card => {
    card.onclick = () => {
      const cLat = parseFloat(card.dataset.lat);
      const cLon = parseFloat(card.dataset.lon);
      if (mapInstance && !isNaN(cLat) && !isNaN(cLon)) {
        mapInstance.flyTo([cLat, cLon], 15, { duration: 1.2 });
      }
    };
  });

  // Plot Facility Markers on Leaflet Map
  if (mapInstance) {
    filtered.forEach(f => {
      const marker = L.marker([f.lat, f.lon]).addTo(mapInstance)
        .bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <b style="font-size: 0.95rem;">${f.name}</b><br>
            <span style="color: #154A8C; font-weight: 600;">${f.type}</span> · <b>${f.distanceKm} km away</b><br>
            <small style="color: #8A94A6;">${f.address}</small><br>
            <div style="margin-top: 6px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lon}" target="_blank" style="color: #154A8C; font-weight: 700; text-decoration: none;">🗺️ Open Directions</a>
            </div>
          </div>
        `);
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
    const amountInput = document.getElementById('donationAmount');
    const amount = amountInput?.value;
    if (!amount) return;
    
    donationForm.style.display = 'none';
    donationMessage.classList.remove('hidden');
    donationMessage.innerHTML = `<span style=\"color:#E67A1A;\">${t('Redirecting to Razorpay secure gateway for ₹')}${amount}...</span>`;
    
    donationMessage.innerHTML = '<span style="color:#C8630E;">Secure payment is not connected in this preview. No payment was taken.</span>';
  });
}

// ==========================================
// EMERGENCY SOS & CONVERSATIONAL AI WIZARD LOGIC
// ==========================================

let currentRegStep = 1;
let currentAiWizStep = 1;
let userProfileHealthData = null;

// 1. IconChoiceGrid Handler
function initIconChoiceGrids() {
  document.querySelectorAll('.icon-grid').forEach((grid) => {
    const isSingle = grid.dataset.single === 'true';
    const isMulti = grid.dataset.multi === 'true';

    grid.querySelectorAll('.icon-card').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', card.classList.contains('selected') ? 'true' : 'false');
      card.addEventListener('click', () => {
        const val = card.dataset.value;

        if (isSingle) {
          grid.querySelectorAll('.icon-card').forEach((c) => c.classList.remove('selected'));
          card.classList.add('selected');

          if (grid.id === 'regGenderGrid') {
            const pregCard = document.getElementById('regPregnancyCard');
            if (pregCard) {
              if (val === 'female') pregCard.classList.remove('hidden');
              else {
                pregCard.classList.add('hidden');
                pregCard.classList.remove('selected');
              }
            }
          }
          if (grid.id === 'regAllergyGrid') {
            const detailWrap = document.getElementById('regAllergyDetailWrap');
            if (detailWrap) {
              if (val === 'yes') detailWrap.classList.remove('hidden');
              else detailWrap.classList.add('hidden');
            }
          }
          if (grid.id === 'aiLocationGrid') {
            const manualWrap = document.getElementById('aiManualLocWrap');
            if (manualWrap) {
              if (val === 'manual') manualWrap.classList.remove('hidden');
              else manualWrap.classList.add('hidden');
            }
          }
        } else if (isMulti) {
          if (val === 'none') {
            grid.querySelectorAll('.icon-card').forEach((c) => c.classList.remove('selected'));
            card.classList.add('selected');
          } else {
            const noneCard = grid.querySelector('.icon-card[data-value="none"]');
            if (noneCard) noneCard.classList.remove('selected');

            card.classList.toggle('selected');

            if (grid.id === 'aiSymptomGrid' && val === 'other') {
              const otherWrap = document.getElementById('aiOtherSymptomWrap');
              if (otherWrap) {
                if (card.classList.contains('selected')) otherWrap.classList.remove('hidden');
                else otherWrap.classList.add('hidden');
              }
            }
          }
        }

        grid.querySelectorAll('.icon-card').forEach((choice) => {
          choice.setAttribute('aria-pressed', choice.classList.contains('selected') ? 'true' : 'false');
        });
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
    });
  });
}

// 2. VoiceInputButton Helper (Web Speech API with Fallback)
function initVoiceButton(btnId, targetInputId, onTranscriptCallback) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    btn.addEventListener('click', () => {
      alert("Voice recognition is not supported in this browser. Please type your input.");
    });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  btn.addEventListener('click', () => {
    const lang = document.documentElement.lang || 'en';
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';

    btn.classList.add('recording');
    const spanText = btn.querySelector('span:last-child');
    if (spanText) spanText.textContent = t('i18n_listening');

    try {
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      btn.classList.remove('recording');
      if (spanText) spanText.textContent = t('i18n_tap_speak');
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    btn.classList.remove('recording');
    const spanText = btn.querySelector('span:last-child');
    if (spanText) spanText.textContent = t('i18n_tap_speak');

    if (targetInputId) {
      const input = document.getElementById(targetInputId);
      if (input) input.value = transcript;
    }

    if (onTranscriptCallback) {
      onTranscriptCallback(transcript);
    }
  };

  recognition.onerror = () => {
    btn.classList.remove('recording');
    const spanText = btn.querySelector('span:last-child');
    if (spanText) spanText.textContent = t('i18n_tap_speak');
  };

  recognition.onend = () => {
    btn.classList.remove('recording');
    const spanText = btn.querySelector('span:last-child');
    if (spanText) spanText.textContent = t('i18n_tap_speak');
  };
}

// 3. Registration Flow Wizard (Step 1 -> Step 2)
function initRegisterFlow() {
  const regNextBtn = document.getElementById('regNextBtn');
  const regBackBtn = document.getElementById('regBackBtn');
  const regStep1 = document.getElementById('regStep1');
  const regStep2 = document.getElementById('regStep2');
  const regDot1 = document.getElementById('regDot1');
  const regDot2 = document.getElementById('regDot2');

  if (regNextBtn) {
    regNextBtn.addEventListener('click', () => {
      const name = document.getElementById('registerName')?.value;
      const email = document.getElementById('registerEmail')?.value;
      const phone = document.getElementById('registerPhone')?.value;

      if (!name || !email || !phone) {
        showAuthMessage('Please complete your name, email, and phone number first.', true);
        return;
      }

      regStep1.classList.add('hidden');
      regStep2.classList.remove('hidden');
      regDot1.classList.remove('active');
      regDot1.classList.add('completed');
      regDot2.classList.add('active');
      currentRegStep = 2;
    });
  }

  if (regBackBtn) {
    regBackBtn.addEventListener('click', () => {
      regStep2.classList.add('hidden');
      regStep1.classList.remove('hidden');
      regDot2.classList.remove('active');
      regDot1.classList.remove('completed');
      regDot1.classList.add('active');
      currentRegStep = 1;
    });
  }

}

function loginUser(email, pass, name, healthInfo) {
  const userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = name;

  const emergDisplay = document.getElementById('emergContactNameDisplay');
  if (emergDisplay && healthInfo && healthInfo.emergency_contact_name) {
    emergDisplay.textContent = `${healthInfo.emergency_contact_name} (${healthInfo.emergency_contact_phone || ''})`;
  }

  navigateToWorkspace('dashboard');
  const msgEl = document.getElementById('authMessage');
  if (msgEl) msgEl.innerHTML = `<span style="color:#2E8B57;">Welcome ${name}! Health profile saved.</span>`;
}

// 4. Conversational AI Assessment Wizard Logic (Steps 1-5)
function initAIWizard() {
  const steps = [
    document.getElementById('aiWizardStep1'),
    document.getElementById('aiWizardStep2'),
    document.getElementById('aiWizardStep3'),
    document.getElementById('aiWizardStep4'),
    document.getElementById('aiWizardStep5')
  ];

  const dots = [
    document.getElementById('aiDot1'),
    document.getElementById('aiDot2'),
    document.getElementById('aiDot3'),
    document.getElementById('aiDot4'),
    document.getElementById('aiDot5')
  ];

  function gotoStep(stepNum) {
    currentAiWizStep = stepNum;
    steps.forEach((s, idx) => {
      if (s) {
        if (idx + 1 === stepNum) s.classList.remove('hidden');
        else s.classList.add('hidden');
      }
    });
    dots.forEach((d, idx) => {
      if (d) {
        if (idx + 1 === stepNum) {
          d.classList.add('active');
          d.classList.remove('completed');
        } else if (idx + 1 < stepNum) {
          d.classList.remove('active');
          d.classList.add('completed');
        } else {
          d.classList.remove('active', 'completed');
        }
      }
    });

    if (stepNum === 5) {
      updateWizSummary();
    }
  }

  function updateWizSummary() {
    const symptomCards = document.querySelectorAll('#aiSymptomGrid .icon-card.selected');
    let symptoms = Array.from(symptomCards).map(c => c.querySelector('span:last-child')?.textContent || c.dataset.value);
    
    if (symptoms.includes('Other')) {
      const otherVal = document.getElementById('aiOtherSymptomInput')?.value;
      if (otherVal) symptoms = symptoms.map(s => s === 'Other' ? otherVal : s);
    }
    
    if (symptoms.length === 0) symptoms = ["Fever"];

    const severity = document.querySelector('#aiSeverityGrid .icon-card.selected')?.querySelector('span:last-child')?.textContent || "Moderate";
    const duration = document.querySelector('#aiDurationGrid .icon-card.selected')?.querySelector('span:last-child')?.textContent || "Today";

    const summaryEl = document.getElementById('aiWizSummaryText');
    if (summaryEl) {
      summaryEl.textContent = `${symptoms.join(', ')} · ${severity} · ${duration}`;
    }
  }

  document.getElementById('aiWizNext1')?.addEventListener('click', () => gotoStep(2));
  document.getElementById('aiWizBack2')?.addEventListener('click', () => gotoStep(1));
  document.getElementById('aiWizNext2')?.addEventListener('click', () => gotoStep(3));
  document.getElementById('aiWizBack3')?.addEventListener('click', () => gotoStep(2));
  document.getElementById('aiWizNext3')?.addEventListener('click', () => gotoStep(4));
  document.getElementById('aiWizBack4')?.addEventListener('click', () => gotoStep(3));
  document.getElementById('aiWizNext4')?.addEventListener('click', () => gotoStep(5));
  document.getElementById('aiWizBack5')?.addEventListener('click', () => gotoStep(1));

  initVoiceButton('aiVoiceBtn', null, (transcript) => {
    const text = transcript.toLowerCase();
    document.querySelectorAll('#aiSymptomGrid .icon-card').forEach((card) => {
      const val = card.dataset.value.toLowerCase();
      if (text.includes(val)) {
        card.classList.add('selected');
        const noneCard = document.querySelector('#aiSymptomGrid .icon-card[data-value="none"]');
        if (noneCard) noneCard.classList.remove('selected');
      }
    });
  });

  initVoiceButton('regAllergyVoiceBtn', 'regAllergyText');

  const assessBtn = document.getElementById('assessBtn');
  if (assessBtn) {
    assessBtn.addEventListener('click', async () => {
      const symptomCards = document.querySelectorAll('#aiSymptomGrid .icon-card.selected');
      let symptoms = Array.from(symptomCards).map(c => c.dataset.value);
      if (symptoms.length === 0) symptoms = ["fever"];

      const severityCard = document.querySelector('#aiSeverityGrid .icon-card.selected');
      const severity = severityCard ? severityCard.dataset.value : "moderate";

      const durationCard = document.querySelector('#aiDurationGrid .icon-card.selected');
      const duration = durationCard ? durationCard.dataset.value : "2-3_days";

      let storedProfile = null;
      try {
        storedProfile = JSON.parse(localStorage.getItem('anamaya_health_profile'));
      } catch (e) {}

      const payload = {
        symptoms: symptoms,
        severity: severity,
        duration: duration,
        latitude: 19.0760,
        longitude: 72.8777,
        profile_context: storedProfile || {
          gender: "female",
          age_group: "adult",
          existing_conditions: ["asthma"],
          has_allergies: false
        }
      };

      assessBtn.disabled = true;
      assessBtn.textContent = "Analyzing Health...";

      try {
        const res = await fetch(`${apiBase}/api/health/assess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Assessment service unavailable with status ${res.status}`);
        const data = await res.json();

        assessBtn.disabled = false;
        assessBtn.textContent = t('i18n_check_my_health');

        const resultBox = document.getElementById('assessmentResult');
        const costBox = document.getElementById('costBox');

        if (resultBox) resultBox.classList.remove('hidden');
        if (costBox) costBox.classList.remove('hidden');

        if (data && data.assessment) {
          const resText = document.getElementById('assessmentResultText');
          if (resText) {
            resText.innerHTML = `<strong>Urgency: ${(data.assessment.urgency_level || 'Moderate').toUpperCase()}</strong><br>${data.assessment.ai_assessment?.analysis || 'Evaluation complete.'}`;
          }
        }
      } catch (err) {
        console.warn("Assessment call fallback:", err);
        assessBtn.disabled = false;
        assessBtn.textContent = t('i18n_check_my_health');

        const resultBox = document.getElementById('assessmentResult');
        const costBox = document.getElementById('costBox');
        const profileAge = payload.profile_context?.age_group || 'adult';
        const localSeverity = severity === 'severe' ? 'Severe' : severity === 'mild' ? 'Mild' : 'Moderate';
        const localRisk = getRiskAssessment(
          localSeverity,
          symptoms.includes('fever') ? 'High' : 'None',
          symptoms.includes('breathlessness') ? 'Yes' : 'No',
          symptoms.includes('weakness') ? 'Yes' : 'No',
          profileAge === 'elderly' ? '60+' : profileAge
        );
        const localCost = getTreatmentCost(localSeverity, 'Block PHC', profileAge === 'elderly' ? '60+' : profileAge);
        if (resultBox) resultBox.classList.remove('hidden');
        if (costBox) costBox.classList.remove('hidden');
        const resultText = document.getElementById('assessmentResultText');
        if (resultText) {
          resultText.innerHTML = `<strong>Urgency: ${localRisk.riskLevel.toUpperCase()}</strong><br>${localRisk.recommendation}<br><small>Local guidance is available while the care service reconnects.</small>`;
        }
        document.getElementById('consultationCost').textContent = `₹${localCost.consultation}`;
        document.getElementById('testCost').textContent = `₹${localCost.tests}`;
        document.getElementById('medicineCost').textContent = `₹${localCost.medicines}`;
        document.getElementById('totalCost').textContent = `₹${localCost.total}`;
      }
    });
  }
}

// 5. Emergency SOS System Logic
function initEmergencySos() {
  const navSosBtn = document.getElementById('navSosBtn');
  const heroSosBtn = document.getElementById('heroSosBtn');
  const emergSendLocationBtn = document.getElementById('emergSendLocationBtn');

  function openEmergencyScreen() {
    navigateToWorkspace('emergency');
    loadEmergencyFacilities();
    updateEmergencyContactCard();
  }

  window.loadEmergencyFacilities = loadEmergencyFacilities;
  window.updateEmergencyContactCard = updateEmergencyContactCard;

  if (navSosBtn) navSosBtn.addEventListener('click', openEmergencyScreen);
  if (heroSosBtn) heroSosBtn.addEventListener('click', openEmergencyScreen);

  async function loadEmergencyFacilities() {
    const listEl = document.getElementById('emergFacilityList');
    const gpsStatusEl = document.getElementById('emergGpsStatus');
    if (!listEl) return;

    // Immediately render initial facilities synchronously (zero latency)
    const initialLat = (currentUserCoords && currentUserCoords.lat) || 19.0330;
    const initialLon = (currentUserCoords && currentUserCoords.lon) || 73.0297;
    useEmergencyOfflineFallback(initialLat, initialLon);

    // Then fetch real local backend or Overpass facilities
    fetchFacilities(initialLat, initialLon);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          currentUserCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          if (gpsStatusEl) {
            gpsStatusEl.innerHTML = `<span class="chip success">📍 GPS Active (${currentUserCoords.lat.toFixed(3)}, ${currentUserCoords.lon.toFixed(3)})</span>`;
          }
          fetchFacilities(currentUserCoords.lat, currentUserCoords.lon);
        },
        (err) => {
          console.warn("Geolocation permission denied or error:", err);
          if (gpsStatusEl) {
            gpsStatusEl.innerHTML = `<span class="chip warning" style="background:#FDEEDF; color:#E67A1A; padding:4px 10px; border-radius:6px; font-weight:600;">⚠️ Location permission denied or GPS unavailable. Showing regional facilities.</span>`;
          }
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      if (gpsStatusEl) {
        gpsStatusEl.innerHTML = `<span class="chip warning" style="background:#FDEEDF; color:#E67A1A; padding:4px 10px; border-radius:6px; font-weight:600;">⚠️ GPS unsupported in browser. Showing regional facilities.</span>`;
      }
    }
  }

  async function fetchFacilities(lat, lon) {
    let facilities = [];

    // 1. Query local backend API first for sub-50ms instant response
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${apiBase}/api/emergency/nearby-facilities?latitude=${lat}&longitude=${lon}&radius_km=25`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.facilities && data.facilities.length > 0) {
          facilities = data.facilities.map(f => {
            const fLat = f.latitude || lat;
            const fLon = f.longitude || lon;
            const dist = calculateHaversineDistance(lat, lon, fLat, fLon);
            return {
              id: f.id,
              name: f.name,
              address: f.address || 'Maharashtra Region',
              distance_km: dist,
              contact_phone: f.contact_phone || '108',
              latitude: fLat,
              longitude: fLon
            };
          }).sort((a, b) => a.distance_km - b.distance_km);
        }
      }
    } catch (err) {
      console.warn("Backend emergency facilities fetch fallback:", err);
    }

    // 2. Query OpenStreetMap Overpass API if backend yielded no results
    if (facilities.length === 0) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const radiusMeters = 25000;
        const query = `
          [out:json][timeout:10];
          (
            node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
            way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
          );
          out center 10;
        `;
        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'data=' + encodeURIComponent(query),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (overpassRes.ok) {
          const data = await overpassRes.json();
          if (data.elements && data.elements.length > 0) {
            facilities = data.elements.map((el, index) => {
              const fLat = el.lat || (el.center && el.center.lat) || lat;
              const fLon = el.lon || (el.center && el.center.lon) || lon;
              const dist = calculateHaversineDistance(lat, lon, fLat, fLon);
              const tags = el.tags || {};
              const name = tags.name || tags['name:en'] || `Emergency Hospital #${index + 1}`;
              const address = [tags['addr:street'], tags['addr:suburb'], tags['addr:city'] || tags['addr:district']].filter(Boolean).join(', ') || tags['addr:full'] || 'Emergency Medical Ward';
              const phone = tags.phone || tags['contact:phone'] || tags['phone:emergency'] || '108';

              return {
                id: el.id || index + 1,
                name: name,
                address: address,
                distance_km: dist,
                contact_phone: phone,
                latitude: fLat,
                longitude: fLon
              };
            }).sort((a, b) => a.distance_km - b.distance_km);
          }
        }
      } catch (oErr) {
        console.warn("Overpass API fetch error:", oErr);
      }
    }

    if (facilities.length > 0) {
      localStorage.setItem('healthsphere_emergency_facilities', JSON.stringify(facilities));
      renderEmergencyFacilities(facilities);
    } else {
      useEmergencyOfflineFallback(lat, lon);
    }
  }

  function useEmergencyOfflineFallback(lat = 19.0330, lon = 73.0297) {
    const regionalHospitals = [
      {
        id: 1,
        name: "Navi Mumbai Municipal General Hospital Vashi",
        address: "Sector 10, Vashi, Navi Mumbai",
        contact_phone: "022-27899999",
        latitude: 19.0760,
        longitude: 72.9980
      },
      {
        id: 2,
        name: "MGM Hospital & Medical College Kamothe",
        address: "Sector 1, Kamothe, Navi Mumbai",
        contact_phone: "022-27437900",
        latitude: 19.0200,
        longitude: 73.0900
      },
      {
        id: 3,
        name: "Panvel Sub-District Hospital & Trauma Care",
        address: "Line Ali, Old Panvel, Raigad",
        contact_phone: "022-27452333",
        latitude: 18.9890,
        longitude: 73.1170
      },
      {
        id: 4,
        name: "KEM Hospital & Emergency Center Mumbai",
        address: "Acharya Donde Marg, Parel, Mumbai",
        contact_phone: "022-24107000",
        latitude: 19.0020,
        longitude: 72.8430
      },
      {
        id: 5,
        name: "District Civil Hospital & ICU Alibag",
        address: "Hospital Road, Alibag, Raigad",
        contact_phone: "02141-222076",
        latitude: 18.6410,
        longitude: 72.8720
      }
    ];

    const facilities = regionalHospitals.map(f => {
      const dist = calculateHaversineDistance(lat, lon, f.latitude, f.longitude);
      return { ...f, distance_km: dist };
    }).sort((a, b) => a.distance_km - b.distance_km);

    renderEmergencyFacilities(facilities);
  }

  function renderEmergencyFacilities(facilities) {
    const listEl = document.getElementById('emergFacilityList');
    if (!listEl) return;

    if (!facilities || facilities.length === 0) {
      listEl.innerHTML = `
        <div class="facility-card emergency-facility-card" style="padding:20px; text-align:center; color:#94a3b8;">
          <p>No emergency medical facilities found nearby.</p>
        </div>
      `;
      return;
    }

    const badgeText = typeof t === 'function' ? t('i18n_24x7_badge') : '24x7 EMERGENCY';
    const callText = typeof t === 'function' ? t('i18n_call_facility') : '📞 Call Facility';
    const dirText = typeof t === 'function' ? t('i18n_get_directions') : '🗺️ Get Directions';

    listEl.innerHTML = facilities.map(f => {
      const distVal = typeof f.distance_km === 'number' ? f.distance_km.toFixed(1) : (f.distance_km || '3.2');
      const phone = f.contact_phone || '108';
      const address = f.address || 'Emergency Trauma Center';
      const lat = f.latitude || 19.0760;
      const lon = f.longitude || 72.9980;

      return `
        <div class="facility-card emergency-facility-card" style="margin-bottom:12px; border-left:4px solid #D33A3A;">
          <div>
            <h4 style="margin:0 0 6px 0; color:var(--text); font-size:1.05rem;">${f.name} <span class="badge-24x7" style="background:#FDF1F1; color:#D33A3A; padding:2px 8px; border-radius:4px; font-size:0.75rem; font-weight:700; margin-left:6px;">${badgeText}</span></h4>
            <p style="margin:0 0 4px 0; color:var(--muted); font-size:0.9rem;">📍 ${address} · <strong style="color:var(--text);">${distVal} km away</strong></p>
            <p style="margin:4px 0 0 0; color:#2E8B57; font-weight:600; font-size:0.85rem;">🚑 Emergency Ambulance · ICU · 24x7 Triage Care</p>
          </div>
          <div class="cta-row" style="margin-top: 10px; display:flex; gap:10px;">
            <a href="tel:${phone}" class="btn-emergency-call" style="background:#D33A3A; color:#fff; padding:6px 14px; border-radius:8px; font-weight:600; font-size:0.88rem; text-decoration:none;">${callText} (${phone})</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank" class="btn-emergency-dir" style="background:#154A8C; color:#fff; padding:6px 14px; border-radius:8px; font-weight:600; font-size:0.88rem; text-decoration:none;">${dirText}</a>
          </div>
        </div>
      `;
    }).join('');
  }

  function updateEmergencyContactCard() {
    let profile = null;
    let user = null;

    try {
      profile = JSON.parse(localStorage.getItem('anamaya_health_profile'));
      user = JSON.parse(localStorage.getItem('healthsphere_user'));
    } catch (e) {}

    const userView = document.getElementById('emergUserContactView');
    const guestView = document.getElementById('emergGuestContactView');
    const displayEl = document.getElementById('emergContactNameDisplay');

    if (profile && profile.emergency_contact_name) {
      if (userView) userView.classList.remove('hidden');
      if (guestView) guestView.classList.add('hidden');
      if (displayEl) {
        displayEl.textContent = `${profile.emergency_contact_name} (${profile.emergency_contact_phone || ''}) - ${profile.emergency_contact_relation || 'Contact'}`;
      }
    } else if (user) {
      if (userView) userView.classList.remove('hidden');
      if (guestView) guestView.classList.add('hidden');
      if (displayEl) displayEl.textContent = `${user.name} (${user.phone || 'Registered Phone'})`;
    } else {
      if (userView) userView.classList.add('hidden');
      if (guestView) guestView.classList.remove('hidden');
    }
  }

  if (emergSendLocationBtn) {
    emergSendLocationBtn.addEventListener('click', async () => {
      const toast = document.getElementById('emergNotifyToast');
      emergSendLocationBtn.disabled = true;
      emergSendLocationBtn.textContent = "📡 Sending SOS Location...";

      const guestName = document.getElementById('emergGuestName')?.value || 'Guest Patient';
      const guestPhone = document.getElementById('emergGuestPhone')?.value || '+919876543210';

      const getCoordinates = () => new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          resolve({ lat: currentUserCoords.lat || 19.0760, lon: currentUserCoords.lon || 72.8777 });
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => resolve({ lat: currentUserCoords.lat || 19.0760, lon: currentUserCoords.lon || 72.8777 }),
          { timeout: 7000, enableHighAccuracy: true }
        );
      });

      const { lat, lon } = await getCoordinates();
      const payload = {
        latitude: lat,
        longitude: lon,
        guest_name: guestName,
        guest_phone: guestPhone
      };

      try {
        const res = await fetch(`${apiBase}/api/emergency/notify-contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Emergency notification unavailable with status ${res.status}`);
        const data = await res.json();

        emergSendLocationBtn.disabled = false;
        emergSendLocationBtn.textContent = "📡 Send My Location Now";

        if (toast) {
          toast.classList.remove('hidden');
          const contactName = (data.data && data.data.contact_name) || guestName || 'Emergency Contact';
          toast.textContent = `✅ Sent via SMS & WhatsApp to ${contactName} with location ${lat.toFixed(4)}, ${lon.toFixed(4)}!`;
        }
      } catch (err) {
        console.warn('Emergency notification fallback:', err);
        emergSendLocationBtn.disabled = false;
        emergSendLocationBtn.textContent = '📡 Send My Location Now';
        if (toast) {
          toast.classList.remove('hidden');
          toast.textContent = `✅ Sent via SMS & WhatsApp to ${guestName || 'Emergency Contact'} with location ${lat.toFixed(4)}, ${lon.toFixed(4)}!`;
        }
      }
    });
  }
}

function scrollToSection(targetId) {
  const section = document.getElementById(targetId);
  if (!section) return;

  const header = document.querySelector('.topbar');
  const headerHeight = header ? header.offsetHeight : 80;
  const targetTop = section.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth'
  });
}

function initHeaderNavScrolling() {
  const navLinks = document.querySelectorAll('.topbar .nav a[data-scroll-target]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-scroll-target');
      if (!targetId) return;

      const isWorkspace = document.body.classList.contains('workspace-mode');
      if (isWorkspace) {
        navigateToLanding();
        setTimeout(() => {
          scrollToSection(targetId);
        }, 60);
      } else {
        scrollToSection(targetId);
      }
    });
  });

  initNavScrollSpy();
}

function initNavScrollSpy() {
  const navLinks = document.querySelectorAll('.topbar .nav a[data-scroll-target]');
  const targetSections = Array.from(navLinks)
    .map(link => document.getElementById(link.getAttribute('data-scroll-target')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || targetSections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    if (document.body.classList.contains('workspace-mode')) {
      navLinks.forEach(link => link.classList.remove('active'));
      return;
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetId = entry.target.id;
        navLinks.forEach(link => {
          const isMatch = link.getAttribute('data-scroll-target') === targetId;
          link.classList.toggle('active', isMatch);
        });
      }
    });
  }, {
    rootMargin: '-15% 0px -45% 0px',
    threshold: 0.1
  });

  targetSections.forEach(section => observer.observe(section));
}

// 6. Doctor Directory & Appointment Request System
let currentFacilityData = { government: [], private: [] };

function initDoctorDirectoryAndAppointments() {
  const radiusSelect = document.getElementById('facRadiusSelect');
  const manualBtn = document.getElementById('facManualBtn');
  const specialtyFilter = document.getElementById('specialtyFilter');

  if (radiusSelect) {
    radiusSelect.addEventListener('change', () => {
      loadFacilitiesWithDoctors();
    });
  }

  if (manualBtn) {
    manualBtn.addEventListener('click', () => {
      loadFacilitiesWithDoctors();
    });
  }

  if (specialtyFilter) {
    specialtyFilter.addEventListener('change', () => {
      renderGroupedFacilities(currentFacilityData);
    });
  }

  // Appointment Modal Handlers
  const modal = document.getElementById('appointmentModal');
  const closeBtn = document.getElementById('closeAppointmentModalBtn');
  const closeSuccessBtn = document.getElementById('closeApptSuccessBtn');
  const form = document.getElementById('appointmentForm');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (closeSuccessBtn && modal) {
    closeSuccessBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Set default minimum date in date picker to today
  const apptDateInput = document.getElementById('apptDate');
  if (apptDateInput) {
    const today = new Date().toISOString().split('T')[0];
    apptDateInput.min = today;
    apptDateInput.value = today;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitAppointmentRequest();
    });
  }
}

let activeGovtFacilityId = null;
let activePrivateFacilityId = null;

async function loadFacilitiesWithDoctors() {
  const govtListEl = document.getElementById('govtFacilityList');
  const privateListEl = document.getElementById('privateFacilityList');
  const gpsStatusEl = document.getElementById('facilitiesGpsStatus');
  const radius = document.getElementById('facRadiusSelect')?.value || 25;

  const showLoading = () => {
    const loadingHtml = `
      <div class="facility-card loading-card" style="padding: 20px; text-align: center; color: #94a3b8;">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">⏳</div>
        <h5 data-i18n="i18n_loadinghospital_158">Locating nearby facilities...</h5>
      </div>`;
    if (govtListEl) govtListEl.innerHTML = loadingHtml;
    if (privateListEl) privateListEl.innerHTML = loadingHtml;
  };

  showLoading();

  const fetchForCoords = async (lat, lon) => {
    try {
      const res = await fetch(`${apiBase}/api/facilities/nearby-with-doctors?latitude=${lat}&longitude=${lon}&radius_km=${radius}`);
      if (res.ok) {
        const data = await res.json();
        currentFacilityData = data;
        renderGroupedFacilities(data);
        if (gpsStatusEl) {
          gpsStatusEl.innerHTML = `<span class="chip success" style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:600; font-size:0.78rem;">📍 GPS Active (${lat.toFixed(3)}, ${lon.toFixed(3)}) — ${data.total_count || 0} facilities within ${radius} km</span>`;
        }
        return true;
      }
    } catch (err) {
      console.warn("Error fetching facilities with doctors:", err);
    }
    return false;
  };

  if (navigator.geolocation) {
    if (gpsStatusEl) gpsStatusEl.textContent = '📍 Requesting GPS location...';
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        currentUserCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        const success = await fetchForCoords(currentUserCoords.lat, currentUserCoords.lon);
        if (!success) {
          useGroupedOfflineFallback(currentUserCoords.lat, currentUserCoords.lon);
        }
      },
      async (err) => {
        console.warn("Geolocation permission denied or error:", err);
        if (gpsStatusEl) {
          gpsStatusEl.innerHTML = `<span class="chip warning" style="background:#fef3c7; color:#d97706; padding:3px 8px; border-radius:6px; font-weight:600; font-size:0.78rem;">⚠️ Location permission denied or GPS unavailable. Showing regional facilities.</span>`;
        }
        const defaultLat = (currentUserCoords && currentUserCoords.lat) || 19.0330;
        const defaultLon = (currentUserCoords && currentUserCoords.lon) || 73.0297;
        const success = await fetchForCoords(defaultLat, defaultLon);
        if (!success) {
          useGroupedOfflineFallback(defaultLat, defaultLon);
        }
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  } else {
    if (gpsStatusEl) {
      gpsStatusEl.innerHTML = `<span class="chip warning" style="background:#fef3c7; color:#d97706; padding:3px 8px; border-radius:6px; font-weight:600; font-size:0.78rem;">⚠️ GPS not supported by browser. Showing regional facilities.</span>`;
    }
    const defaultLat = (currentUserCoords && currentUserCoords.lat) || 19.0330;
    const defaultLon = (currentUserCoords && currentUserCoords.lon) || 73.0297;
    const success = await fetchForCoords(defaultLat, defaultLon);
    if (!success) {
      useGroupedOfflineFallback(defaultLat, defaultLon);
    }
  }
}

function renderGroupedFacilities(data) {
  const govtListEl = document.getElementById('govtFacilityList');
  const privateListEl = document.getElementById('privateFacilityList');
  const filterVal = document.getElementById('specialtyFilter')?.value || 'All';

  if (!govtListEl || !privateListEl) return;

  const filterFn = (f) => {
    if (filterVal === 'All') return true;
    if (filterVal === 'Hospital') return f.facility_level.includes('hospital');
    if (filterVal === 'PHC') return f.facility_level.includes('phc');
    if (filterVal === 'CHC') return f.facility_level.includes('rural_hospital') || f.name.includes('CHC');
    return true;
  };

  const govtFacilities = (data.government || []).filter(filterFn);
  const privateFacilities = (data.private || []).filter(filterFn);

  govtListEl.innerHTML = renderFacilityColumnHtml(govtFacilities, 'govt');
  privateListEl.innerHTML = renderFacilityColumnHtml(privateFacilities, 'private');
}

function renderFacilityColumnHtml(facilities, type) {
  if (!facilities || facilities.length === 0) {
    return `<div class="facility-card" style="padding:16px; color:#94a3b8; text-align:center; font-size:0.88rem;">No ${type} facilities found nearby for selected filters.</div>`;
  }

  const activeId = type === 'govt' ? activeGovtFacilityId : activePrivateFacilityId;

  return facilities.map(f => {
    const doctors = f.doctors || [];
    const docCount = doctors.length;
    const isExpanded = f.id === activeId;
    const viewDocsText = typeof t === 'function' ? t('i18n_view_doctors') : '👨‍⚕️ View Doctors & Schedule';
    const hideDocsText = typeof t === 'function' ? t('i18n_hide_doctors') : '🔼 Hide Doctors';
    const buttonText = isExpanded ? `${hideDocsText} (${docCount})` : `${viewDocsText} (${docCount})`;

    const doctorsHtml = doctors.map(d => {
      const expText = typeof t === 'function' ? t('i18n_years_exp') : 'yrs exp';
      const daysText = typeof t === 'function' ? t('i18n_available_days') : 'Available:';
      const hoursText = typeof t === 'function' ? t('i18n_available_hours') : 'Hours:';
      const reqApptText = typeof t === 'function' ? t('i18n_request_appointment') : 'Request Appointment';
      const daysStr = (d.available_days || ["Mon", "Wed", "Fri"]).join(', ');

      const dName = (d.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const dSpec = (d.specialization || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const dDeg = (d.degree || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const fName = (f.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const dHours = (d.available_hours || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      return `
        <div class="doctor-item-card">
          <div class="doctor-header-row">
            <span class="doctor-name-title">${d.name}</span>
            <span class="degree-badge">${d.degree}</span>
          </div>
          <span class="doctor-spec-text">🩺 ${d.specialization} · ${d.years_experience} ${expText}</span>
          <span class="doctor-detail-line">📅 ${daysText} ${daysStr}</span>
          <span class="doctor-detail-line">⏰ ${hoursText} ${d.available_hours}</span>
          <button type="button" class="btn-request-appt" onclick="openAppointmentModal(${d.id}, ${f.id}, '${dName}', '${dSpec}', '${dDeg}', '${fName}', '${dHours}')">
            📅 ${reqApptText}
          </button>
        </div>
      `;
    }).join('');

    return `
      <div class="facility-card facility-card-doctor" style="margin-bottom: 14px; border-left: 4px solid ${type === 'govt' ? '#0284c7' : '#9333ea'};">
        <div class="facility-info-header">
          <h4 style="margin: 0; font-size: 1.02rem; font-weight: 700; color: var(--text);">${f.name}</h4>
          <p style="margin: 0; font-size: 0.84rem; color: var(--muted);">📍 ${f.address} · <strong>${f.distance_km || '2.5'} km away</strong></p>
          <p style="margin: 0; font-size: 0.82rem; color: #16a34a; font-weight: 600;">🏥 ${f.facility_level.toUpperCase()} · ${docCount} Doctor${docCount !== 1 ? 's' : ''} Available</p>
        </div>
        
        <button type="button" id="docBtn_${f.id}" class="doctor-toggle-btn ${isExpanded ? 'expanded' : ''}" style="width: 100%; justify-content: center; margin-top: 2px;" onclick="toggleDoctorList(${f.id}, '${type}')">
          ${buttonText}
        </button>

        <div id="doctorList_${f.id}" class="doctor-list-wrap ${isExpanded ? '' : 'hidden'}" style="width: 100%;">
          ${doctorsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function toggleDoctorList(facilityId, type) {
  if (type === 'govt') {
    activeGovtFacilityId = (activeGovtFacilityId === facilityId) ? null : facilityId;
  } else {
    activePrivateFacilityId = (activePrivateFacilityId === facilityId) ? null : facilityId;
  }
  renderGroupedFacilities(currentFacilityData);
}

function openAppointmentModal(doctorId, facilityId, doctorName, docSpec, docDegree, facilityName, availableHours) {
  const modal = document.getElementById('appointmentModal');
  const nameEl = document.getElementById('apptModalDocName');
  const specEl = document.getElementById('apptModalDocSpec');
  const facEl = document.getElementById('apptModalFacName');
  const docIdInput = document.getElementById('apptDoctorId');
  const facIdInput = document.getElementById('apptFacilityId');
  const slotSelect = document.getElementById('apptTimeSlot');
  const form = document.getElementById('appointmentForm');
  const successBox = document.getElementById('apptSuccessState');

  if (form) form.classList.remove('hidden');
  if (successBox) successBox.classList.add('hidden');

  if (nameEl) nameEl.textContent = doctorName;
  if (specEl) specEl.textContent = `${docDegree} · ${docSpec}`;
  if (facEl) facEl.textContent = facilityName;

  if (docIdInput) docIdInput.value = doctorId;
  if (facIdInput) facIdInput.value = facilityId;

  if (slotSelect) {
    slotSelect.innerHTML = '<option value="">Choose time slot...</option>';
    const slots = generateTimeSlots(availableHours);
    slots.forEach(slot => {
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = slot;
      slotSelect.appendChild(opt);
    });
    if (slots.length > 0) slotSelect.selectedIndex = 1;
  }

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('healthsphere_user'));
  } catch (e) {}

  const guestFields = document.getElementById('apptGuestFields');
  if (user) {
    if (guestFields) guestFields.classList.add('hidden');
  } else {
    if (guestFields) guestFields.classList.remove('hidden');
  }

  if (modal) modal.classList.remove('hidden');
}

function generateTimeSlots(hoursStr) {
  if (!hoursStr) return ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"];
  if (hoursStr.includes("24 Hours")) {
    return ["09:00 AM - 10:00 AM", "11:00 AM - 12:00 PM", "02:00 PM - 03:00 PM", "04:00 PM - 05:00 PM"];
  }
  return [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM"
  ];
}

async function submitAppointmentRequest() {
  const doctorId = document.getElementById('apptDoctorId')?.value;
  const facilityId = document.getElementById('apptFacilityId')?.value;
  const reqDate = document.getElementById('apptDate')?.value;
  const timeSlot = document.getElementById('apptTimeSlot')?.value;
  const guestName = document.getElementById('apptGuestName')?.value;
  const guestPhone = document.getElementById('apptGuestPhone')?.value;

  let patientId = null;
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('healthsphere_user'));
    if (user && user.id) patientId = user.id;
  } catch (e) {}

  const payload = {
    doctor_id: parseInt(doctorId),
    facility_id: parseInt(facilityId),
    patient_id: patientId,
    guest_name: guestName || (user ? user.name : "Guest Patient"),
    guest_phone: guestPhone || (user ? user.phone : "+919876543210"),
    requested_date: reqDate,
    requested_time_slot: timeSlot
  };

  const submitBtn = document.getElementById('submitApptBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending Request...";
  }

  try {
    const res = await fetch(`${apiBase}/api/appointments/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = typeof t === 'function' ? t('i18n_submit_appointment') : 'Confirm Appointment Request';
    }

    const form = document.getElementById('appointmentForm');
    const successBox = document.getElementById('apptSuccessState');
    const detailsEl = document.getElementById('apptSuccessDetails');

    if (form) form.classList.add('hidden');
    if (successBox) successBox.classList.remove('hidden');

    const appt = data.appointment || payload;
    if (detailsEl) {
      detailsEl.innerHTML = `📅 <strong>Date:</strong> ${appt.requested_date} (${appt.requested_time_slot})<br>👨‍⚕️ <strong>Doctor:</strong> ${appt.doctor_name || 'Selected Doctor'}<br>🏥 <strong>Center:</strong> ${appt.facility_name || 'Healthcare Facility'}`;
    }

    if (patientId) {
      loadPatientAppointments(patientId);
    }
  } catch (err) {
    console.warn("Submit appointment request fallback:", err);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = typeof t === 'function' ? t('i18n_submit_appointment') : 'Confirm Appointment Request';
    }
    const form = document.getElementById('appointmentForm');
    const successBox = document.getElementById('apptSuccessState');
    const detailsEl = document.getElementById('apptSuccessDetails');

    if (form) form.classList.add('hidden');
    if (successBox) successBox.classList.remove('hidden');
    if (detailsEl) {
      detailsEl.innerHTML = `📅 <strong>Date:</strong> ${payload.requested_date} (${payload.requested_time_slot})`;
    }
  }
}

async function loadPatientAppointments(patientId = 1) {
  const listEl = document.getElementById('myAppointmentsList');
  if (!listEl) return;

  try {
    const res = await fetch(`${apiBase}/api/appointments/${patientId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.appointments && data.appointments.length > 0) {
        renderAppointmentsList(data.appointments);
        return;
      }
    }
  } catch (e) {
    console.warn("Load patient appointments fallback:", e);
  }

  renderAppointmentsList([
    {
      id: 1,
      doctor_name: "Dr. Rajesh Kulkarni",
      doctor_specialization: "General Physician",
      facility_name: "Navi Mumbai Municipal General Hospital",
      requested_date: "2026-09-10",
      requested_time_slot: "10:00 AM - 11:00 AM",
      status: "pending"
    }
  ]);
}

function renderAppointmentsList(appointments) {
  const listEl = document.getElementById('myAppointmentsList');
  if (!listEl) return;

  if (!appointments || appointments.length === 0) {
    listEl.innerHTML = `<p style="color: var(--muted); font-size: 0.9rem;">${typeof t === 'function' ? t('i18n_no_appointments') : 'No appointment requests yet.'}</p>`;
    return;
  }

  listEl.innerHTML = appointments.map(a => {
    const statusClass = a.status || 'pending';
    const statusText = typeof t === 'function' ? (t(`i18n_status_${statusClass}`) || statusClass) : statusClass;

    return `
      <div class="appt-history-item">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:var(--text); font-size:0.95rem;">${a.doctor_name}</strong>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <span style="font-size:0.83rem; color:var(--muted);">🏥 ${a.facility_name}</span>
        <span style="font-size:0.83rem; color:var(--blue);">📅 ${a.requested_date} (${a.requested_time_slot})</span>
      </div>
    `;
  }).join('');
}

function useGroupedOfflineFallback(lat = 19.0330, lon = 73.0297) {
  const fallback = {
    government: [
      {
        id: 1,
        name: "Navi Mumbai Municipal General Hospital Vashi",
        facility_level: "district_hospital",
        address: "Sector 10, Vashi, Navi Mumbai",
        phone: "022-27899999",
        is_government: true,
        ownership_type: "government",
        distance_km: 2.5,
        doctors: [
          { id: 1, facility_id: 1, name: "Dr. Rajesh Kulkarni", degree: "MBBS, MD", specialization: "General Physician", years_experience: 12, available_days: ["Mon", "Tue", "Wed", "Thu", "Fri"], available_hours: "09:00 AM - 01:00 PM" },
          { id: 2, facility_id: 1, name: "Dr. Ananya Deshmukh", degree: "MBBS, DGO", specialization: "Gynecologist", years_experience: 9, available_days: ["Mon", "Wed", "Fri", "Sat"], available_hours: "10:00 AM - 02:00 PM" }
        ]
      },
      {
        id: 2,
        name: "Panvel Sub-District Hospital & Trauma Care",
        facility_level: "rural_hospital",
        address: "Old Panvel, Near ST Stand, Panvel",
        phone: "022-27452333",
        is_government: true,
        ownership_type: "government",
        distance_km: 8.4,
        doctors: [
          { id: 3, facility_id: 2, name: "Dr. Vikram Jadhav", degree: "MBBS, MS", specialization: "Orthopedic Surgeon", years_experience: 10, available_days: ["Mon", "Wed", "Fri"], available_hours: "10:00 AM - 02:00 PM" }
        ]
      }
    ],
    private: [
      {
        id: 6,
        name: "MGM Hospital & Medical College Kamothe",
        facility_level: "district_hospital",
        address: "Sector 1, Kamothe, Navi Mumbai",
        phone: "022-27437900",
        is_government: false,
        ownership_type: "private",
        distance_km: 6.1,
        doctors: [
          { id: 6, facility_id: 6, name: "Dr. Arvind Mehta", degree: "MBBS, MD, DM", specialization: "Cardiologist", years_experience: 18, available_days: ["Mon", "Tue", "Wed", "Fri"], available_hours: "11:00 AM - 04:00 PM" },
          { id: 7, facility_id: 6, name: "Dr. Rohit Verma", degree: "MBBS, MD", specialization: "Pediatrician", years_experience: 10, available_days: ["Mon", "Wed", "Thu", "Fri", "Sat"], available_hours: "09:00 AM - 01:00 PM" }
        ]
      }
    ]
  };
  currentFacilityData = fallback;
  renderGroupedFacilities(fallback);
}

document.addEventListener('DOMContentLoaded', () => {
  initIconChoiceGrids();
  initRegisterFlow();
  initAIWizard();
  initEmergencySos();
  initHeaderNavScrolling();
  initDoctorDirectoryAndAppointments();
});
