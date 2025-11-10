const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const status = document.getElementById('status');

async function fetchGames(query = '', page_size = 12) {
  status.textContent = 'Загрузка...';
  try {
    const res = await fetch(`/api/games?q=${encodeURIComponent(query)}&page_size=${page_size}`);
    if (!res.ok) throw new Error('Ошибка сервера');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    status.textContent = 'Ошибка при загрузке данных: ' + err.message;
    return null;
  }
}

function renderGames(data) {
  results.innerHTML = '';
  status.textContent = '';
  if (!data || !data.results || data.results.length === 0) {
    status.textContent = 'Ничего не найдено.';
    return;
  }
  data.results.forEach(game => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.alt = game.name;
    img.src = game.background_image || '';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = game.name;

    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = [
      game.released ? `Релиз: ${game.released}` : null,
      game.rating ? `Рейтинг: ${game.rating}` : null
    ].filter(Boolean).join(' • ');

    const more = document.createElement('p');
    more.className = 'sub';
    more.style.marginTop = '8px';
    more.textContent = game.short_screenshots ? '' : (game.slug ? `ID: ${game.slug}` : '');

    meta.appendChild(title);
    meta.appendChild(sub);
    meta.appendChild(more);

    card.appendChild(img);
    card.appendChild(meta);
    results.appendChild(card);
  });
}

async function doSearch() {
  const q = searchInput.value.trim();
  const data = await fetchGames(q, 12);
  if (data) renderGames(data);
}

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

// Начальный запрос — популярные игры
doSearch();
