import * as THREE from "three";
import { STLLoader } from "./vendor/three/loaders/STLLoader.js";
import { OrbitControls } from "./vendor/three/controls/OrbitControls.js";

const M = "modelos";
const IMG = {
  sc8: `${M}/referencia/sc8uu/SC8UU.png`,
  shf: `${M}/referencia/shf08/SHF08.png`,
  p1: `${M}/sc8uu-passo-a-passo/01_bloco.png`,
  p2: `${M}/sc8uu-passo-a-passo/02_chanfros.png`,
  p3: `${M}/sc8uu-passo-a-passo/03_furo_eixo.png`,
  p4: `${M}/sc8uu-passo-a-passo/04_furos_m4.png`,
  p5: `${M}/sc8uu-passo-a-passo/05_rebaixo_boca.png`,
  p6: `${M}/sc8uu-passo-a-passo/06_sc8uu_completo.png`,
};
const STL = {
  p1: `${M}/sc8uu-passo-a-passo/01_bloco.stl`,
  p2: `${M}/sc8uu-passo-a-passo/02_chanfros.stl`,
  p3: `${M}/sc8uu-passo-a-passo/03_furo_eixo.stl`,
  p4: `${M}/sc8uu-passo-a-passo/04_furos_m4.stl`,
  p5: `${M}/sc8uu-passo-a-passo/05_rebaixo_boca.stl`,
  p6: `${M}/sc8uu-passo-a-passo/06_sc8uu_completo.stl`,
  sc8: `${M}/referencia/sc8uu/SC8UU.stl`,
};
const STEP = {
  sc8: `${M}/referencia/sc8uu/SC8UU.step`,
  p6: `${M}/sc8uu-passo-a-passo/06_sc8uu_completo.step`,
};
const FC = {
  sc8: `${M}/referencia/sc8uu/SC8UU.FCStd`,
};

const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const viewers = [];

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  }[c]));
}

function cadStage(img, stl, caption) {
  const safe = esc(caption);
  return `<div class="cad-stage">
    <img class="cad-iso" src="${img}" alt="${safe}" />
    <div class="view3d" data-stl="${stl}" role="img" aria-label="${safe}"></div>
    <p class="cad-hint">${safe} · arraste para orbitar · scroll ou pinça para zoom</p>
  </div>`;
}

function srcPills(list) {
  if (!list?.length) return "";
  return `<div class="msg-srcs"><span class="msg-srcs-lbl">Fontes:</span>${list.map((s) => `<span class="sprc">${esc(s)}</span>`).join("")}</div>`;
}

const AGENTS = {
  reuso: {
    name: "Busca Inteligente de Projetos",
    emoji: "📁",
    bg: "rgba(59,130,246,.1)",
    status: "Disponível · Biblioteca CAD + PLM",
    desc: "Consulte projetos existentes e encontre referências para novos desenvolvimentos.",
    srcs: [
      { l: "📚 Biblioteca CAD", i: "Peças documentadas · biblioteca pública + laboratório interno" },
      { l: "🗂 PLM", i: "ENOVIA / pasta de eixos lineares (simulado)" },
    ],
    welcome: `<p><strong>Olá! 👋 Sou o Copiloto de Reuso CAD.</strong></p>
      <p>Encontro projetos, componentes e soluções já existentes na base de Engenharia para você evitar começar do zero.</p>
      <p>Descreva o que precisa — peça, aplicação, dimensões ou contexto — e eu te ajudo a encontrar as melhores referências.</p>`,
  },
  cad: {
    name: "Copiloto de Modelagem CAD",
    emoji: "🧱",
    bg: "rgba(124,58,237,.1)",
    status: "Disponível · Construção guiada",
    desc: "Construa componentes CAD passo a passo, validando cada etapa antes de avançar.",
    srcs: [
      { l: "⚙ Kernel CAD", i: "FreeCAD / OpenCASCADE · sólido B-rep" },
      { l: "📐 SC8UU", i: "Passos 01–06 do sólido" },
    ],
    welcome: `<p><strong>Olá! Sou o Project Start.</strong></p>
      <p>Estruturo o ponto de partida do projeto com base nas informações e referências disponíveis na engenharia.</p>
      <p>Organizo premissas, interfaces, dimensões e elementos iniciais para acelerar o desenvolvimento.</p>
      <p>A definição e evolução do projeto permanecem sob responsabilidade do projetista.</p>
      <p>Descreva o que você precisa desenvolver.</p>`,
  },
};

