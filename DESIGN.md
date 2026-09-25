# Design System - Master of Voices Bot

Este documento define a paleta de cores e o padrão visual utilizado nas mensagens, embeds e componentes interativos do bot no Discord.

## Colors & Embed Palette

| Name | Hex | Integer (Discord.js) | Preview | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Primary Green** | `#05E52F` | `0x05e52f` | `🟢` | Embed principal do painel fixo (`setupPanel`) e menu efêmero de criação (`openRoom`). |
| **Discord Success** | `#57F287` | `0x57f287` | `✅` | Embed de sucesso e confirmação na criação da sala (`confirmCreateRoom`). |
| **Discord Danger / Error** | `#ED4245` | `0xed4245` | `❌` | Embed de erro e alertas na criação da sala (`confirmCreateRoom`). |

---

## Interactive Components (Buttons)

Os botões interativos utilizam os estilos nativos da biblioteca Discord.js (`ButtonStyle`):

- **Primary (`ButtonStyle.Primary`)**: Ação principal de abertura do fluxo no painel fixo (`Criar Sala Privada`).
- **Secondary (`ButtonStyle.Secondary`)**: Ação auxiliar de configuração (`Editar Nome`).
- **Success (`ButtonStyle.Success`)**: Confirmação final e execução da criação da sala (`Confirmar e Criar`).
