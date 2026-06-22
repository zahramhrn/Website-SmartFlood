/* =================================================================
   1. DATA — simulasi wilayah JABODETABEK
   ================================================================= */

const FLOOD_LEVELS = {
  normal:  { label:'Normal',  color:'#27ae60', fillOpacity:0.18 },
  waspada: { label:'Waspada', color:'#e0c200', fillOpacity:0.28 },
  siaga:   { label:'Siaga',   color:'#f39c12', fillOpacity:0.32 },
  awas:    { label:'Awas',    color:'#e74c3c', fillOpacity:0.40 },
};
// urutan bobot risiko untuk perhitungan rute
const RISK_WEIGHT = { normal:0, waspada:1, siaga:3, awas:6 };

const floodZones = [
  {
    name:'Kampung Melayu - Bukit Duri (Jakarta Timur)',
    level:'awas',
    affected:'±410 KK',
    note:'Genangan akibat luapan Sungai Ciliwung, ketinggian air 70–120 cm di sekitar Jl. Jatinegara Barat &amp; bantaran sungai.',
    coords:[[-6.2120,107.6285*0+106.8455],[-6.2120,106.8660],[-6.2310,106.8660],[-6.2310,106.8455]]
  },
  {
    name:'Cawang - Cipinang Melayu (Jakarta Timur)',
    level:'siaga',
    affected:'±240 KK',
    note:'Genangan 30–70 cm di sekitar Jl. MT Haryono &amp; Kalimalang, kendaraan roda dua disarankan mencari jalur alternatif.',
    coords:[[-6.2300,106.8600],[-6.2300,106.8830],[-6.2490,106.8830],[-6.2490,106.8600]]
  },
  {
    name:'Pluit - Penjaringan (Jakarta Utara)',
    level:'siaga',
    affected:'±280 KK',
    note:'Rob air laut menggenangi pesisir Pluit &amp; Penjaringan, genangan 30–70 cm terutama saat air laut pasang.',
    coords:[[-6.1080,106.7830],[-6.1080,106.8040],[-6.1300,106.8040],[-6.1300,106.7830]]
  },
  {
    name:'Tomang - Petamburan (Jakarta Barat)',
    level:'waspada',
    affected:'±90 KK',
    note:'Genangan ringan ≤30 cm di sekitar Kali Krukut, kendaraan roda empat masih dapat melintas dengan hati-hati.',
    coords:[[-6.1740,106.7960],[-6.1740,106.8140],[-6.1920,106.8140],[-6.1920,106.7960]]
  },
  {
    name:'Kelapa Gading (Jakarta Utara)',
    level:'waspada',
    affected:'±75 KK',
    note:'Genangan ringan di sekitar kawasan industri &amp; pemukiman dekat saluran Sunter.',
    coords:[[-6.1480,106.8980],[-6.1480,106.9220],[-6.1670,106.9220],[-6.1670,106.8980]]
  },
  {
    name:'Monas (Jakarta Pusat)',
    level:'normal',
    affected:'—',
    note:'Kondisi normal, tidak ada laporan genangan. Dapat digunakan sebagai jalur evakuasi alternatif menuju Jakarta Pusat.',
    coords:[[-6.1660,106.8180],[-6.1660,106.8360],[-6.1840,106.8360],[-6.1840,106.8180]]
  },
];

const floodPoints = [
  { name:'Jl. Jatinegara Barat, Kp. Melayu', depth:'100 cm', desc:'Arus kendaraan dialihkan, hanya kendaraan tinggi yang disarankan melintas.', lat:-6.2215, lng:106.8585 },
  { name:'Jl. MT Haryono, Cawang', depth:'55 cm', desc:'Genangan menutupi sebagian badan jalan di area underpass.', lat:-6.2434, lng:106.8650 },
  { name:'Jl. Pluit Raya, Penjaringan', depth:'70 cm', desc:'Genangan akibat rob air laut, terutama saat pasang maksimum.', lat:-6.1190, lng:106.7950 },
  { name:'Jl. Tubagus Angke, Tomang', depth:'60 cm', desc:'Genangan di titik rendah dekat aliran Kali Krukut.', lat:-6.1820, lng:106.8030 },
  { name:'Jl. Boulevard Raya, Kelapa Gading', depth:'40 cm', desc:'Genangan ringan setelah hujan deras di hulu saluran Sunter.', lat:-6.1580, lng:106.9100 },
];

