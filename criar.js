/* =========================================================
   Vakinha.vk — criação de campanhas
   Sem backend: as imagens são lidas como data URL no navegador
   e a campanha é salva em localStorage (visível só neste
   navegador). Para produção, troque saveCustomCampaign() por
   uma chamada real de upload/API.
========================================================= */

const MAX_IMAGES = 6;
let uploadedImages = []; // [{dataUrl, name}]

const dropzone = document.getElementById('dropzone');
const imageInput = document.getElementById('imageInput');
const imageGrid = document.getElementById('imageGrid');

dropzone.addEventListener('click', () => imageInput.click());
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag');
  handleFiles(e.dataTransfer.files);
});
imageInput.addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(fileList){
  const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
  const remaining = MAX_IMAGES - uploadedImages.length;
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages.push({dataUrl: e.target.result, name: file.name});
      renderImageGrid();
      updatePreview();
    };
    reader.readAsDataURL(file);
  });
  imageInput.value = '';
}

function renderImageGrid(){
  imageGrid.innerHTML = uploadedImages.map((img, i) => `
    <div class="image-thumb ${i === 0 ? 'is-cover' : ''}" data-idx="${i}">
      <img src="${img.dataUrl}" alt="Prévia da imagem ${i + 1}">
      ${i === 0 ? '<span class="cover-tag">Capa</span>' : ''}
      <div class="thumb-actions">
        ${i !== 0 ? `<button type="button" data-make-cover="${i}" title="Definir como capa">★</button>` : ''}
        <button type="button" data-remove="${i}" title="Remover">✕</button>
      </div>
    </div>
  `).join('');

  imageGrid.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      uploadedImages.splice(Number(btn.dataset.remove), 1);
      renderImageGrid();
      updatePreview();
    });
  });
  imageGrid.querySelectorAll('[data-make-cover]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.makeCover);
      const [chosen] = uploadedImages.splice(idx, 1);
      uploadedImages.unshift(chosen);
      renderImageGrid();
      updatePreview();
    });
  });
}

/* live preview, reaproveitando os estilos do card de campanha */
const fields = ['titulo', 'categoria', 'organizador', 'descricao', 'meta', 'prazo'];
fields.forEach(id => {
  document.getElementById(id).addEventListener('input', updatePreview);
});
document.getElementById('categoria').addEventListener('change', updatePreview);

document.getElementById('descricao').addEventListener('input', () => {
  document.getElementById('descCount').textContent = document.getElementById('descricao').value.length;
});

const categoriaLabels = {
  saude: 'Saúde', educacao: 'Educação', moradia: 'Moradia',
  emergencia: 'Emergência', negocios: 'Negócios', viagem: 'Viagem', outro: 'Outro'
};

function buildPreviewData(){
  const titulo = document.getElementById('titulo').value.trim() || 'Título da sua campanha';
  const organizador = document.getElementById('organizador').value.trim() || 'Seu nome';
  const categoria = document.getElementById('categoria').value;
  const descricao = document.getElementById('descricao').value.trim() || 'A descrição da sua campanha aparecerá aqui.';
  const meta = parseFloat(document.getElementById('meta').value) || 0;
  const prazo = parseInt(document.getElementById('prazo').value) || 0;

  return {
    id: 'preview',
    titulo, organizador,
    categoria: categoria || 'outro',
    categoriaLabel: categoriaLabels[categoria] || 'Categoria',
    descricao,
    imagem: uploadedImages[0]?.dataUrl || 'https://picsum.photos/seed/vakinha-placeholder/600/450',
    meta: meta > 0 ? meta : 1,
    arrecadado: 0,
    apoiadores: 0,
    diasRestantes: prazo > 0 ? prazo : 30,
    criadoEm: new Date().toISOString()
  };
}

function updatePreview(){
  const previewCard = document.getElementById('previewCard');
  previewCard.innerHTML = campaignCardHtml(buildPreviewData());
}

/* validação e envio */
function setError(id, msg){
  document.getElementById('err-' + id).textContent = msg || '';
}

function validate(){
  let ok = true;

  const titulo = document.getElementById('titulo').value.trim();
  if(titulo.length < 5){ setError('titulo', 'Escreva um título com pelo menos 5 caracteres.'); ok = false; }
  else setError('titulo', '');

  const categoria = document.getElementById('categoria').value;
  if(!categoria){ setError('categoria', 'Selecione uma categoria.'); ok = false; }
  else setError('categoria', '');

  const organizador = document.getElementById('organizador').value.trim();
  if(organizador.length < 3){ setError('organizador', 'Informe seu nome.'); ok = false; }
  else setError('organizador', '');

  const descricao = document.getElementById('descricao').value.trim();
  if(descricao.length < 30){ setError('descricao', 'Conte um pouco mais (mínimo 30 caracteres).'); ok = false; }
  else setError('descricao', '');

  const meta = parseFloat(document.getElementById('meta').value);
  if(!meta || meta <= 0){ setError('meta', 'Informe uma meta válida.'); ok = false; }
  else setError('meta', '');

  const prazo = parseInt(document.getElementById('prazo').value);
  if(!prazo || prazo < 1 || prazo > 120){ setError('prazo', 'Escolha um prazo entre 1 e 120 dias.'); ok = false; }
  else setError('prazo', '');

  if(uploadedImages.length === 0){ setError('imagens', 'Adicione ao menos uma foto para a campanha.'); ok = false; }
  else setError('imagens', '');

  return ok;
}

document.getElementById('campaignForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if(!validate()) return;

  const campaign = buildPreviewData();
  campaign.id = 'custom-' + Date.now();
  campaign.imagem = uploadedImages[0].dataUrl;
  campaign.imagens = uploadedImages.map(i => i.dataUrl);

  saveCustomCampaign(campaign);

  const confirmEl = document.getElementById('submitConfirm');
  confirmEl.innerHTML = `
    <div class="confirm-box">
      <span class="ic">✅</span>
      <span>Campanha publicada! <a href="campanhas.html">Ver todas as campanhas</a></span>
    </div>
  `;

  document.getElementById('campaignForm').reset();
  uploadedImages = [];
  renderImageGrid();
  document.getElementById('descCount').textContent = '0';
  updatePreview();
  window.scrollTo({top: 0, behavior: 'smooth'});
});

updatePreview();
