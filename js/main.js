const FORMSPREE = 'https://formspree.io/f/mpqngwwg';

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function toggleFaq(btn) {
  btn.closest('.faq-item').classList.toggle('open');
}

function filterFaq(cat, btn) {
  document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.faq-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    if (item.style.display === 'none') item.classList.remove('open');
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function postForm(data) {
  return fetch(FORMSPREE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

function submitContact() {
  const fn = document.getElementById('cFirstName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg = document.getElementById('cMessage').value.trim();
  if (!fn || !email || !msg) { showToast('Please fill in required fields.'); return; }
  postForm({ _subject: 'TPB Contact Form — ' + fn, name: fn + ' ' + document.getElementById('cLastName').value.trim(), email, subject: document.getElementById('cSubject').value.trim(), message: msg })
    .then(r => {
      if (r.ok) { showToast('Message sent! We will be in touch soon.'); ['cFirstName','cLastName','cEmail','cSubject','cMessage'].forEach(id => document.getElementById(id).value = ''); }
      else showToast('Something went wrong. Please call (770) 691-0369.');
    }).catch(() => showToast('Something went wrong. Please call (770) 691-0369.'));
}

function submitBirthday() {
  const fn = document.getElementById('bFirstName').value.trim();
  const email = document.getElementById('bEmail').value.trim();
  const kids = document.getElementById('bKids').value.trim();
  if (!fn || !email || !kids) { showToast('Please fill in all required fields.'); return; }
  postForm({ _subject: 'TPB Birthday Inquiry — ' + fn, name: fn + ' ' + document.getElementById('bLastName').value.trim(), email, children: kids, preferred_date: document.getElementById('bDate').value, group_size: document.getElementById('bSize').value, notes: document.getElementById('bNotes').value.trim(), form_type: 'Birthday Party Inquiry' })
    .then(r => {
      if (r.ok) { showToast('Birthday inquiry submitted! We will contact you to confirm.'); ['bFirstName','bLastName','bEmail','bKids','bDate','bNotes'].forEach(id => document.getElementById(id).value = ''); document.getElementById('bSize').value = ''; }
      else showToast('Something went wrong. Please call (770) 691-0369.');
    }).catch(() => showToast('Something went wrong. Please call (770) 691-0369.'));
}

function subscribeNewsletter() {
  const email = document.getElementById('nlEmail').value.trim();
  if (!email || !email.includes('@')) { showToast('Enter a valid email address.'); return; }
  postForm({ _subject: 'TPB Mailing List Signup', email, form_type: 'Newsletter Signup' })
    .then(r => {
      if (r.ok) { showToast('You are on the list! Welcome to the Tallapoosa family.'); document.getElementById('nlEmail').value = ''; }
      else showToast('Something went wrong. Try again or call us.');
    }).catch(() => showToast('Something went wrong.'));
}

function notifyMe() {
  const email = document.getElementById('csEmail').value.trim();
  if (!email || !email.includes('@')) { showToast('Enter a valid email address.'); return; }
  postForm({ _subject: 'TPB Membership Notify Request', email, form_type: 'Membership Coming Soon Notify' })
    .then(r => {
      if (r.ok) { showToast('You are on the list! We will notify you when membership goes live.'); document.getElementById('csEmail').value = ''; }
      else showToast('Something went wrong. Try again or call us.');
    }).catch(() => showToast('Something went wrong.'));
}

function dismissSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.classList.add('exiting');
  setTimeout(() => { splash.style.display = 'none'; document.body.style.overflow = ''; }, 580);
}

// Splash — first visit only
if (document.getElementById('splash')) {
  if (localStorage.getItem('tpb_visited')) {
    // Returning visitor — skip splash instantly
    const splash = document.getElementById('splash');
    splash.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    // First visit — show splash, then remember them
    document.body.style.overflow = 'hidden';
    localStorage.setItem('tpb_visited', '1');
    document.addEventListener('keydown', function() { dismissSplash(); }, { once: true });
  }
}

// Weather widget
function loadWeather() {
  const display = document.getElementById('weather-display');
  if (!display) return;
  const weatherDesc = {0:'Clear Sky',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',45:'Foggy',48:'Icy Fog',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',61:'Light Rain',63:'Rain',65:'Heavy Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',80:'Showers',81:'Heavy Showers',82:'Violent Showers',95:'Thunderstorm',96:'Thunderstorm + Hail',99:'Severe Thunderstorm'};
  const weatherIcon = {0:'&#x2600;&#xFE0F;',1:'&#x1F324;&#xFE0F;',2:'&#x26C5;',3:'&#x2601;&#xFE0F;',45:'&#x1F32B;&#xFE0F;',48:'&#x1F32B;&#xFE0F;',51:'&#x1F327;&#xFE0F;',53:'&#x1F327;&#xFE0F;',55:'&#x1F327;&#xFE0F;',61:'&#x1F326;&#xFE0F;',63:'&#x1F326;&#xFE0F;',65:'&#x26C8;&#xFE0F;',71:'&#x1F328;&#xFE0F;',73:'&#x1F328;&#xFE0F;',75:'&#x26C4;',80:'&#x1F327;&#xFE0F;',81:'&#x26C8;&#xFE0F;',82:'&#x26C8;&#xFE0F;',95:'&#x26A1;',96:'&#x26A1;',99:'&#x26A1;'};
  fetch('https://api.open-meteo.com/v1/forecast?latitude=33.7448&longitude=-85.2911&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York')
    .then(r => r.json())
    .then(data => {
      const c = data.current;
      const code = c.weather_code;
      const icon = weatherIcon[code] || '&#x1F321;&#xFE0F;';
      const desc = weatherDesc[code] || 'Unknown';
      const temp = Math.round(c.temperature_2m);
      const feels = Math.round(c.apparent_temperature);
      const wind = Math.round(c.wind_speed_10m);
      const humidity = c.relative_humidity_2m;
      const playable = (temp >= 45 && temp <= 95 && code < 61)
        ? '<span style="background:rgba(0,180,80,0.15);border:1px solid rgba(0,180,80,0.3);color:#00c458;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:0.15rem 0.6rem;">&#x2705; Good to Play</span>'
        : '<span style="background:rgba(204,0,0,0.12);border:1px solid rgba(204,0,0,0.3);color:#ff5555;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:0.15rem 0.6rem;">&#x26A0;&#xFE0F; Check Conditions</span>';
      display.innerHTML = `<span style="font-size:1.6rem;line-height:1;">${icon}</span><div><span style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:#fff;letter-spacing:0.05em;">${temp}&deg;F</span><span style="font-size:0.75rem;color:var(--muted);margin-left:0.4rem;">Feels ${feels}&deg;F</span></div><div style="font-size:0.8rem;color:var(--text);letter-spacing:0.05em;">${desc}</div><div style="font-size:0.75rem;color:var(--muted);">&#x1F4A8; ${wind} mph &nbsp;&middot;&nbsp; &#x1F4A7; ${humidity}%</div>${playable}`;
    })
    .catch(() => { display.innerHTML = '<span style="color:var(--muted);font-size:0.85rem;">Weather unavailable &mdash; check conditions before heading out.</span>'; });
}

loadWeather();