// Sebaran data titik posko evakuasi se-Jabodetabek
// Sumber data konseptual: OpenStreetMap & Badan Penanggulangan Bencana Daerah (BPBD)
const poskoJabodetabek = [
  { wilayah:'Jakarta Pusat', nama:'Posko Istiqlal', lat:-6.1697, lng:106.8307, status:'Siaga Utama' },
  { wilayah:'Jakarta Timur', nama:'Posko Kampung Melayu', lat:-6.2239, lng:106.8624, status:'Siaga Utama' },
  { wilayah:'Jakarta Utara', nama:'Posko Penjaringan', lat:-6.1264, lng:106.7915, status:'Waspada' },
  { wilayah:'Kota Bogor', nama:'Posko Katulampa', lat:-6.6341, lng:106.8354, status:'Siaga Utama' },
  { wilayah:'Kab. Bogor', nama:'Posko Cibinong', lat:-6.4820, lng:106.8530, status:'Waspada' },
  { wilayah:'Kota Depok', nama:'Posko Margonda', lat:-6.3916, lng:106.8317, status:'Waspada' },
  { wilayah:'Kota Tangerang', nama:'Posko Ciledug', lat:-6.2285, lng:106.7089, status:'Siaga Utama' },
  { wilayah:'Tangerang Selatan', nama:'Posko Ciputat', lat:-6.3129, lng:106.7456, status:'Waspada' },
  { wilayah:'Kota Bekasi', nama:'Posko Jatiasih', lat:-6.2941, lng:106.9659, status:'Siaga Utama' },
  { wilayah:'Kab. Bekasi', nama:'Posko Cikarang', lat:-6.3031, lng:107.1687, status:'Waspada' },
];

const POSKO_STATUS = {
  'Siaga Utama': { color:'#e74c3c' },
  'Waspada':     { color:'#e0c200' },
};

// Lokasi untuk perencanaan rute (mengikuti titik posko se-Jabodetabek)
const LOCATIONS = [
  { name:'Monas, Jakarta Pusat', lat:-6.1754, lng:106.8272 },
  { name:'Kampung Melayu, Jakarta Timur', lat:-6.2239, lng:106.8624 },
  { name:'Penjaringan, Jakarta Utara', lat:-6.1264, lng:106.7915 },
  { name:'Kota Bogor (Katulampa)', lat:-6.6341, lng:106.8354 },
  { name:'Kab. Bogor (Cibinong)', lat:-6.4820, lng:106.8530 },
  { name:'Kota Depok (Margonda)', lat:-6.3916, lng:106.8317 },
  { name:'Kota Tangerang (Ciledug)', lat:-6.2285, lng:106.7089 },
  { name:'Tangerang Selatan (Ciputat)', lat:-6.3129, lng:106.7456 },
  { name:'Kota Bekasi (Jatiasih)', lat:-6.2941, lng:106.9659 },
  { name:'Kab. Bekasi (Cikarang)', lat:-6.3031, lng:107.1687 },
];

/* =================================================================
   2. INISIALISASI PETA — fokus wilayah Jabodetabek
   ================================================================= */
const map = L.map('map', { zoomControl:true }).setView([-6.33, 106.92], 10);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution:'',
  maxZoom:19
}).addTo(map);

// --- Layer: zona banjir ---
const zoneLayer = L.layerGroup().addTo(map);
floodZones.forEach(z => {
  const cfg = FLOOD_LEVELS[z.level];
  const poly = L.polygon(z.coords, {
    color: cfg.color,
    weight: 2,
    fillColor: cfg.color,
    fillOpacity: cfg.fillOpacity,
    className: z.level === 'awas' ? 'zone-awas' : ''
  });
  poly.bindPopup(`
    <span class="tag" style="background:${cfg.color}22;color:${cfg.color};border:1px solid ${cfg.color}">${cfg.label.toUpperCase()}</span>
    <h3>${z.name}</h3>
    <div>${z.note}</div>
    <div style="margin-top:6px;color:var(--text-500)">Estimasi terdampak: <b>${z.affected}</b></div>
  `);
  poly.addTo(zoneLayer);
});