const FLOWS = {
  reuso: [
    {
      user: "Preciso de um mancal linear para eixo Ø8, kickoff de um suporte de guia.",
      think: ["Lendo o pedido de kickoff", "Separando o que é reuso do que seria desenho novo", "Preparando perguntas de especificação"],
      srcs: ["PLM", "Biblioteca CAD"],
      html: `<p>Consigo procurar um <strong>item já documentado</strong>. Antes de abrir a biblioteca, preciso fechar a especificação.</p>
        <div class="ibox blue">
          <div class="ibox-lbl">1 · Objetivo e CAD</div>
          <ul>
            <li>É para <strong>reusar</strong> um item existente ou construir variante nova?</li>
            <li>Disciplina: chassis, powertrain, dispositivo de montagem?</li>
            <li>O arquivo de trabalho é <strong>CATIA V5</strong> ou NX?</li>
          </ul>
        </div>
        <p>Pode responder nessa ordem — aí eu filtro só a pasta certa.</p>`,
    },
    {
      user: "Reuso. Chassis / dispositivo de montagem. CATIA V5. Eixo 8 mm, curso uns 120 mm.",
      think: ["Filtrando disciplina Chassis", "Fixando CATIA V5 como CAD de trabalho", "Ainda faltam furos e envelope"],
      srcs: ["PLM"],
      html: `<p>Ótimo. Eixo Ø8 e CATIA V5 já fecham a família <strong>SC / SHF / SK</strong>.</p>
        <div class="ibox blue">
          <div class="ibox-lbl">2 · Interface e envelope</div>
          <ul>
            <li>Uma bucha <strong>LM8UU</strong> ou configuração longa/dupla?</li>
            <li>Fixação: quantos furos, M4 ou padrão interno?</li>
            <li>Passo e envelope aproximados? Material?</li>
          </ul>
        </div>
        <p>Com isso eu busco. Ainda não libero arquivo.</p>`,
    },
    {
      user: "Uma LM8UU, 4 furos M4 passo 18×24. Envelope 34×30×22, alumínio.",
      think: ["Abrindo ENOVIA · pasta Eixos lineares Ø8", "Cruzando envelope 34×30×22 e furos M4", "Ranking dos 3 mais próximos"],
      srcs: ["ENOVIA", "Biblioteca CAD", "Laboratório interno"],
      html: `<p>Encontrei <strong>3 projetos documentados</strong>. Similaridade no eixo Ø8 e na fixação M4. <strong>Nenhum download ainda</strong> — primeiro abrimos a ficha.</p>
        <div class="proj-grid">
          <article class="proj-card best">
            <img src="${IMG.sc8}" alt="SC8UU" />
            <div>
              <div class="proj-k">Candidato A · 94%</div>
              <div class="proj-n">SC8UU · PLM 104582 Rev.C</div>
              <div class="proj-b">Mancal linear, 1× LM8UU, 34×30×22, 4× M4 18×24. Liberado para estudo.</div>
              <div class="proj-meta">
                <span class="badge green">Liberado</span>
                <span class="badge blue">CATIA / STEP</span>
              </div>
            </div>
          </article>
          <article class="proj-card">
            <img src="${IMG.shf}" alt="SHF08" />
            <div>
              <div class="proj-k">Candidato B · 71%</div>
              <div class="proj-n">SHF08 · PLM 117903 Rev.B</div>
              <div class="proj-b">Flange de eixo Ø8, fenda de aperto. Mesmo eixo, outra arquitetura (não é pillow block).</div>
              <div class="proj-meta">
                <span class="badge green">Liberado</span>
                <span class="badge orange">Interface diferente</span>
              </div>
            </div>
          </article>
          <article class="proj-card">
            <img src="${IMG.p6}" alt="Reconstrução do SC8UU" />
            <div>
              <div class="proj-k">Candidato C · 88%</div>
              <div class="proj-n">SC8UU-LAB-2024 · PLM 118220 Rev.A</div>
              <div class="proj-b">Reconstrução paramétrica do laboratório interno. Mesmo envelope, ainda em desenvolvimento.</div>
              <div class="proj-meta">
                <span class="badge orange">Em desenvolvimento</span>
                <span class="badge purple">Lab</span>
              </div>
            </div>
          </article>
        </div>
        <div class="ibox orange">
          <div class="ibox-lbl">Guardrail</div>
          <ul><li>STEP e código só depois de <strong>abrir a ficha</strong> e confirmar revisão, status e interfaces.</li></ul>
        </div>
        <div class="acts">
          <button type="button" class="act p" data-act="send-next">Abrir ficha do SC8UU (A)</button>
          <button type="button" class="act g" data-act="toast-b">Ver SHF08</button>
        </div>`,
    },
    {
      user: "Abre a ficha do SC8UU — o candidato A.",
      think: ["Abrindo SC8UU.FCStd na biblioteca", "Lendo revisão C e status de ciclo de vida", "Carregando preview 3D da ficha"],
      srcs: ["SC8UU.FCStd", "ENOVIA 104582 Rev.C"],
      html: `<p><strong>Ficha aberta.</strong> Ainda não enviei código.</p>
        <img class="ficha-img" src="${IMG.sc8}" alt="Ficha SC8UU" />
        ${cadStage(IMG.p6, STL.sc8, "Preview 3D da ficha · SC8UU")}
        <div class="table-scroll">
          <table class="dtbl">
            <thead><tr><th>Campo</th><th>Valor na ficha</th></tr></thead>
            <tbody>
              <tr><td>Código / rev.</td><td>104582 · Rev.C</td></tr>
              <tr><td>Status</td><td>Liberado para estudo · não é release de produção</td></tr>
              <tr><td>Envelope</td><td>34 × 30 × 22 mm</td></tr>
              <tr><td>Eixo / bucha</td><td>Ø8 · alojamento Ø15 (LM8UU)</td></tr>
              <tr><td>Fixação</td><td>4× Ø4,5 · passo 18 × 24 · M4</td></tr>
              <tr><td>CAD nativo</td><td>FCStd + STEP AP214</td></tr>
              <tr><td>Dono</td><td>Biblioteca de eixos lineares · Chassis</td></tr>
            </tbody>
          </table>
        </div>
        <div class="ibox blue">
          <div class="ibox-lbl">Confirme antes do export</div>
          <ul>
            <li>Revisão C e interfaces batem com o seu kickoff.</li>
            <li>Destino: dispositivo de montagem / estudo — não produção do veículo.</li>
          </ul>
        </div>
        <div class="acts">
          <button type="button" class="act p" data-act="send-next">Confirmei a ficha · pode mandar o STEP</button>
        </div>`,
    },
    {
      user: "Confirmei a ficha. Pode mandar o STEP e o código.",
      think: ["Conferindo confirmação humana", "Liberando export STEP AP214", "Empacotando script paramétrico"],
      srcs: ["SC8UU.step", "SC8UU.FCStd"],
      html: `<p>Ficha confirmada. Segue o pacote do <strong>candidato A</strong> — só o que está documentado.</p>
        <div class="acts">
          <a class="act p" href="${STEP.sc8}" download="SC8UU.step">⬇ SC8UU.step</a>
          <a class="act g" href="${STL.sc8}" download="SC8UU.stl">⬇ SC8UU.stl</a>
          <a class="act g" href="${FC.sc8}" download="SC8UU.FCStd">⬇ SC8UU.FCStd</a>
        </div>
        <p class="follow">Núcleo do código que reconstrói o envelope (kernel Part):</p>
        <pre class="code">W, L, H = 34.0, 30.0, 22.0
bloco = Part.makeBox(W, L, H, App.Vector(-W/2, -L/2, 0))
conico = bloco.makeChamfer(6.0, arestas_superiores)
furo = Part.makeCylinder(7.5, L+6, App.Vector(0, -L/2-3, 11), App.Vector(0,1,0))
solido = conico.cut(furo)  # + 4 furos Ø4,5 no topo</pre>
        <div class="ibox green">
          <div class="ibox-lbl">Kickoff</div>
          <ul>
            <li>Use como <strong>projeto-base</strong>. Ajuste CATIA no padrão interno depois do review.</li>
            <li>Se quiser o sólido feito na sua frente, troque para o agente <strong>Project Start</strong>.</li>
          </ul>
        </div>`,
    },
  ],
  cad: [
    {
      user: "Quero construir a base do mancal etapa a etapa. Começa pelo bloco.",
      think: ["Entrando em modo construção", "Uma operação por vez", "Pedindo confirmação do envelope"],
      srcs: ["Kernel CAD"],
      html: `<p>Perfeito. Primeiro o <strong>bloco bruto</strong> — ainda sem furo.</p>
        <div class="ibox blue">
          <div class="ibox-lbl">Confirme o envelope</div>
          <ul>
            <li>Sugestão da ficha SC8UU: <strong>34 × 30 × 22 mm</strong>, origem no centro da base.</li>
            <li>Não vou chanfrar nem furar até você pedir.</li>
          </ul>
        </div>
        <p>Confirma esse envelope?</p>`,
    },
    {
      user: "Confirmo. Bloco 34 × 30 × 22 mm.",
      think: ["Criando prisma 34×30×22", "Exportando STEP / STL do passo 1", "Atualizando preview"],
      srcs: ["01_bloco.step"],
      html: `<p><strong>Passo 1 — bloco bruto.</strong> Prisma criado. Volume 22.440 mm³.</p>
        ${cadStage(IMG.p1, STL.p1, "Passo 1 · bloco")}
        <p>Próxima operação?</p>
        <div class="acts"><button type="button" class="act p" data-act="send-next">Chanfrar 6 mm em cima</button></div>`,
    },
    {
      user: "Chanfra 6 mm nas duas arestas superiores longas.",
      think: ["Selecionando arestas do topo", "Aplicando chanfro de 6 mm", "Recalculando volume"],
      srcs: ["02_chanfros.step"],
      html: `<p><strong>Passo 2 — faces cônicas.</strong> Chanfro 6 mm aplicado. Volume 21.360 mm³.</p>
        ${cadStage(IMG.p2, STL.p2, "Passo 2 · chanfro")}
        <p>O visual do SC8UU começa a aparecer. Próximo?</p>
        <div class="acts"><button type="button" class="act p" data-act="send-next">Furo Ø15 do rolamento</button></div>`,
    },
    {
      user: "Furo passante Ø15 no eixo Y, centro a 11 mm de altura.",
      think: ["Criando cilindro Ø15", "Corte booleano no sólido", "Conferindo sólido fechado"],
      srcs: ["03_furo_eixo.step"],
      html: `<p><strong>Passo 3 — furo do rolamento.</strong> Alojamento LM8UU. Volume 16.059 mm³.</p>
        ${cadStage(IMG.p3, STL.p3, "Passo 3 · furo do eixo")}
        <p>Gire o modelo para ver o passante. Próximo: furos de fixação?</p>
        <div class="acts"><button type="button" class="act p" data-act="send-next">Quatro furos M4</button></div>`,
    },
    {
      user: "Quatro furos Ø4,5 no topo, retângulo 18 × 24 mm.",
      think: ["Padrão retangular 18×24", "Cortando 4 cilindros Ø4,5", "Atualizando isométrico"],
      srcs: ["04_furos_m4.step"],
      html: `<p><strong>Passo 4 — furos de fixação.</strong> 4× Ø4,5 no topo. Volume 14.687 mm³.</p>
        ${cadStage(IMG.p4, STL.p4, "Passo 4 · furos M4")}
        <p>Falta o rebaixo da boca, se quiser ficar igual à ficha.</p>
        <div class="acts"><button type="button" class="act p" data-act="send-next">Rebaixar as bocas</button></div>`,
    },
    {
      user: "Rebaixa as bocas Ø18 × 1,6 mm.",
      think: ["Rebaixo Ø18 × 1,6 nas duas bocas", "Validando sólido fechado", "Empacotando o modelo completo"],
      srcs: ["05_rebaixo_boca.step", "06_sc8uu_completo.step"],
      html: `<p><strong>Passo 5 — rebaixo das bocas.</strong> Ø18 × 1,6 mm nas duas faces. Volume 14.486 mm³.</p>
        ${cadStage(IMG.p5, STL.p5, "Passo 5 · rebaixo")}
        <p><strong>Passo 6 — SC8UU completo.</strong> Sólido fechado, pronto como material-base.</p>
        ${cadStage(IMG.p6, STL.p6, "Passo 6 · modelo completo")}
        <div class="acts">
          <a class="act p" href="${STEP.p6}" download="06_sc8uu_completo.step">⬇ STEP completo</a>
          <a class="act g" href="${STL.p6}" download="06_sc8uu_completo.stl">⬇ STL</a>
        </div>
        <div class="ibox green">
          <div class="ibox-lbl">Material base gerado</div>
          <ul>
            <li>Estruturado a partir das documentações e padrões disponíveis na empresa.</li>
            <li>Baixe, revise e utilize como ponto de partida para o desenvolvimento.</li>
            <li>Conteúdo gerado com apoio de IA e sujeito à validação do projetista.</li>
          </ul>
        </div>`,
    },
  ],
};

