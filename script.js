// script.js - upgraded with description input, 18 symptoms, professional result card, and TXT download for records

/* --------------------
   Basic SPA navigation
   -------------------- */
const views = document.querySelectorAll(".view");
const navBtns = document.querySelectorAll(".nav-btn");
navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    showView(btn.dataset.target || btn.textContent.trim().toLowerCase());
    navBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});
document.querySelectorAll('[data-target]').forEach(b=>{
  b.addEventListener('click', ()=> {
    const t = b.getAttribute('data-target');
    if (t) {
      showView(t);
      navBtns.forEach(nb=>nb.classList.toggle('active', nb.dataset.target===t));
    }
  })
});
function showView(id){
  views.forEach(v=>v.classList.remove('active'));
  const view = document.getElementById(id);
  if (view) view.classList.add('active');
  if (id === 'nearby') initMapOnce();
}

// mobile hamburger toggle
const hamburger = document.getElementById('hamburger');
hamburger?.addEventListener('click', ()=>{
  document.querySelectorAll('.nav-btn').forEach(n=>n.style.display = n.style.display === 'inline-block' ? 'none' : 'inline-block');
});

/* -------------------------------------------
   Symptom data: 18 symptoms with remedies & meds
   ------------------------------------------- */
const SYMPTOM_DB = {
  fever: {
    label: 'Fever',
    severityNotes: {mild:'Hydration & rest', moderate:'Consider antipyretic', severe:'Seek medical attention', emergency:'Emergency care required'},
    remedies: ['Rest and fluids', 'Cool compress', 'Paracetamol as per dosing guidance'],
    medicines: ['Paracetamol (as per weight/age)', 'Ibuprofen (if not contraindicated)'],
    advice: 'Monitor temperature and watch for difficulty breathing, rash, persistent vomiting, or confusion.'
  },
  cough: {
    label: 'Cough',
    remedies: ['Warm fluids and steam inhalation', 'Honey for adults/children >1 year', 'Humidified air'],
    medicines: ['Cough lozenges', 'Saline nasal drops'],
    advice: 'See doctor if cough persists >2 weeks, or is productive with blood.'
  },
  shortness_of_breath: {
    label: 'Shortness of breath',
    remedies: ['Sit upright; try controlled breathing', 'Oxygen if available (only with guidance)'],
    medicines: [],
    advice: 'This can be serious—seek urgent care immediately if new or severe.'
  },
  chest_pain: {
    label: 'Chest pain',
    remedies: ['Keep calm; sit upright', 'Avoid heavy exertion'],
    medicines: [],
    advice: 'Chest pain may be life-threatening. Call emergency services immediately.'
  },
  headache: {
    label: 'Headache',
    remedies: ['Hydration, rest, dark room', 'Apply cool compress if helpful'],
    medicines: ['Paracetamol', 'Ibuprofen'],
    advice: 'Seek urgent care for sudden severe headache or neurological signs.'
  },
  nausea: {
    label: 'Nausea / Vomiting',
    remedies: ['Small sips of ORS / clear fluids', 'BRAT diet when tolerating'],
    medicines: ['Oral rehydration solutions', 'Antiemetics (only if prescribed)'],
    advice: 'Prevent dehydration; seek care for persistent vomiting.'
  },
  abdominal_pain: {
    label: 'Abdominal pain',
    remedies: ['Rest, avoid heavy meals', 'Warm compress if cramp-like'],
    medicines: ['Antispasmodics (per doctor)'],
    advice: 'Severe localized pain, fever, vomiting, or blood in stool requires urgent evaluation.'
  },
  diarrhea: {
    label: 'Diarrhea',
    remedies: ['Oral rehydration', 'BRAT diet', 'Good hand hygiene'],
    medicines: ['Oral rehydration salts', 'Zinc in children (WHO guidance)'],
    advice: 'Watch for dehydration, high fever, or bloody stools.'
  },
  fatigue: {
    label: 'Fatigue',
    remedies: ['Rest, balanced diet, sleep hygiene'],
    medicines: [],
    advice: 'Persistent severe fatigue may need investigation (blood tests, thyroid).'
  },
  dizziness: {
    label: 'Dizziness / Fainting',
    remedies: ['Lie down, elevate legs', 'Hydration'],
    medicines: [],
    advice: 'If fainting or recurrent dizziness occurs, seek medical assessment.'
  },
  sore_throat: {
    label: 'Sore throat',
    remedies: ['Saltwater gargles', 'Warm fluids, throat lozenges'],
    medicines: ['Analgesics (paracetamol)'],
    advice: 'If severe pain, drooling, difficulty breathing, or high fever — seek care.'
  },
  runny_nose: {
    label: 'Runny nose / Congestion',
    remedies: ['Saline nasal spray', 'Steam inhalation'],
    medicines: ['Antihistamines (for allergic causes)'],
    advice: 'Usually self-limited; seek care if high fever or breathing difficulty.'
  },
  rash: {
    label: 'Skin rash',
    remedies: ['Cool compress', 'Avoid irritants'],
    medicines: ['Topical emollients or steroid creams (per doctor)'],
    advice: 'Rash with fever, blistering, or mucosal involvement warrants urgent review.'
  },
  bleeding: {
    label: 'Unusual bleeding',
    remedies: [],
    medicines: [],
    advice: 'Any unexplained bleeding requires immediate medical attention.'
  },
  urinary_issue: {
    label: 'Painful urination',
    remedies: ['Increase fluids, maintain hygiene'],
    medicines: ['Antibiotics if bacterial (only prescribed)'],
    advice: 'Urinary symptoms with fever or blood should be evaluated by clinician.'
  },
  joint_pain: {
    label: 'Joint / muscle pain',
    remedies: ['Rest, gentle mobility', 'Ice or heat as appropriate'],
    medicines: ['NSAIDs (if appropriate)'],
    advice: 'Severe swelling, redness, or fever requires evaluation.'
  },
  eye_problem: {
    label: 'Eye redness / irritation',
    remedies: ['Avoid rubbing, flush with clean water', 'Warm compress'],
    medicines: ['Lubricant eye drops'],
    advice: 'Pain, vision changes, or pus should prompt urgent eye care.'
  },
  mental_health: {
    label: 'Severe anxiety / depression',
    remedies: ['Grounding techniques, support line', 'Seek mental health support'],
    medicines: ['Medication only if prescribed by psychiatrist'],
    advice: 'If there is risk of self-harm, seek immediate help or emergency services.'
  }
};

