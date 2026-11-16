# Copiloto CAD

Demonstração de um assistente de engenharia. Um agente acha o projeto já documentado e só libera o arquivo depois da ficha. O outro constrói o sólido uma operação por vez.

A empresa da tela é genérica. A pessoa na tela é Eduardo Mesquita, projetista de chassis. Não há modelo conectado, banco nem chave de API.

Desenvolvido por [Eduardo Mesquita](https://www.linkedin.com/in/engeduardomesquita/).

**[Ver a demo online](https://edumesqg.github.io/Agente_CAD/)**

[English](#english)

## O problema

O projetista recomeça do zero um estudo que a biblioteca já tem parecido. Quando o arquivo aparece antes da ficha, revisão, status e interface ficam para depois — e o sólido novo nasce inteiro, sem conferência de cada operação.

Este repositório mostra o desenho oposto: a busca fecha a especificação, mostra candidatos e só então entrega o arquivo. A modelagem pede confirmação a cada passo.

## Quem usa

O projetista de chassis, no kickoff de um suporte de guia. Ele descreve eixo, curso, bucha e fixação. O agente de busca devolve referências já documentadas. O agente de modelagem devolve o sólido em etapas, para quem quer ver a construção na frente.

## O que os agentes fazem

| Agente | O que entrega |
| --- | --- |
| Busca Inteligente de Projetos | Especificação, três candidatos, ficha do SC8UU e só então STEP, STL e FCStd |
| Project Start | O sólido nasce uma operação por vez, com imagem e viewer 3D orbitável |

Trocar de agente preserva a outra conversa. Nova conversa zera só o agente atual. A próxima fala já está no campo. Enviar avança o roteiro.

Há um freio. Na busca, STEP e código só saem depois de abrir a ficha e confirmar revisão, status e interfaces. Na modelagem, chanfro, furo e rebaixo só entram quando a pessoa pede. O arquivo de estudo não é release de produção. O projetista continua dono do modelo.

## O que eles não fazem

- Não chamam um modelo de linguagem. As falas estão no roteiro.
- Não consultam um PLM real. Códigos, similaridade, revisão e status são simulados.
- Não desenham uma peça nova a partir de um pedido livre. O sólido segue os seis passos do SC8UU.
- Não publicam o arquivo em produção e não substituem o CAD do projetista.

A geometria do SC8UU e do SHF08 é de biblioteca pública, usada como proxy visual.

## Como abrir

A demo já está no ar: [edumesqg.github.io/Agente_CAD](https://edumesqg.github.io/Agente_CAD/). O viewer 3D precisa de HTTP. Essa página já serve os arquivos.

Para abrir nesta pasta, use um servidor estático. Abrir `index.html` pelo disco (`file://`) quebra o JavaScript em módulo e o carregamento do STL.

```bash
python -m http.server 8766
```

Abra [http://127.0.0.1:8766/](http://127.0.0.1:8766/). Não há instalação nem chave de API. A fonte Inter e o Three.js r170 estão nesta pasta. Nada é carregado de uma CDN.

## O que foi conferido

A checagem desta versão é de percurso, não de avaliação estatística.

O que a demo sustenta, e dá para repetir na tela:

1. A busca faz as perguntas de especificação antes de listar candidatos.
2. Os três candidatos aparecem sem download. O arquivo só entra depois da ficha confirmada.
3. O Project Start mostra bloco, chanfro, furo, fixação, rebaixo e o sólido completo, cada um com preview.
4. O viewer orbita o STL do passo. Trocar de agente não apaga a outra conversa.

Uma busca em PLM real e um kernel CAD ligado ficam fora deste corte.

## Licença

MIT. Veja `LICENSE`.

A fonte Inter, em `fonts/`, permanece sob a SIL Open Font License. Veja `fonts/OFL.txt`.

Three.js r170, em `vendor/three/`, permanece sob a licença MIT dos autores do Three.js.

---

## English

An engineering assistant, shown as a demo. One agent finds a documented design and only releases the file after the record card. The other builds the solid one operation at a time.

The company on screen is generic. The person on screen is Eduardo Mesquita, a chassis designer. There is no connected model, no database, and no API key.

Built by [Eduardo Mesquita](https://www.linkedin.com/in/engeduardomesquita/).

**[Open the live demo](https://edumesqg.github.io/Agente_CAD/)**

### The problem

A designer starts from scratch on a study the library already resembles. When the file arrives before the record card, revision, status, and interface come too late. A new solid also arrives whole, with no check of each operation.

This repository shows the opposite shape: search closes the specification, shows candidates, and only then hands over the file. Modeling asks for confirmation at each step.

### Who uses it

A chassis designer, at the kickoff of a guide support. The person describes shaft, travel, bushing, and mounting. The search agent returns documented references. The modeling agent returns the solid in stages, for whoever wants to watch the build.

### What the agents do

| Agent | What it returns |
| --- | --- |
| Intelligent project search | A specification, three candidates, the SC8UU record card, and only then STEP, STL, and FCStd |
| Project Start | The solid grows one operation at a time, with an image and an orbitable 3D viewer |

Switching agents keeps the other conversation. A new conversation clears only the current agent. The next line is already in the field. Send advances the script.

There is a brake. In search, STEP and code leave only after the record card is opened and revision, status, and interfaces are confirmed. In modeling, chamfer, hole, and recess appear only when the person asks. The study file is not a production release. The designer still owns the model.

### What they do not do

- They do not call a language model. The lines live in the script.
- They do not query a real PLM. Codes, similarity, revision, and status are simulated.
- They do not design a new part from a free request. The solid follows the six SC8UU steps.
- They do not publish the file to production and they do not replace the designer's CAD.

The SC8UU and SHF08 geometry comes from a public library and is used as a visual proxy.

### How to open it

The demo is live: [edumesqg.github.io/Agente_CAD](https://edumesqg.github.io/Agente_CAD/). The 3D viewer needs HTTP. That page already serves the files.

To open this folder locally, use a static server. Opening `index.html` from disk (`file://`) breaks the module script and the STL load.

```bash
python -m http.server 8766
```

Open [http://127.0.0.1:8766/](http://127.0.0.1:8766/). There is no install and no API key. The Inter font and Three.js r170 are in this folder. Nothing is loaded from a CDN.

### What was checked

This version was checked by walking the paths, not by a statistical evaluation.

What the demo holds, and what you can repeat on the screen:

1. Search asks the specification questions before listing candidates.
2. The three candidates appear with no download. The file arrives only after the record card is confirmed.
3. Project Start shows block, chamfer, bore, mounting holes, recess, and the finished solid, each with a preview.
4. The viewer orbits the step STL. Switching agents does not erase the other conversation.

A search on a real PLM and a connected CAD kernel are outside this cut.

### License

MIT. See `LICENSE`.

The Inter font, in `fonts/`, remains under the SIL Open Font License. See `fonts/OFL.txt`.

Three.js r170, in `vendor/three/`, remains under the MIT license of the Three.js authors.