const state = {
  current: "reuso",
  busy: false,
  idx: { reuso: 0, cad: 0 },
  html: { reuso: "", cad: "" },
  started: { reuso: false, cad: false },
};

const streamInner = document.getElementById("stream-inner");
const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("btn-send");
const chipsEl = document.getElementById("chips");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
const mobToggle = document.getElementById("mob-toggle");
const U_AV = `<div class="av" style="background:var(--navy)">EM</div>`;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function scroll() {
  const el = document.getElementById("chat-stream");
  el.scrollTop = el.scrollHeight;
}

function botAv() {
  const a = AGENTS[state.current];
  return `<div class="av" style="background:linear-gradient(135deg,var(--blue-b),var(--blue))" aria-hidden="true">${a.emoji}</div>`;
}

function setWho(txt, mode) {
  document.getElementById("who-text").textContent = txt;
  document.getElementById("who-live").className = "who-live" + (mode ? " " + mode : "");
}

function fillNext() {
  const flow = FLOWS[state.current];
  const next = flow[state.idx[state.current]];
  inputEl.value = next ? next.user : "";
  sendBtn.disabled = state.busy || !inputEl.value.trim();
  document.getElementById("comp-hint").textContent = next
    ? "A próxima fala já está no campo. Clique em Enviar."
    : "Fim deste roteiro. Nova conversa para repetir, ou troque de agente.";
  renderChips(state.current);
}

