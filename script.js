/* =========================================================
   Vakinha.vk — dados e renderização das campanhas
   Troque as imagens de "imagem" pela URL real da foto da
   campanha (upload do usuário, CDN, etc.) quando integrar
   com um backend de verdade.
========================================================= */

const campaigns = [
  {
    id: 1,
    titulo: "Cirurgia urgente da Dona Aparecida",
    organizador: "Família Aparecida",
    categoria: "saude",
    categoriaLabel: "Saúde",
    descricao: "Ajude a cobrir os custos da cirurgia cardíaca da Dona Aparecida, marcada para o próximo mês.",
    imagem: "https://picsum.photos/seed/vakinha-saude1/600/450",
    meta: 25000,
    arrecadado: 18750,
    apoiadores: 312,
    diasRestantes: 12,
    criadoEm: "2026-07-10"
  },
  {
    id: 2,
    titulo: "Reforma da escola comunitária",
    organizador: "Associação Vila Nova",
    categoria: "educacao",
    categoriaLabel: "Educação",
    descricao: "Vamos reformar o telhado e as salas de aula da escola que atende mais de 200 crianças da comunidade.",
    imagem: "https://picsum.photos/seed/vakinha-edu1/600/450",
    meta: 40000,
    arrecadado: 12400,
    apoiadores: 156,
    diasRestantes: 28,
    criadoEm: "2026-07-05"
  },
  {
    id: 3,
    titulo: "Reconstrução após a enchente",
    organizador: "Marcos Vinícius",
    categoria: "emergencia",
    categoriaLabel: "Emergência",
    descricao: "Nossa casa foi destruída pela enchente do mês passado. Precisamos reconstruir para minha família ter onde morar.",
    imagem: "https://picsum.photos/seed/vakinha-emerg1/600/450",
    meta: 18000,
    arrecadado: 16920,
    apoiadores: 428,
    diasRestantes: 5,
    criadoEm: "2026-07-18"
  },
  {
    id: 4,
    titulo: "Aluguel social para a família Souza",
    organizador: "Juliana Souza",
    categoria: "moradia",
    categoriaLabel: "Moradia",
    descricao: "Após perder o emprego, preciso de ajuda para pagar o aluguel dos próximos três meses até me reestabilizar.",
    imagem: "https://picsum.photos/seed/vakinha-moradia1/600/450",
    meta: 9000,
    arrecadado: 3150,
    apoiadores: 74,
    diasRestantes: 20,
    criadoEm: "2026-07-15"
  },
  {
    id: 5,
    titulo: "Padaria da Dona Rita — segunda chance",
    organizador: "Rita Ferreira",
    categoria: "negocios",
    categoriaLabel: "Negócios",
    descricao: "Depois de um incêndio no forno, preciso de equipamento novo para reabrir a padaria e voltar a sustentar minha família.",
    imagem: "https://picsum.photos/seed/vakinha-negocio1/600/450",
    meta: 15000,
    arrecadado: 15000,
    apoiadores: 203,
    diasRestantes: 0,
    criadoEm: "2026-06-28"
  },
  {
    id: 6,
    titulo: "Intercâmbio acadêmico do João",
    organizador: "João Pedro",
    categoria: "viagem",
    categoriaLabel: "Viagem",
    descricao: "Fui selecionado para um intercâmbio de pesquisa, mas preciso de ajuda para cobrir passagem e primeiros meses de estadia.",
    imagem: "https://picsum.photos/seed/vakinha-viagem1/600/450",
    meta: 12000,
    arrecadado: 4680,
    apoiadores: 61,
    diasRestantes: 34,
    criadoEm: "2026-07-01"
  },
  {
    id: 7,
    titulo: "Tratamento veterinário do Bidu",
    organizador: "Camila Torres",
    categoria: "outro",
    categoriaLabel: "Outro",
    descricao: "Meu cachorro Bidu precisa de uma cirurgia ortopédica urgente. Qualquer ajuda é bem-vinda.",
    imagem: "https://picsum.photos/seed/vakinha-outro1/600/450",
    meta: 6000,
    arrecadado: 5340,
    apoiadores: 189,
    diasRestantes: 8,
    criadoEm: "2026-07-20"
  },
  {
    id: 8,
    titulo: "Material escolar para a Creche Girassol",
    organizador: "Creche Girassol",
    categoria: "educacao",
    categoriaLabel: "Educação",
    descricao: "Precisamos renovar o material pedagógico e os brinquedos educativos para o próximo semestre letivo.",
    imagem: "https://picsum.photos/seed/vakinha-edu2/600/450",
    meta: 8000,
    arrecadado: 2100,
    apoiadores: 47,
    diasRestantes: 40,
    criadoEm: "2026-07-08"
  }
];

