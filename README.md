# 🦖 Dino Crawler

Um roguelike ASCII PWA (Progressive Web App) focado em **acessibilidade total**, projetado para ser jogado por pessoas cegas e videntes em pé de igualdade.

## 🕹️ O Jogo
Você é um explorador temporal preso em uma era pré-histórica. Seu objetivo é coletar **5 peças da Máquina do Tempo** espalhadas pelo mapa e retornar ao ponto inicial antes que seu oxigênio acabe ou que você vire lanche de dinossauro.

### Mecânicas Principais:
- **Oxigênio (O2):** Cada movimento consome oxigênio. Encontre tanques para sobreviver.
- **Arsenal:** 
  - **Machete:** Combate corpo a corpo, também limpa arbustos (#).
  - **Taser:** Causa dano com chance de atordoar dinossauros por 3 turnos.
  - **Granada:** Explode em raio 2 ao redor do jogador — ideal para grupos. Munição limitada (5 unidades).
  - **Iscas:** Use cadáveres de dinossauros abatidos para distrair outros predadores.
- **SCAN (Sonar):** Sistema de localização por eco que informa distância e direção de itens e perigos via log de texto e sinais sonoros.

## Acessibilidade (Digital Inclusion)
O Dino Crawler foi construído seguindo os princípios de **Inclusão Digital**, não apenas acessibilidade técnica:
- **Aria-Live Logs:** Feedback em tempo real lido automaticamente por leitores de tela (TalkBack, NVDA).
- **Interface D-Pad:** Botões de movimento em layout de cruz com nomes descritivos (ex: "NORTH (↑)").
- **Sistema Bilíngue:** Suporte completo para Português (PT-BR) e Inglês (EN).
- **Feedback Sonoro:** Sons distintos para diferentes tipos de terreno, ações e efeitos.
- **Logs Compactos:** Informações do SCAN listadas individualmente para leitura fluida (ex: `Dinossauro: 3N, 2L`).

## 🛠️ Tecnologias
- HTML5 / CSS3 (Grid e Flexbox)
- Vanilla JavaScript
- Web Audio API
- Service Workers (PWA)

## 🚀 Como Jogar
Acesse diretamente via GitHub Pages:
[https://concego.github.io/DinoCrawler/](https://concego.github.io/DinoCrawler/)

---
**Desenvolvido como parte do projeto Eu Concego Jogar (ECJ) 🐉**
*Foco em inclusão digital e acessibilidade para deficientes visuais.*