function lock(on) {
  sendBtn.disabled = on || !inputEl.value.trim();
  chipsEl.querySelectorAll(".chip").forEach((b) => { b.disabled = on; });
}

function addUser(txt) {
  const el = document.createElement("div");
  el.className = "msg user";
  el.innerHTML = `${U_AV}<div class="bubble">${esc(txt)}</div>`;
  streamInner.appendChild(el);
  scroll();
}

function addThink(steps) {
  const el = document.createElement("div");
  el.className = "msg bot";
  el.id = "typing-el";
  el.innerHTML = `${botAv()}<div class="bubble"><div class="think-wrap">${
    steps.map((s, i) => `<div class="think-s${i === 0 ? " on" : ""}"><span class="tdot"></span><span>${esc(s)}</span></div>`).join("")
  }</div></div>`;
  streamInner.appendChild(el);
  scroll();
}

async function playThink(steps) {
  const rows = document.querySelectorAll("#typing-el .think-s");
  for (let i = 0; i < steps.length; i++) {
    rows.forEach((row, idx) => {
      row.classList.toggle("on", idx === i);
      row.classList.toggle("done", idx < i);
    });
    await wait(rm ? 40 : (i === steps.length - 1 ? 380 : 520));
  }
  rows.forEach((row) => { row.classList.remove("on"); row.classList.add("done"); });
  await wait(rm ? 20 : 160);
}

