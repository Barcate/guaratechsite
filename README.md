
# 🚀 AmbaTech — Landing Page de Alta Performance

Este projeto é uma **Landing Page institucional** desenvolvida para a **AmbaTech**, com foco em **design moderno**, **animações fluidas** e **alta performance**.  
A experiência do usuário é aprimorada com animações de entrada sofisticadas e rolagem suave personalizada.

---

## 🛠️ Tecnologias Utilizadas

- **React.js (Vite)** — Biblioteca principal para construção da interface
- **Tailwind CSS** — Estilização rápida, responsiva e escalável
- **GSAP (GreenSock)** — Animações avançadas de entrada e transições
- **Lenis** — Smooth Scroll profissional e controlado
- **Lucide React** — Ícones leves e modernos

---

## ⚙️ Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **NPM**, **Yarn** ou **PNPM**

---

## 📥 Instalação e Execução

### 1️⃣ Clonar o repositório

git clone https://github.com/seu-usuario/ambatech-lp.git
cd ambatech-lp
````

### 2️⃣ Instalar as dependências


npm install
```

### 3️⃣ Rodar o servidor de desenvolvimento


npm run dev
```

Projeto disponível em:

```
http://localhost:5173
```

---

## 🧩 Configurações Importantes

### 🎨 Tailwind (`tailwind.config.js`)

O projeto utiliza uma **paleta de cores personalizada** (Laranja e Roxo).
Sem essa configuração, classes como `brand-primary`, `brand-purple`, etc., não funcionarão corretamente.

---

### 🎯 CSS Global (`src/index.css`)

Para evitar conflitos com o **Lenis**, desative o scroll nativo do navegador:

```css
html {
  scroll-behavior: auto !important;
}
```

---

### ⚡ Otimização de Performance

* Reduza valores altos de `backdrop-blur` em máquinas mais fracas
  Ex: `blur-[100px]` → `blur-[40px]`
* Oculte elementos decorativos no mobile:

```html
hidden md:block
```

---

## 📁 Estrutura do Projeto

```text
src/
├── assets/          # Imagens, logos e recursos estáticos
├── App.jsx          # Componente principal (GSAP + Lenis)
├── index.css        # Estilos globais e Tailwind
└── main.jsx         # Ponto de entrada da aplicação
```

---

## 💡 Dicas para Desenvolvedores

* **Animações:** Todas as animações de entrada estão no hook `useGSAP` dentro do `App.jsx`
* **FAQ:** Conteúdo controlado pelo objeto `dadosFaq`
* **Scroll:** Ajuste `duration` e `wheelMultiplier` no Lenis para alterar a velocidade

---

## 🧑‍💻 Autor

Desenvolvido por **AmbaTech** — 2025

```

---