const apiBase =
  window.HEALTHSPHERE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://your-backend-domain.example.com');

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
      <span>Backend connected: ${data.service || 'HealthSphere AI'} (${data.status})</span>
    `;
  } catch (error) {
    statusCard.innerHTML = `
      <div class="status-dot"></div>
      <span>Backend offline — set HEALTHSPHERE_API_URL or start the API on localhost:8000</span>
    `;
  }
}

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