function bindActs(root) {
  root.querySelectorAll("[data-act]").forEach((b) => {
    b.addEventListener("click", () => act(b.dataset.act));
  });
}

function watchImages(root) {
  root.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", scroll, { once: true });
  });
}

function addBot(html, srcs) {
  document.getElementById("typing-el")?.remove();
  const el = document.createElement("div");
  el.className = "msg bot";
  el.innerHTML = `${botAv()}<div class="bubble">${html}${srcPills(srcs)}</div>`;
  streamInner.appendChild(el);
  bindActs(el);
  watchImages(el);
  el.querySelectorAll(".view3d[data-stl]").forEach(mountViewer);
  scroll();
}

function disposeViewers() {
  viewers.splice(0).forEach((v) => {
    cancelAnimationFrame(v.raf);
    v.ro?.disconnect();
    v.controls?.dispose();
    v.geom?.dispose();
    v.mat?.dispose();
    v.renderer?.dispose();
    v.renderer?.forceContextLoss?.();
    v.el.replaceChildren();
    delete v.el.dataset.ready;
  });
}

function viewerFallback(el) {
  if (el.querySelector(".cad-err")) return;
  const note = location.protocol === "file:"
    ? "O viewer 3D não carrega em file://. Sirva esta pasta com um servidor estático."
    : "Viewer 3D indisponível neste arquivo. Use o isométrico acima.";
  el.insertAdjacentHTML("beforeend", `<p class="cad-hint cad-err">${note}</p>`);
}