function esc(val){
  if(val === undefined || val === null) return '';
  return String(val).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

const CUSTOM_KEY = 'vakinha-custom-campaigns';

function loadCustomCampaigns(){
  try{
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function saveCustomCampaign(campaign){
  const list = loadCustomCampaigns();
  list.unshift(campaign);
  try{
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  }catch(e){
    console.error('Não foi possível salvar a campanha (armazenamento cheio ou indisponível).', e);
  }
}

function getAllCampaigns(){
  return loadCustomCampaigns().concat(campaigns);
}

function fmtMoney(n){
  return n.toLocaleString('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0});
}

function progressCircleSvg(pct){
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(pct, 100) / 100) * c;
  return `
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="${r}" fill="none" stroke="#F2F0E7" stroke-width="4"/>
      <circle cx="26" cy="26" r="${r}" fill="none" stroke="#1C8A6E" stroke-width="4"
        stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
    </svg>
  `;
}

function campaignCardHtml(c){
  const pct = Math.min(100, Math.round((c.arrecadado / c.meta) * 100));
  const diasLabel = c.diasRestantes === 0 ? 'Encerrada' : `${c.diasRestantes} dia${c.diasRestantes === 1 ? '' : 's'} restantes`;

  return `
    <article class="campaign-card" data-id="${c.id}" data-categoria="${esc(c.categoria)}">
      <div class="campaign-media">
        <img src="${esc(c.imagem)}" alt="${esc(c.titulo)}" loading="lazy">
        <span class="campaign-category">${esc(c.categoriaLabel)}</span>
        <button class="campaign-fav" aria-label="Favoritar campanha" data-fav="${c.id}">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.5 6 4c2.2-0.3 4 1 6 3.2C14 5 15.8 3.7 18 4c4 0.5 5.7 4.4 4 7.9C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <div class="campaign-badge">
          ${progressCircleSvg(pct)}
          <span class="pct">${pct}%</span>
        </div>
        <div class="campaign-media-title">${esc(c.titulo)}</div>
      </div>
      <div class="campaign-body">
        <div class="campaign-organizer">por <strong>${esc(c.organizador)}</strong></div>
        <div class="campaign-desc">${esc(c.descricao)}</div>
        <div class="jar-progress">
          <div class="jar-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="campaign-stats">
          <span class="raised">${fmtMoney(c.arrecadado)}</span>
          <span class="goal">de ${fmtMoney(c.meta)}</span>
        </div>
        <div class="campaign-meta">
          <span><strong>${c.apoiadores}</strong> apoiadores</span>
          <span>${diasLabel}</span>
        </div>
        <button class="btn-contribuir" data-contribuir="${c.id}">Contribuir</button>
      </div>
    </article>
  `;
}

function renderCampaigns(list){
  const grid = document.getElementById('allCampaigns');
  if(!grid) return;

  if(list.length === 0){
    grid.innerHTML = `
      <div class="empty-state">
        <div class="big">Nenhuma campanha encontrada</div>
        <div>Tente ajustar a busca ou os filtros.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(campaignCardHtml).join('');

  grid.querySelectorAll('[data-fav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
    });
  });
}

function loadAllCampaigns(){
  renderCampaigns(getAllCampaigns());
}

function filterCampaigns(){
  const query = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const categoria = document.getElementById('categoryFilter')?.value || '';
  const ordenar = document.getElementById('sortFilter')?.value || 'recentes';

  let filtered = getAllCampaigns().filter(c => {
    const matchesQuery = !query ||
      c.titulo.toLowerCase().includes(query) ||
      c.organizador.toLowerCase().includes(query) ||
      c.descricao.toLowerCase().includes(query);
    const matchesCategoria = !categoria || c.categoria === categoria;
    return matchesQuery && matchesCategoria;
  });

  if(ordenar === 'recentes'){
    filtered = filtered.slice().sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  } else if(ordenar === 'populares'){
    filtered = filtered.slice().sort((a, b) => b.apoiadores - a.apoiadores);
  } else if(ordenar === 'proximas'){
    filtered = filtered.slice().sort((a, b) => (b.arrecadado / b.meta) - (a.arrecadado / a.meta));
  }

  renderCampaigns(filtered);
}