/* ------------------------------------------------
   Symptom form handling and professional result UI
   ------------------------------------------------ */
const symptomForm = document.getElementById('symptomForm');
const resultBox = document.getElementById('analysisResult');

symptomForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const mainSymptom = document.getElementById('mainSymptom').value;
  const description = document.getElementById('description').value.trim();
  const duration = document.getElementById('duration').value;
  const severity = document.getElementById('severity').value;

  const symptomData = SYMPTOM_DB[mainSymptom] || null;

  // Build card
  const severityClass = severity; // mild/moderate/severe/emergency
  const severityLabel = severity.charAt(0).toUpperCase() + severity.slice(1);

  let html = `<div class="result-card card">
      <div class="result-left">
        <div style="display:flex;align-items:center;gap:12px;">
          <h3>${symptomData ? escapeHtml(symptomData.label) : escapeHtml(mainSymptom)}</h3>
          <span class="badge ${severityClass}">${escapeHtml(severityLabel)}</span>
        </div>
        <div class="kv" style="margin-top:12px">
          <p><strong>Age:</strong> ${escapeHtml(age || '—')}</p>
          <p><strong>Gender:</strong> ${escapeHtml(gender || '—')}</p>
          <p><strong>Duration:</strong> ${escapeHtml(duration)}</p>
        </div>

        <div style="margin-top:12px">
          <h4>Summary</h4>
          <p class="muted">${escapeHtml(description || (symptomData ? symptomData.advice : 'No description provided.'))}</p>
        </div>

        <div style="margin-top:12px">
          <h4>Suggested actions</h4>
          <ul>
            ${actionListForSeverity(severity)}
            ${symptomData && symptomData.remedies ? symptomData.remedies.map(r=>`<li>${escapeHtml(r)}</li>`).join('') : ''}
          </ul>
        </div>

        <div style="margin-top:12px">
          <h4>When to seek care</h4>
          <p class="muted">${severity === 'emergency' ? 'Call emergency services or go to the nearest emergency department now.' : (symptomData ? escapeHtml(symptomData.advice) : 'If symptoms worsen, seek medical attention.')}</p>
        </div>
      </div>

      <div class="result-right">
        <div class="card">
          <h4>Quick remedies</h4>
          <ul id="quickRemedy">
            ${symptomData && symptomData.remedies ? symptomData.remedies.map(r=>`<li>${escapeHtml(r)}</li>`).join('') : '<li>General supportive care</li>'}
          </ul>

          <h4 style="margin-top:10px">Basic medicines</h4>
          <ul id="quickMeds">
            ${symptomData && symptomData.medicines ? symptomData.medicines.map(m=>`<li>${escapeHtml(m)}</li>`).join('') : '<li>Consult your doctor</li>'}
          </ul>

          <div style="margin-top:12px">
            <button id="saveAsRecordBtn" class="primary">Save as Record</button>
          </div>
        </div>
      </div>
    </div>`;

  resultBox.innerHTML = html;
  resultBox.classList.remove('hidden');

  // attach save-as-record behavior
  document.getElementById('saveAsRecordBtn').addEventListener('click', () => {
    saveRecordFromAnalysis({
      date: new Date().toISOString().slice(0,10),
      condition: symptomData ? symptomData.label : mainSymptom,
      severity: severityLabel,
      notes: description || 'No additional notes',
      remedies: symptomData && symptomData.remedies ? symptomData.remedies.join('; ') : '',
      medicines: symptomData && symptomData.medicines ? symptomData.medicines.join('; ') : ''
    });
    alert('Record saved locally.');
  });

  // also populate Recommendations tab lists
  fillRecommendations(mainSymptom);
});