function mountViewer(el) {
  if (el.dataset.ready) return;
  el.dataset.ready = "1";
  const url = el.dataset.stl;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (err) {
    viewerFallback(el);
    return;
  }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1730);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 5000);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute("aria-hidden", "true");
  el.appendChild(renderer.domElement);

  const resize = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(40, -30, 70);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x88aadd, 0.35);
  fill.position.set(-40, 20, 20);
  scene.add(fill);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !rm;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);

  const rec = { el, renderer, controls, raf: 0, ro: null, geom: null, mat: null };
  viewers.push(rec);
  const render = () => renderer.render(scene, camera);
  if (rm) {
    controls.addEventListener("change", render);
    render();
  } else {
    const tick = () => {
      rec.raf = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();
  }
  if (typeof ResizeObserver !== "undefined") {
    rec.ro = new ResizeObserver(() => {
      resize();
      render();
    });
    rec.ro.observe(el);
  }

  new STLLoader().load(url, (geom) => {
    geom.computeVertexNormals();
    geom.center();
    geom.computeBoundingSphere();
    const mat = new THREE.MeshStandardMaterial({ color: 0xb9c6dc, metalness: 0.15, roughness: 0.45 });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);
    rec.geom = geom;
    rec.mat = mat;
    const r = geom.boundingSphere?.radius || 20;
    camera.position.set(r * 1.6, -r * 1.8, r * 1.2);
    camera.near = Math.max(r / 1000, 0.01);
    camera.far = r * 40;
    camera.updateProjectionMatrix();
    controls.update();
    resize();
    render();
  }, undefined, () => viewerFallback(el));
}

function snapshot() {
  state.html[state.current] = streamInner.innerHTML;
}

function showWelcome(id) {
  disposeViewers();
  streamInner.innerHTML = "";
  const a = AGENTS[id];
  addBot(a.welcome, []);
  state.started[id] = false;
  state.idx[id] = 0;
  fillNext();
  snapshot();
}