// --- Helper pembuat ikon marker ---
function divIcon(cls, emoji){
  return L.divIcon({ className:'', html:`<div class="pin ${cls}">${emoji}</div>`, iconSize:[30,30], iconAnchor:[15,28] });
}
function shelterIcon(status){
  const cfg = POSKO_STATUS[status];
  return L.divIcon({ className:'', html:`<div class="pin" style="background:${cfg.color}">🛟</div>`, iconSize:[30,30], iconAnchor:[15,28] });
}

// --- Layer: posko pengungsian se-Jabodetabek ---
const shelterLayer = L.layerGroup().addTo(map);
poskoJabodetabek.forEach(p => {
  const cfg = POSKO_STATUS[p.status];
  L.marker([p.lat, p.lng], { icon: shelterIcon(p.status) })
    .bindPopup(`
      <span class="tag" style="background:${cfg.color}22;color:${cfg.color};border:1px solid ${cfg.color}">POSKO — ${p.status.toUpperCase()}</span>
      <h3>${p.nama}</h3>
      <div>Wilayah: <b>${p.wilayah}</b></div>
    `)
    .addTo(shelterLayer);
});

// --- Layer: titik genangan ---
const floodPointLayer = L.layerGroup().addTo(map);
floodPoints.forEach(f => {
  L.marker([f.lat, f.lng], { icon: divIcon('pin-flood','⚠') })
    .bindPopup(`
      <span class="tag" style="background:#e74c3c22;color:var(--flood-critical);border:1px solid var(--flood-critical)">TITIK GENANGAN</span>
      <h3>${f.name}</h3>
      <div>${f.desc}</div>
      <div style="margin-top:6px;color:var(--text-500)">Ketinggian air: <b>${f.depth}</b></div>
    `)
    .addTo(floodPointLayer);
});

// toggle layer
document.getElementById('toggleZones').addEventListener('change', e=>{
  e.target.checked ? map.addLayer(zoneLayer) : map.removeLayer(zoneLayer);
});
document.getElementById('toggleShelters').addEventListener('change', e=>{
  e.target.checked ? map.addLayer(shelterLayer) : map.removeLayer(shelterLayer);
});
document.getElementById('toggleFloodPoints').addEventListener('change', e=>{
  e.target.checked ? map.addLayer(floodPointLayer) : map.removeLayer(floodPointLayer);
});

/* =================================================================
   3. PERENCANA RUTE & OPTIMASI MENGHINDARI ZONA BANJIR
   ================================================================= */
const fromSelect = document.getElementById('fromSelect');
const toSelect = document.getElementById('toSelect');
LOCATIONS.forEach((loc,i)=>{
  const o1 = new Option(loc.name, i);
  const o2 = new Option(loc.name, i);
  fromSelect.add(o1);
  toSelect.add(o2);
});
fromSelect.value = 0; // Monas, Jakarta Pusat
toSelect.value = 1;   // Kampung Melayu, Jakarta Timur

document.getElementById('swapBtn').addEventListener('click', ()=>{
  const a = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = a;
});

document.getElementById('useMyLocation').addEventListener('click', ()=>{
  if(!navigator.geolocation){ alert('Geolocation tidak didukung pada perangkat ini.'); return; }
  navigator.geolocation.getCurrentPosition(pos=>{
    const custom = { name:'Lokasi Saya', lat:pos.coords.latitude, lng:pos.coords.longitude };
    if (LOCATIONS[0].name !== 'Lokasi Saya') LOCATIONS.unshift(custom);
    else LOCATIONS[0] = custom;
    fromSelect.options[0] ? (fromSelect.options[0] = new Option('📍 Lokasi Saya', 0)) : fromSelect.add(new Option('📍 Lokasi Saya',0),0);
    Array.from(fromSelect.options).forEach((opt,i)=> opt.value=i);
    Array.from(toSelect.options).forEach((opt,i)=> opt.value=i);
    if (LOCATIONS.length > toSelect.options.length) toSelect.add(new Option('📍 Lokasi Saya',0),0);
    fromSelect.value = 0;
  }, ()=> alert('Tidak dapat mengambil lokasi Anda. Pastikan izin lokasi diaktifkan.'));
});

