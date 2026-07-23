# 🦖 Dino Crawler

> **GMTK Game Jam 2026 — Tema: Built to Scale**

Um roguelike ASCII / PWA (Progressive Web App) focado em **inclusão digital**: projetado para ser jogado por pessoas cegas e videntes em pé de igualdade, sem concessões de conteúdo para nenhum dos lados.

---

## 🕹️ O Jogo

Você é **Dr. Aris**, cientista enviado ao Cretáceo para recuperar peças de tecnologia experimental. Colete **5 peças da Máquina do Tempo** espalhadas pelo mapa e retorne ao ponto (0,0) antes que seu oxigênio acabe — ou que você vire lanche de dinossauro.

---

## ⚙️ Mecânicas

### Sobrevivência
| Recurso | Detalhe |
|---|---|
| **HP** | 120 pontos. Dano de dinos e asfixia. Sem recuperação passiva. |
| **O2** | 100 unidades. Consome 1 por movimento. Bolsões `*` no mapa recargam +50 e são **permanentes**. Com O2 = 0, perde 5 HP/turno. |
| **Carne** | Extrai de cadáveres (`X`) com Machete. Guarda até 3 porções (crua). Cozinha em fogueira (`^`) → consome automaticamente quando HP < 100 (+20 HP). |

### Arsenal
| # | Arma | Descrição |
|---|---|---|
| `1` | **Machete** | Corpo a corpo. Limpa arbustos (`#`). Extrai carne de cadáveres. |
| `2` | **Taser** | Dano à distância com chance de atordoar por 3 turnos. Anquilossauro é imune. Pode incendiar arbustos → cria fogueira. |
| `3` | **Granada** | Arremessa 2 casas na direção escolhida. Explode em área 3x3. 8 unidades. Requer F + seta (não dispara no próprio pé). |
| `4` | **Laser** | Linha reta até 8 casas, 50 de dano, para no 1° alvo. 5 cargas, recarrega 1 por turno ocioso. |

### Fogueiras
- Criadas pelo Taser em arbustos.
- Dinos **fogem** de fogueiras ativas.
- Duram turnos limitados; ao apagar, o terreno fica limpo.
- Permitem cozinhar carne crua automaticamente ao passar por cima.

### SCAN (`S`)
- Ecoa posições de peças, O2, dinos e cadáveres no raio de visão.
- 3 cargas, recarrega 1 por turno.
- Feedback por texto e som (frequência varia por tipo de item).

---

## 🦕 Bestiário

| Símbolo | Dino | HP | Dano | Notas |
|---|---|---|---|---|
| `V` | Velociraptor | 30 | 15 | Ágil, spawn mais comum. |
| `T` | T-Rex | 80 | 30 | Lento, fortíssimo. |
| `A` | Anquilossauro | 60–80 | 20 | Imune ao Taser. Lento. |
| `3` | Triceratops | 50 | 20 | Fica *provoked* ao levar hit. |
| `W` | Parasaurolofo | 25 | 10 | Fraco, bom para extrair carne. |
| `F` | Em fuga | — | — | Dino afugentado por fogueira. |
| `X` | Cadáver | — | — | Atrai dinos. Fonte de carne. |

Dinossauros adicionais são spawnados a cada peça coletada — o mapa fica progressivamente mais perigoso.

---

## ⌨️ Controles

### Movimento
| Tecla | Ação |
|---|---|
| `↑ ↓ ← →` | Mover / atacar corpo a corpo |

### Ações
| Tecla | Ação |
|---|---|
| `1` / `2` / `3` / `4` | Selecionar arma |
| `F` | Entrar no modo de mira (F + seta = disparo direcional) |
| `S` | SCAN — ecoa itens e perigos próximos |

### Status (não consomem turno)
| Tecla | Info |
|---|---|
| `O` | O2 atual |
| `H` | HP atual |
| `P` | Peças coletadas |
| `C` | Carne em estoque |

---

## 🎴 Galeria

Bestiário e conquistas desbloqueáveis ao longo das partidas. Cada carta tem arte ASCII, nome e fato científico/irônico. Progresso salvo em `localStorage`.

---

## ♿ Acessibilidade & Inclusão Digital

O Dino Crawler foi construído seguindo os princípios de **Inclusão Digital** — não apenas acessibilidade técnica. O objetivo é que cegos e videntes joguem juntos, no mesmo jogo, sem versões alternativas.

- **`aria-live` (role="log"):** Feedback de ações lido automaticamente por NVDA/TalkBack.
- **Log de histórico:** Acessível via Tab/Setas — permite reler o histórico completo sem interromper o jogo.
- **Log visual (`#log-footer`):** Para jogadores videntes e mobile, mostra as últimas 4 mensagens. Marcado com `aria-hidden` para não gerar redundância no leitor de tela.
- **Web Audio API:** Sons distintos para terreno, combate, O2 baixo, laser, fogueira e stun — jogo completamente jogável sem visão.
- **D-Pad:** Botões de movimento nomeados (ex: `NORTE ↑`) para toque e TalkBack.
- **Atalhos de status sem turno:** O/H/P/C permitem consultar recursos sem penalidade de jogo.
- **Bilíngue:** Suporte completo PT-BR e EN, alternável na tela inicial.

---

## 🛠️ Tecnologias

- HTML5 / CSS3 (Grid, Flexbox)
- Vanilla JavaScript (zero dependências)
- Web Audio API
- Progressive Web App (PWA / Service Worker)

---

## 🧪 Equilíbrio

Testado com 3.000 simulações de IA ótima:

| Métrica | Resultado |
|---|---|
| Taxa de vitória (IA perfeita) | 55,8% |
| Taxa humana estimada | ~30–40% |
| Duração média por partida | ~70 turnos |
| HP médio ao vencer | 78 / 120 |
| Derrotas por O2 | 0% |
| Derrotas por combate | 100% |

O maior risco é o acúmulo de dinos nas fases finais. Os bolsões de O2 são suficientes para partidas completas.

---

## 🚀 Jogar

**[https://concego.github.io/DinoCrawler/](https://concego.github.io/DinoCrawler/)**

---

**Desenvolvido como parte do projeto Eu Concego Jogar (ECJ) 🐉**  
*Foco em inclusão digital e acessibilidade para deficientes visuais.*