function actionListForSeverity(sev){
  if(sev === 'mild') return '<li>Self-care at home</li>';
  if(sev === 'moderate') return '<li>Consider contacting a clinician</li>';
  if(sev === 'severe') return '<li>Contact healthcare provider promptly</li>';
  return '<li>Call emergency services or go to ED</li>';
}

function fillRecommendations(symptomKey){
  const remList = document.getElementById('remedyList');
  const medList = document.getElementById('medicineList');
  const s = SYMPTOM_DB[symptomKey] || null;
  remList.innerHTML = s ? s.remedies.map(r=>`<li>${escapeHtml(r)}</li>`).join('') : '<li>General supportive care</li>';
  medList.innerHTML = s ? s.medicines.map(m=>`<li>${escapeHtml(m)}</li>`).join('') : '<li>Consult your doctor</li>';
}

/* ----------------------
   Records storage & export
   ---------------------- */
const recForm = document.getElementById('recordForm');
const recTableBody = document.querySelector('#recordTable tbody');
const STORAGE_KEY = 'healthaid.records';

function loadRecords(){
  const rec = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  renderRecords(rec);
}
function renderRecords(list){
  recTableBody.innerHTML = '';
  list.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.date}</td><td>${escapeHtml(r.condition)}</td><td>${escapeHtml(r.notes||'')}</td>
      <td>
        <button class="action-btn" onclick="deleteRecord(${idx})">Delete</button>
        <button class="action-btn" onclick="downloadSingleRecord(${idx})">Download</button>
      </td>`;
    recTableBody.appendChild(tr);
  });
}
function saveRecords(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  renderRecords(list);
}
recForm?.addEventListener('submit', e=>{
  e.preventDefault();
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const entry = {
    date: document.getElementById('recDate').value,
    condition: document.getElementById('recCondition').value,
    notes: document.getElementById('recNotes').value
  };
  records.unshift(entry);
  saveRecords(records);
  recForm.reset();
});
window.deleteRecord = function(idx){
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  records.splice(idx,1);
  saveRecords(records);
};

// Download single record as TXT (Key: Value)
window.downloadSingleRecord = function(idx){
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const r = records[idx];
  if(!r) return alert('Record not found');
  const lines = [
    `Date: ${r.date}`,
    `Condition: ${r.condition}`,
    `Notes: ${r.notes || ''}`
  ];
  const blob = new Blob([lines.join('\n')], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `record_${r.date}.txt`; a.click();
  URL.revokeObjectURL(url);
};

// Download all records as TXT (readable format)
document.getElementById('downloadTxtBtn')?.addEventListener('click', ()=>{
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if(records.length === 0) return alert('No records to download.');
  let content = '';
  records.forEach((r, idx) => {
    content += `--- Record ${idx+1} ---\n`;
    content += `Date: ${r.date}\n`;
    content += `Condition: ${r.condition}\n`;
    content += `Notes: ${r.notes || ''}\n\n`;
  });
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `healthaid_records.txt`; a.click();
  URL.revokeObjectURL(url);
});

// Import file (JSON array or TXT with simple format not strictly parsed)
document.getElementById('importFile')?.addEventListener('change', (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      if(f.name.endsWith('.json')){
        const parsed = JSON.parse(reader.result);
        if(Array.isArray(parsed)){
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          loadRecords();
          alert('Imported JSON records successfully.');
        } else alert('JSON must be an array of records.');
      } else {
        alert('Unsupported import format. Please import JSON array exported earlier.');
      }
    }catch(err){ alert('Failed to import: '+err.message) }
  };
  reader.readAsText(f);
});

document.getElementById('clearAllBtn')?.addEventListener('click', ()=>{
  if(confirm('Remove all saved records?')) {
    localStorage.removeItem(STORAGE_KEY);
    loadRecords();
  }
});

function saveRecordFromAnalysis(obj){
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  records.unshift({
    date: obj.date || new Date().toISOString().slice(0,10),
    condition: obj.condition || 'Symptom analysis',
    notes: `Severity: ${obj.severity} | Remedies: ${obj.remedies} | Medicines: ${obj.medicines} | Notes: ${obj.notes}`
  });
  saveRecords(records);
}

/* -----------------------------
   Nearby: Leaflet + Overpass API
   ----------------------------- */
let map, userMarker, resultsLayer;
let currentPos = null;
let mapInitialized = false;

function initMapOnce(){
  if(mapInitialized) return;
  mapInitialized = true;

  const defaultCenter = [21.146633, 79.088860];
  map = L.map('map', { zoomControl: true }).setView(defaultCenter, 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  }).addTo(map);

  resultsLayer = L.layerGroup().addTo(map);

  document.getElementById('useLocationBtn').addEventListener('click', ()=> {
    getLocation(true);
  });
  document.getElementById('searchNearbyBtn').addEventListener('click', ()=> {
    if(currentPos) {
      performSearch(currentPos);
    } else {
      getLocation(true, performSearch);
    }
  });

  getLocation(false);
}

function getLocation(promptUser = false, cb){
  if(!navigator.geolocation){
    alert('Geolocation not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(position=>{
    currentPos = { lat: position.coords.latitude, lng: position.coords.longitude };
    map.setView([currentPos.lat, currentPos.lng], 13);
    if(userMarker) userMarker.setLatLng([currentPos.lat, currentPos.lng]);
    else userMarker = L.marker([currentPos.lat, currentPos.lng], {title:'You'}).addTo(map);
    if(cb) cb(currentPos);
  }, err=>{
    if(promptUser) alert('Unable to access location. Using map center.');
    currentPos = null;
    if(cb) cb(map.getCenter());
  }, { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 });
}

async function performSearch(posOrCenter){
  const type = document.getElementById('facilityType').value;
  let tag = 'hospital';
  if(type === 'clinic') tag = 'clinic';
  if(type === 'pharmacy') tag = 'pharmacy';

  const radius = 5000;
  document.getElementById('radiusLabel').textContent = (radius/1000)+' km';

  const lat = posOrCenter.lat ?? posOrCenter.lat;
  const lon = posOrCenter.lng ?? posOrCenter.lng;

  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"="${tag}"](around:${radius},${lat},${lon});
      way["amenity"="${tag}"](around:${radius},${lat},${lon});
      relation["amenity"="${tag}"](around:${radius},${lat},${lon});
    );
    out center 50;
  `;
  const url = 'https://overpass-api.de/api/interpreter';

  resultsLayer.clearLayers();
  document.getElementById('nearbyList').innerHTML = `<div class="item">Searching nearby ${tag}s ...</div>`;

  try{
    const res = await fetch(url, { method:'POST', body: overpassQuery, headers:{ 'Content-Type':'text/plain' } });
    if(!res.ok) throw new Error('Overpass query failed');
    const data = await res.json();
    if(!data.elements || data.elements.length === 0){
      document.getElementById('nearbyList').innerHTML = `<div class="item">No ${tag} found nearby.</div>`;
      return;
    }

    const userPoint = currentPos ? { lat: currentPos.lat, lng: currentPos.lng } : { lat, lng };
    const entries = data.elements.map(el=>{
      const latc = el.lat ?? (el.center && el.center.lat);
      const lonc = el.lon ?? (el.center && el.center.lon);
      const name = (el.tags && (el.tags.name || el.tags['official_name'])) || 'Unnamed';
      const addr = assembleAddress(el.tags || {});
      const dist = haversine(userPoint.lat, userPoint.lng, latc, lonc);
      return { id: el.id, name, addr, lat: latc, lon: lonc, dist, tags: el.tags||{} };
    }).filter(e=>e.lat && e.lon);

    entries.sort((a,b)=>a.dist - b.dist);
    const limited = entries.slice(0,40);
    const listEl = document.getElementById('nearbyList');
    listEl.innerHTML = '';
    limited.forEach((p, idx)=>{
      const marker = L.marker([p.lat, p.lon]).addTo(resultsLayer);
      marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><div class="meta">${escapeHtml(p.addr)}</div><div class="meta">Distance: ${p.dist.toFixed(2)} km</div>`);
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<strong>${escapeHtml(p.name)}</strong>
        <div class="meta">${escapeHtml(p.addr)}</div>
        <div class="meta">Distance: ${p.dist.toFixed(2)} km</div>
        <div class="actions">
          <button class="action-btn" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.lat + ',' + p.lon)}','_blank')">Directions</button>
          <button class="action-btn" onclick="panToResult(${p.lat},${p.lon})">Show on map</button>
        </div>`;
      listEl.appendChild(item);
    });

    const group = L.featureGroup([...resultsLayer.getLayers(), userMarker].filter(Boolean));
    if(group.getLayers().length > 0) map.fitBounds(group.getBounds().pad(0.2));
  }catch(err){
    console.error(err);
    document.getElementById('nearbyList').innerHTML = `<div class="item">Search failed. Please try again later.</div>`;
  }
}

function panToResult(lat,lng){
  map.setView([lat,lng], 17);
}

/* -----------------------
   Helpers & initialization
   ----------------------- */
function assembleAddress(tags){
  const parts = [];
  ['addr:housenumber','addr:street','addr:suburb','addr:city','addr:state','addr:postcode','addr:country'].forEach(k=>{
    if(tags[k]) parts.push(tags[k]);
  });
  if(parts.length === 0){
    if(tags.village) parts.push(tags.village);
    if(tags.town) parts.push(tags.town);
    if(tags.city) parts.push(tags.city);
  }
  return parts.join(', ') || (tags.operator || '');
}

function haversine(lat1, lon1, lat2, lon2){
  const toRad = (v)=>v*Math.PI/180;
  const R = 6371;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(lat1))*Math.cos(toRad(lat2)) * Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

/* On load */
window.addEventListener('load', ()=>{
  document.querySelectorAll('[data-target]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const t = btn.dataset.target;
      if(t === 'nearby') initMapOnce();
    });
  });

  if(location.hash && location.hash.includes('nearby')) {
    showView('nearby');
    initMapOnce();
  }

  loadRecords();
});