let routingControl = null;
let startMarker = null, endMarker = null;

// algoritma point-in-polygon (ray casting)
function pointInPolygon(point, vs){
  const x = point[1], y = point[0];
  let inside = false;
  for (let i=0, j=vs.length-1; i<vs.length; j=i++){
    const xi = vs[i][1], yi = vs[i][0];
    const xj = vs[j][1], yj = vs[j][0];
    const intersect = ((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// hitung skor risiko sebuah rute berdasarkan sampling titik koordinatnya
function assessRoute(coordsLatLng){
  let totalSamples = 0, riskScore = 0;
  let worstLevel = 'normal';
  let touchedZones = new Set();
  const step = Math.max(1, Math.floor(coordsLatLng.length/60)); // ~60 sampel
  for (let i=0;i<coordsLatLng.length;i+=step){
    const p = [coordsLatLng[i].lat, coordsLatLng[i].lng];
    totalSamples++;
    for (const z of floodZones){
      if (z.level==='normal') continue;
      if (pointInPolygon(p, z.coords)){
        riskScore += RISK_WEIGHT[z.level];
        touchedZones.add(z.name+'|'+z.level);
        if (RISK_WEIGHT[z.level] > RISK_WEIGHT[worstLevel]) worstLevel = z.level;
      }
    }
  }
  return { riskScore: riskScore/Math.max(1,totalSamples), worstLevel, touchedZones:[...touchedZones] };
}

function clearRoute(){
  if (routingControl){ map.removeControl(routingControl); routingControl=null; }
  if (startMarker){ map.removeLayer(startMarker); startMarker=null; }
  if (endMarker){ map.removeLayer(endMarker); endMarker=null; }
  document.getElementById('routeResult').classList.remove('show');
}

document.getElementById('findRouteBtn').addEventListener('click', ()=>{
  const from = LOCATIONS[fromSelect.value];
  const to = LOCATIONS[toSelect.value];
  if (!from || !to) return;
  if (from.lat===to.lat && from.lng===to.lng){
    alert('Titik awal dan tujuan tidak boleh sama.');
    return;
  }

  clearRoute();

  startMarker = L.marker([from.lat, from.lng], { icon: divIcon('pin-start','A') }).addTo(map).bindPopup(`<h3>A — ${from.name}</h3>Titik awal`);
  endMarker = L.marker([to.lat, to.lng], { icon: divIcon('pin-end','B') }).addTo(map).bindPopup(`<h3>B — ${to.name}</h3>Tujuan`);

  const btn = document.getElementById('findRouteBtn');
  btn.textContent = 'Menghitung rute…';
  btn.disabled = true;

  routingControl = L.Routing.control({
    waypoints:[ L.latLng(from.lat,from.lng), L.latLng(to.lat,to.lng) ],
    router: L.Routing.osrmv1({
      serviceUrl:'https://router.project-osrm.org/route/v1',
      profile:'driving',
      urlParameters:{ alternatives:'true', overview:'full' }
    }),
    routeWhileDragging:false,
    addWaypoints:false,
    show:false,
    fitSelectedRoutes:true,
    createMarker:()=>null,
    lineOptions:{ styles:[] } // kita gambar sendiri agar bisa diberi warna sesuai risiko
  }).addTo(map);

  let drawnLines = [];

  routingControl.on('routesfound', e=>{
    btn.textContent = 'Cari Rute Teroptimasi';
    btn.disabled = false;

    drawnLines.forEach(l=>map.removeLayer(l));
    drawnLines = [];

    const routes = e.routes.map(r=>{
      const assessment = assessRoute(r.coordinates);
      return { route:r, assessment };
    });

    // urutkan: risiko terkecil dulu, lalu durasi tercepat
    routes.sort((a,b)=> a.assessment.riskScore - b.assessment.riskScore || a.route.summary.totalTime - b.route.summary.totalTime);

    routes.forEach((item, idx)=>{
      const best = idx===0;
      const color = item.assessment.worstLevel==='normal' ? '#27ae60'
                   : item.assessment.worstLevel==='waspada' ? '#e0c200'
                   : item.assessment.worstLevel==='siaga' ? '#f39c12' : '#e74c3c';
      const line = L.polyline(item.route.coordinates, {
        color: best ? '#2d9cdb' : color,
        weight: best ? 6 : 3,
        opacity: best ? 0.95 : 0.45,
        dashArray: best ? null : '6,8'
      }).addTo(map);
      if (best){
        line.bringToFront();
        showRouteResult(item.route, item.assessment, routes.length);
      }
      drawnLines.push(line);
    });
  });

  routingControl.on('routingerror', ()=>{
    btn.textContent = 'Cari Rute Teroptimasi';
    btn.disabled = false;
    alert('Gagal menghitung rute. Periksa koneksi internet Anda lalu coba lagi.');
  });
});

function showRouteResult(route, assessment, altCount){
  const km = (route.summary.totalDistance/1000).toFixed(1);
  const mins = Math.round(route.summary.totalTime/60);

  const badge = document.getElementById('rrBadge');
  const note = document.getElementById('rrNote');

  if (assessment.worstLevel==='normal'){
    badge.className = 'rr-badge aman';
    badge.textContent = '✓ Rute Aman';
    note.innerHTML = `Rute terpilih <b>tidak melintasi zona terdampak banjir</b>. ${altCount>1 ? `Dipilih dari ${altCount} alternatif rute berdasarkan tingkat risiko terendah.` : ''}`;
  } else if (assessment.worstLevel==='waspada'){
    badge.className = 'rr-badge waspada';
    badge.textContent = '⚠ Waspada';
    note.innerHTML = `Rute melintasi zona <b>Waspada</b> (${assessment.touchedZones.map(t=>t.split('|')[0]).join(', ')}). Genangan ringan, kendaraan roda empat umumnya masih dapat melintas — tetap berhati-hati.`;
  } else {
    badge.className = 'rr-badge bahaya';
    badge.textContent = '✕ Berisiko Tinggi';
    note.innerHTML = `Rute melintasi zona <b>${FLOOD_LEVELS[assessment.worstLevel].label}</b> (${assessment.touchedZones.map(t=>t.split('|')[0]).join(', ')}). ${altCount>1 ? 'Ini adalah rute dengan risiko paling rendah dari alternatif yang tersedia, namun tetap berisiko.' : 'Disarankan menunda perjalanan atau menghubungi petugas untuk jalur evakuasi alternatif.'}`;
  }

  document.getElementById('rrDistance').textContent = km + ' km';
  document.getElementById('rrTime').textContent = '≈ ' + mins + ' menit';
  document.getElementById('routeResult').classList.add('show');
}

/* =================================================================
   4. JAM REAL-TIME (WIB)
   ================================================================= */
function updateClock(){
  const now = new Date();
  const opts = { timeZone:'Asia/Jakarta', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false };
  const dOpts = { timeZone:'Asia/Jakarta', weekday:'long', day:'numeric', month:'long', year:'numeric' };
  document.getElementById('clockTime').textContent = now.toLocaleTimeString('id-ID', opts) + ' WIB';
  document.getElementById('clockDate').textContent = now.toLocaleDateString('id-ID', dOpts);
}
updateClock();
setInterval(updateClock, 1000);

/* =================================================================
   5. MOBILE SIDEBAR TOGGLE
   ================================================================= */
const sidebar = document.getElementById('sidebar');
document.getElementById('menuToggle').addEventListener('click', ()=>{
  sidebar.classList.toggle('open');
});
map.on('click', ()=> sidebar.classList.remove('open'));
