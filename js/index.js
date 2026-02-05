const searchInput = document.querySelector('#search-input');
const searchForm = document.querySelector('#search-form');
const stationsRow = document.querySelector('#stations-row');
const statusMsg = document.querySelector('#status-msg');
const legend = document.querySelector('#legend');

let stations = [];

const getColorFor = (info) => {
  const ratio = info.available_rent_bikes / info.Quantity;
  if (ratio === 0) return 'grey';
  if (ratio <= 0.3) return '#F5303E';
  if (ratio <= 0.7) return '#FF9D19';
  return '#B9BF0D';
};

const createLegend = () => {
  legend.innerHTML = `
    <div class="d-flex align-items-center gap-2"><span style="width:18px;height:12px;background:#B9BF0D;display:inline-block"></span> 充足</div>
    <div class="d-flex align-items-center gap-2"><span style="width:18px;height:12px;background:#FF9D19;display:inline-block"></span> 中等</div>
    <div class="d-flex align-items-center gap-2"><span style="width:18px;height:12px;background:#F5303E;display:inline-block"></span> 稀少</div>
    <div class="d-flex align-items-center gap-2"><span style="width:18px;height:12px;background:grey;display:inline-block"></span> 無車</div>
  `;
};

const renderStations = (list) => {
  stationsRow.innerHTML = '';
  if (!list || list.length === 0) {
    stationsRow.innerHTML = '<div class="col-12 text-center text-muted">找不到站點</div>';
    return;
  }
  const frag = document.createDocumentFragment();
  for (const info of list) {
    const color = getColorFor(info);
    const stat = info.sna.split('_').at(-1);
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 d-flex';
    col.innerHTML = `
      <div class="card w-100" style="border: 4px solid ${color}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-center fw-bold mb-2">${stat}</h5>
          <ul class="mt-auto list-unstyled small">
            <li>剩餘: <strong>${info.available_rent_bikes}</strong> 台</li>
            <li>區域: ${info.sarea}</li>
            <li>距離: N/A</li>
            <li class="text-muted">座標: ${info.latitude}, ${info.longitude}</li>
          </ul>
        </div>
      </div>
    `;
    frag.appendChild(col);
  }
  stationsRow.appendChild(frag);
};

const setStatus = (text) => {
  statusMsg.textContent = text || '';
};

const fetchData = async () => {
  setStatus('載入中...');
  try {
    const { data } = await axios.get('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
    stations = data;
    renderStations(stations);
    setStatus(`資料筆數：${stations.length}`);
  } catch (err) {
    console.error(err);
    setStatus('無法取得資料');
    stationsRow.innerHTML = '<div class="col-12 text-center text-danger">取得資料失敗，請稍後再試</div>';
  }
};

function debounce(fn, wait = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const applySearch = (q) => {
  if (!q) {
    renderStations(stations);
    return;
  }
  const ql = q.toLowerCase();
  const filtered = stations.filter((s) => {
    const stat = (s.sna || '').toLowerCase();
    const area = (s.sarea || '').toLowerCase();
    return stat.includes(ql) || area.includes(ql);
  });
  renderStations(filtered);
  setStatus(`顯示 ${filtered.length} / ${stations.length}`);
};

searchInput.addEventListener(
  'input',
  debounce((e) => applySearch(e.target.value), 300),
);

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

createLegend();
fetchData();

// 定期更新資料（例如每 30 秒），可視情況關閉
// setInterval(fetchData, 30000);
