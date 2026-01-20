import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;

  // Captura os dados do formulário
  const formData = new FormData(form);
  // Converte para um objeto simples para garantir que a chave seja uma string pura
  const object = Object.fromEntries(formData);

  // Força a access_key como String pura para evitar o erro de "extra spaces"
  object.access_key = "55fed33c-2c36-489a-8e94-a7dcc614d2ef".trim();

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(object) // Enviando como JSON para maior compatibilidade
    });

    const data = await response.json();

    if (data.success) {
      alert("Sucesso! Sua mensagem foi enviada.");
      form.reset();
    } else {
      alert("Erro do Web3Forms: " + data.message);
    }
  } catch (error) {
    alert("Algo deu errado na conexão. Tente novamente.");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};
export default function App() {
  const [isMenuOpen, setIsOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Funcionamento');
  const [perguntaAberta, setPerguntaAberta] = useState(null);
  const closeMenu = () => setIsOpen(false);

  // REFS (Inicializadas com null para o React)
  const mainContainer = useRef(null);
  const introOverlayRef = useRef(null);
  const introLogoRef = useRef(null);
  const heroContentRef = useRef(null);

  // REF PARA O LENIS (Novo)
  const lenisRef = useRef(null);

  // SMOOTH SCROLL (Lenis com Cleanup)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // Função para atualizar o Lenis quando a página mudar de tamanho
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
    };
  }, []);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();

    // Fecha menu mobile se estiver aberto
    if (isMenuOpen) setIsOpen(false);

    const targetElement = document.querySelector(targetId);

    if (targetElement && lenisRef.current) {
      lenisRef.current.scrollTo(targetElement, {
        offset: -80, // Compensação para o Header Fixo (ajuste conforme a altura do seu header)
        duration: 1.5, // Duração da viagem do scroll
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Mesma curva do scroll natural
      });
    }
  };

  const dadosFaq = {
    'Funcionamento': [
      { q: "Como funciona o processo de desenvolvimento?", a: "Nosso processo é dividido em etapas claras: entendimento da sua necessidade, definição da solução, desenvolvimento, ajustes finais e entrega. Você acompanha tudo do início ao fim." },
      { q: "Eu acompanho o Projeto?", a: "Sim. Mantemos contato constante durante o desenvolvimento para validações, alinhamentos e ajustes, garantindo que o resultado final esteja alinhado ao que você espera." },
      { q: "Posso pedir ajustes durante o projeto?", a: "Sim. Ajustes fazem parte do processo e são previstos conforme o escopo definido no início do projeto." },
      { q: "Em quanto tempo o projeto fica pronto?", a: "O prazo varia conforme o tipo e a complexidade do projeto, mas sempre definimos um cronograma claro antes de iniciar o desenvolvimento." }
    ],
    'Serviços e resultados': [
      { q: "Qual a diferença entre landing page, portfólio e UI/UX?", a: "Landing pages são focadas em conversão, portfólios em apresentação profissional e UI/UX em criar interfaces funcionais, intuitivas e visualmente consistentes." },
      { q: "As landing pages são focadas em conversão?", a: "Sim. Desenvolvemos landing pages pensadas para gerar resultados, com foco em estrutura, clareza e experiência do usuário." },
      { q: "O site funciona bem em dispositivos móveis?", a: "Sim. Todos os projetos são responsivos e adaptados para diferentes tamanhos de tela." },
      { q: "Posso usar o projeto com outro desenvolvedor depois?", a: "Sim. Após a entrega, os arquivos e o projeto são seus, sem dependência futura." }
    ],
    'Preço e contrato': [
      { q: "Como funciona o orçamento?", a: "O orçamento é feito com base no escopo do projeto. Após o alinhamento, enviamos uma proposta com valor fechado." },
      { q: "O que está incluso no valor do projeto?", a: "Estão inclusos desenvolvimento, ajustes previstos no escopo e entrega do projeto conforme acordado." },
      { q: "Existe contrato?", a: "Sim. Trabalhamos com contrato para garantir segurança para ambas as partes." },
      { q: "É possível parcelar o pagamento?", a: "Sim. Oferecemos condições de pagamento que podem ser ajustadas conforme o projeto." }
    ],
    'Suporte': [
      { q: "Vocês oferecem suporte após a entrega?", a: "Sim. Oferecemos 30 dias de suporte gratuito para bugs." },
      { q: "O que acontece se eu encontrar algum problema depois?", a: "Caso surja algum problema relacionado ao que foi desenvolvido, fazemos a correção sem custos adicionais." },
      { q: "Vocês fazem manutenção ou melhorias futuras?", a: "Sim. Manutenções, melhorias e novas funcionalidades podem ser contratadas separadamente." },
      { q: "Posso contratar novos serviços depois?", a: "Claro. Você pode contratar novos serviços ou evoluir o projeto sempre que precisar." }
    ]
  };

  const categorias = Object.keys(dadosFaq);

  // ANIMAÇÃO GSAP
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" }
    });

    // Estado inicial
    gsap.set(heroContentRef.current, { opacity: 0, y: 100 });

    tl.from(introLogoRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 1.2
    })
      .to(introLogoRef.current, {
        scale: 80,
        duration: 2,
        delay: 0.2
      })
      .to(introOverlayRef.current, {
        autoAlpha: 0,
        duration: 1
      }, "-=1.5")
      .to(heroContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out"
      }, "-=1");

  }, { scope: mainContainer });

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-primary selection:text-white">
      {/* CABEÇALHO */}
      <header className="fixed top-0 left-0 w-full z-50 bg-dark-bg/60 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center p-4"> {/* Removi as classes duplicadas aqui */}
          <a href="#inicio" onClick={(e) => handleScrollTo(e, '#inicio')} className="flex items-center gap-3 group">
            <img src="/images/logo.png" alt="Símbolo AmbaTech" className="h-12 w-auto group-hover:rotate-12 transition-transform" />
            <span className="flex text-2xl font-black tracking-tighter">
              <span className="FLogo">AMBA</span>
              <span className="FLogo2">TECH</span>
            </span>
          </a>

          {/* Nav Desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#inicio" onClick={(e) => handleScrollTo(e, '#inicio')} className="text-sm font-medium hover:text-brand-primary transition-colors">Início</a>
            <a href="#servicos" onClick={(e) => handleScrollTo(e, '#servicos')} className="text-sm font-medium hover:text-brand-primary transition-colors">Serviços</a>
            <a href="#trabalhos" onClick={(e) => handleScrollTo(e, '#trabalhos')} className="text-sm font-medium hover:text-brand-primary transition-colors">Nossos Trabalhos</a>
            <a href="#contato" onClick={(e) => handleScrollTo(e, '#contato')}
              className="bg-brand-primary hover:bg-brand-orange-dark text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-0.5">
              Iniciar Projeto
            </a>
          </nav>

          {/* Botão Mobile */}
          <button
            onClick={() => setIsOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile - Ajustado para Fixed também */}
        {isMenuOpen && (
          <div className="fixed top-[72px] left-0 w-full bg-dark-bg/95 backdrop-blur-2xl border-t border-white/10 p-4 space-y-4 shadow-2xl md:hidden">
            <a href="#inicio" onClick={(e) => handleScrollTo(e, '#inicio')} className="block hover:text-brand-primary">Início</a>
            <a href="#servicos" onClick={(e) => handleScrollTo(e, '#servicos')} className="block hover:text-brand-primary">Serviços</a>
            <a href="#trabalhos" onClick={(e) => handleScrollTo(e, '#trabalhos')} className="block hover:text-brand-primary">Nossos Trabalhos</a>
            <a href="#contato" onClick={(e) => handleScrollTo(e, '#contato')} className="block text-brand-primary font-bold">Entre em Contato</a>
          </div>
        )}
      </header>

      <div ref={mainContainer}>

        <div ref={introOverlayRef} className="fixed inset-0 z-[999] bg-black flex items-center justify-center pointer-events-none">
          <div ref={introLogoRef} className="text-brand-primary font-black text-4xl"><img
            src="/images/logo.png"
            alt="Símbolo AmbaTech"
            className="h-10 w-auto group-hover:rotate-12 transition-transform"
          /></div>
        </div>

        <main className='pt-20'>
          {/* SEÇÃO INÍCIO (HERO) */}
          <section ref={heroContentRef} id="inicio" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-grid-pattern">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-purple/30 blur-[120px] rounded-full"></div>

            <div className="container mx-auto text-center px-4 relative z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-brand-orange-light text-xs font-bold tracking-widest uppercase mb-6">
                Inovação & Performance
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
                Transformamos Ideias em <br />
                <span className="
                  relative inline-block
                  pb-1 pr-2
                  bg-clip-text text-transparent
                  
                  /* Configuração do Background */
                  bg-[length:300%_100%]
                  animate-shimmer
                  
                  /* Gradiente Personalizado para Loop Perfeito:
                    Roxo -> Laranja -> Branco -> Laranja -> Roxo
                    O 'via-white' manual em 50% cria o feixe de luz.
                  */
                  bg-[linear-gradient(110deg,#f48131_0%,#e5672c_25%,#ff60a5_50%,#4f297c_75%,#f48131_100%)]
                ">
                  Experiências Digitais
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                Unimos design de ponta e tecnologia robusta para acelerar o crescimento do seu negócio no mundo digital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contato" onClick={(e) => handleScrollTo(e, '#contato')}
                  className="bg-brand-primary hover:bg-brand-orange-dark text-white font-bold py-4 px-10 rounded-xl text-lg shadow-2xl shadow-brand-primary/30 transition-all hover:scale-105">
                  Vamos Conversar
                </a>
                <a href="#trabalhos" onClick={(e) => handleScrollTo(e, '#trabalhos')}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-xl text-lg border border-white/10 transition-all">
                  Ver Portfólio
                </a>
              </div>
            </div>
          </section>

          {/* SEÇÃO NOSSOS SERVIÇOS */}
          <section id="servicos" className="py-24 bg-dark-card border-y border-dark-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-transparent to-brand-orange-light/10 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Nossos Serviços</h2>
                <p className="text-gray-400 text-lg">
                  Criamos soluções digitais que unem estratégia, design e tecnologia para gerar resultados reais e duradouros.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="group relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-orange-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Landing Pages</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">Focadas em conversão imediata, ideais para campanhas de tráfego pago e lançamentos de produtos.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-primary mr-2">✓</span> Design estratégico</li>
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-primary mr-2">✓</span> Otimização para SEO</li>
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-primary mr-2">✓</span> Mobile First</li>
                    </ul>
                    <a href="#contato" onClick={(e) => handleScrollTo(e, '#contato')} className="inline-flex items-center font-bold text-brand-orange-light hover:gap-2 transition-all cursor-pointer">
                      Solicitar orçamento <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="group relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-brand-purple/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-purple/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Portfólio Profissional</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">Sites elegantes para fortalecer sua autoridade e apresentar seus projetos com máxima credibilidade.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-purple mr-2">✓</span> Identidade Visual Única</li>
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-purple mr-2">✓</span> Galeria Dinâmica</li>
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-purple mr-2">✓</span> Performance Veloz</li>
                    </ul>
                    <a href="#contato" onClick={(e) => handleScrollTo(e, '#contato')} className="inline-flex items-center font-bold text-brand-orange-light hover:gap-2 transition-all cursor-pointer">
                      Solicitar orçamento <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="group relative bg-dark-card border border-white/5 rounded-2xl p-8 hover:border-brand-magenta/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-brand-magenta/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-magenta/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">UX / UI Design</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">Projetamos interfaces centradas no usuário, garantindo uma navegação intuitiva e inesquecível.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-magenta mr-2">✓</span> Prototipagem em Figma</li>
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-magenta mr-2">✓</span> Jornada do Usuário</li>
                      <li className="flex items-center text-sm text-gray-300"><span className="text-brand-magenta mr-2">✓</span> Design System</li>
                    </ul>
                    <a href="#contato" onClick={(e) => handleScrollTo(e, '#contato')} className="inline-flex items-center font-bold text-brand-orange-light hover:gap-2 transition-all cursor-pointer">
                      Solicitar orçamento <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO NOSSOS TRABALHOS */}
          <section id="trabalhos" className="py-24 bg-dark-bg border-y border-dark-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black/40 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Nosso <span className="text-brand-primary">Portfólio</span>
                </h2>
                <p className="text-gray-400">Uma amostra do que podemos construir para você.</p>
              </div>

              <div className="space-y-20">
                {/* Projeto 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="order-2 lg:order-1 group bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-brand-primary/30">
                    <div className="bg-neutral-800/50 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="mx-auto bg-black/20 rounded-md px-3 py-1 text-[10px] text-gray-500 font-mono w-1/2 text-center">
                        faiskapressao.com
                      </div>
                    </div>
                    <div className="relative overflow-hidden aspect-video">
                      <img src="images/projeto-raissa.png" alt="Projeto Raissa" className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 bg-brand-purple/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href="https://faiskapressao.com" target="_blank" rel="noreferrer" className="bg-white text-brand-purple px-6 py-2 rounded-full font-bold">Ver Site Oficial</a>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-4">
                    <span className="text-brand-primary font-bold tracking-widest text-xs uppercase">Web Design / Art</span>
                    <h3 className="text-3xl font-black text-white">Portfólio Artístico: Raíssa Alves</h3>
                    <p className="text-gray-400 leading-relaxed">Um site minimalista e focado na estética visual, desenvolvido para destacar obras de arte com alta performance e elegância.</p>
                  </div>
                </div>

                {/* Projeto 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                    <span className="text-brand-orange-light font-bold tracking-widest text-xs uppercase">Landing Page / Business</span>
                    <h3 className="text-3xl font-black text-white">Academia de Muay Thai</h3>
                    <p className="text-gray-400 leading-relaxed">Página de conversão estratégica criada para captação de novos alunos, com integração de formulários e design agressivo e moderno.</p>
                  </div>
                  <div className="group bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-brand-orange-light/30">
                    <div className="bg-neutral-800/50 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="mx-auto bg-black/20 rounded-md px-3 py-1 text-[10px] text-gray-500 font-mono w-1/2 text-center">
                        laura.github.io/muay-thai
                      </div>
                    </div>
                    <div className="relative overflow-hidden aspect-video">
                      <img src="images/muay-thai-thumb.png" alt="Muay Thai" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 bg-brand-orange-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href="https://laurafercordeiro.github.io/Muay-Thai/index.html" target="_blank" rel="noreferrer" className="bg-white text-brand-orange-dark px-6 py-2 rounded-full font-bold">Ver Projeto</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projeto 3 (Vídeo) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="order-2 lg:order-1 group bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
                    <div className="bg-neutral-800/80 px-4 py-3 flex items-center justify-between border-b border-white/5">
                      <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Video Showcase</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                      </div>
                    </div>
                    <div className="relative aspect-video bg-black">
                      <video className="w-full h-full object-cover" controls autoPlay muted loop>
                        <source src="/video/video.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-4">
                    <span className="text-brand-magenta font-bold tracking-widest text-xs uppercase">E-Commerce / Full Stack</span>
                    <h3 className="text-3xl font-black text-white">Site Institucional: Tearti</h3>
                    <p className="text-gray-400 leading-relaxed">Demonstração de uma plataforma completa de comércio eletrônico, com sistema de catálogo e interface focada na experiência de compra.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* SEÇÃO DUVIDAS */}
          <section id="duvidas" className="py-12 lg:py-24 bg-dark-card bg-gradient-to-br from-brand-purple/10 via-transparent to-brand-orange-light/10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                {/* Coluna da Esquerda: Título, Texto e Botões */}
                <div className="space-y-6 lg:space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-6xl font-black text-white leading-none tracking-tighter">
                      Perguntas <span className="text-brand-primary">Frequentes</span>
                    </h2>

                    <p className="text-white/70 text-sm lg:text-lg leading-relaxed max-w-lg">
                      Sabemos que contratar um serviço digital gera dúvidas. Por isso, reunimos aqui as perguntas mais comuns para deixar tudo claro antes de começarmos.
                    </p>
                  </div>

                  {/* Grid de Botões */}
                  <div className="grid grid-cols-12 gap-3 w-full lg:max-w-md">
                    {categorias.map((cat, index) => {
                      const isWide = index === 1 || index === 2;
                      const colSpan = isWide ? 'col-span-7' : 'col-span-5';

                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoriaAtiva(cat);
                            setPerguntaAberta(null);
                          }}
                          className={`${colSpan} py-3 lg:py-4 px-4 rounded-2xl font-bold text-xs lg:text-lg transition-all border ${categoriaAtiva === cat
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Coluna da Direita: Accordion / Perguntas */}
                <div className="space-y-3 lg:space-y-4">
                  {dadosFaq[categoriaAtiva].map((item, index) => {
                    const isOpen = perguntaAberta === index;

                    return (
                      <div
                        key={index}
                        // MUDANÇA AQUI: A cor de fundo e o hover agora ficam no container inteiro
                        className={`group rounded-2xl lg:rounded-3xl overflow-hidden border transition-all duration-300 ${isOpen
                          ? 'bg-white/10 border-white/20 shadow-lg' // Se aberto: cor de fundo ativa fixa
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' // Se fechado: cor normal + hover
                          }`}
                      >
                        <button
                          onClick={() => setPerguntaAberta(isOpen ? null : index)}
                          // REMOVI O HOVER DAQUI para não dar conflito
                          className="w-full p-5 lg:p-8 flex justify-between items-center text-left transition-colors"
                        >
                          <span className="text-white font-medium text-sm lg:text-xl pr-4 leading-tight">
                            {item.q}
                          </span>

                          <div className={`shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-brand-primary border-brand-primary' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {/* Wrapper da Animação */}
                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                            }`}
                        >
                          <div className="overflow-hidden">
                            {/* O texto herda o bg do pai, então fica uniforme */}
                            <div className="px-5 pb-5 lg:px-8 lg:pb-8 text-gray-400 text-xs lg:text-lg leading-relaxed">
                              {item.a}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>

          {/* SEÇÃO CONTATO */}
          <section id="contato" className="py-24 relative">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black mb-4">Vamos <span className="text-brand-primary">Conversar?</span></h2>
                <p class="text-gray-400 text-lg">
                  Estamos prontos para ouvir sobre sua próxima grande ideia. <br class="hidden md:block" />
                  Preencha o formulário e retornaremos em breve.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <form
                  onSubmit={handleFormSubmit} // Adicione isso
                  className="bg-dark-card/40 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative"
                >
                  {/* IMPORTANTE: Os inputs precisam do atributo "name" para o FormData funcionar */}
                  <input type="hidden" name="access_key" value="55fed33c-2c36-489a-8e94-a7dcc614d2ef" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome</label>
                      <input
                        name="name" // Adicionado
                        type="text"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-700 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-300 hover:border-white/20"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                      <input
                        name="email" // Adicionado
                        type="email"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-700 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-300 hover:border-white/20"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mensagem</label>
                    <textarea
                      name="message" // Adicionado
                      required
                      rows="4"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-700 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-300 hover:border-white/20"
                      placeholder="Como podemos ajudar?"
                    ></textarea>
                  </div>
                  <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-brand-orange-light to-brand-primary rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                    <button
                      type="submit"
                      className="relative w-full bg-gradient-to-r from-brand-orange-light to-brand-primary text-white font-black py-5 rounded-2xl text-lg tracking-wide shadow-xl transition-all duration-300 transform group-hover:scale-[1.01] active:scale-[0.98]"
                    >
                      Enviar Mensagem
                    </button>

                  </div>
                  <p class="text-center text-gray-600 text-[10px] mt-6 uppercase tracking-widest font-medium">
                    Resposta em menos de 24 horas úteis
                  </p>
                </form>
              </div>
            </div>
          </section>

        </main>

        <footer className="bg-black border-t border-white/10 py-8">
          <div className="container mx-auto text-center">
            <p className="text-gray-500">&copy; 2025 AmbaTech. Todos os direitos reservados.</p>
          </div>
        </footer>

      </div> {/* Fim do mainContainer */}
    </div>
  );
}