async function sendNext() {
  if (state.busy) return;
  const flow = FLOWS[state.current];
  const i = state.idx[state.current];
  const step = flow[i];
  if (!step) {
    toast("Este roteiro acabou. Clique em Nova conversa para repetir.");
    return;
  }
  state.busy = true;
  lock(true);
  setWho("Eduardo está conversando", "on");
  state.started[state.current] = true;
  const spoken = inputEl.value.trim() || step.user;
  addUser(spoken);
  inputEl.value = "";
  if (step.think) {
    addThink(step.think);
    await playThink(step.think);
  } else {
    addThink(["Pensando…"]);
    await wait(rm ? 40 : 420);
  }
  addBot(step.html, step.srcs);
  state.idx[state.current] = i + 1;
  snapshot();
  setWho("Aguardando");
  state.busy = false;
  fillNext();
  lock(false);
  sendBtn.disabled = !inputEl.value.trim();
}

function act(id) {
  if (state.busy) return;
  if (id === "send-next") { sendNext(); return; }
  if (id === "toast-b") {
    toast("SHF08 é flange, não pillow block. O melhor match continua o SC8UU.");
  }
}

function updateHeader(id) {
  const a = AGENTS[id];
  const badge = document.getElementById("hdr-badge");
  badge.textContent = a.emoji;
  badge.style.background = a.bg;
  document.getElementById("hdr-name").textContent = a.name;
  document.getElementById("hdr-status").textContent = a.status;
  document.getElementById("hdr-desc").textContent = a.desc || "";
  document.getElementById("src-pills").innerHTML = a.srcs.map((s) =>
    `<span class="spill" title="${esc(s.i)}">${s.l}</span>`
  ).join("");
}

function renderChips(id) {
  const next = FLOWS[id][state.idx[id]];
  if (!next) { chipsEl.innerHTML = ""; return; }
  const label = state.idx[id] === 0
    ? (id === "reuso" ? "▶ Começar a busca" : "▶ Começar o Project Start")
    : "▶ Enviar próxima fala";
  chipsEl.innerHTML = `<button type="button" class="chip" id="chip-go">${label}</button>`;
  document.getElementById("chip-go").addEventListener("click", () => sendNext());
}

function setMenu(open) {
  sidebar.classList.toggle("open", open);
  scrim.classList.toggle("show", open);
  scrim.hidden = !open;
  mobToggle.setAttribute("aria-expanded", open ? "true" : "false");
  mobToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

function switchAgent(id) {
  if (id === state.current || state.busy) return;
  snapshot();
  document.querySelectorAll(".ag-btn").forEach((b) => {
    const on = b.dataset.agent === id;
    b.classList.toggle("active", on);
    if (on) b.setAttribute("aria-current", "true");
    else b.removeAttribute("aria-current");
  });
  state.current = id;
  updateHeader(id);
  disposeViewers();
  if (state.html[id]) {
    streamInner.innerHTML = state.html[id];
    streamInner.querySelectorAll(".view3d[data-stl]").forEach((el) => {
      delete el.dataset.ready;
      el.replaceChildren();
      mountViewer(el);
    });
    bindActs(streamInner);
    watchImages(streamInner);
  } else {
    showWelcome(id);
  }
  fillNext();
  scroll();
  setMenu(false);
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2800);
}

document.querySelectorAll(".ag-btn").forEach((b) => {
  b.addEventListener("click", () => switchAgent(b.dataset.agent));
});
document.getElementById("btn-new").addEventListener("click", () => {
  if (state.busy) return;
  state.html[state.current] = "";
  showWelcome(state.current);
  toast("Nova conversa neste agente");
  setMenu(false);
});
mobToggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
scrim.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
inputEl.addEventListener("input", () => { sendBtn.disabled = state.busy || !inputEl.value.trim(); });
document.getElementById("form-comp").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputEl.value.trim() || state.busy) return;
  sendNext();
});

updateHeader("reuso");
showWelcome("reuso");
