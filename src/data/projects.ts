import type { Lang } from "@/lib/i18n";

export type Stat = { label: string; value: string };

export type ProjectCategory = "systems" | "security" | "data-ai" | "automation";

export type ProjectText = {
  tagline: string;
  problem: string;
  built: string;
  why: string;
  status: string;
  role: string;
  focus: string;
};

export type BaseProject = ProjectText & {
  id: string;
  index: number;
  title: string;
  category: ProjectCategory;
  tech: string[];
  stats: Stat[];
  href: string;
  accent: string;
  es: ProjectText;
};

export type PipelineProject = BaseProject & {
  kind: "pipeline";
  logLines: string[];
  stages: string[];
};

export type ControlPanelProject = BaseProject & {
  kind: "control-panel";
  switches: { label: string; state: "on" | "off" | "guarded" }[];
};

export type SecurityProject = BaseProject & {
  kind: "security";
  logLines: { text: string; flagged?: boolean }[];
};

export type QuantProject = BaseProject & {
  kind: "quant";
  tabs: {
    label: string;
    href: string;
    metrics: Stat[];
    bars: { label: string; value: number; highlight?: boolean }[];
    note: string;
  }[];
};

export type NodeGraphProject = BaseProject & {
  kind: "node-graph";
  nodes: string[];
};

export type HubProject = BaseProject & {
  kind: "hub";
  modules: string[];
};

export type Project =
  | PipelineProject
  | ControlPanelProject
  | SecurityProject
  | QuantProject
  | NodeGraphProject
  | HubProject;

export function localizeProject<T extends Project>(project: T, lang: Lang): T {
  if (lang !== "es") return project;
  return { ...project, ...project.es };
}

export const projects: Project[] = [
  {
    id: "ai-log-anomaly",
    index: 1,
    kind: "security",
    category: "security",
    title: "AI-LogAnomalyDetectionSystem",
    tagline: "Unsupervised anomaly detection over OpenSSH logs — no labeled attack data required",
    problem: 'In security logs, "normal" vastly outweighs "attack," and clean labels rarely exist.',
    built:
      "A config-driven pipeline (Isolation Forest, LOF, One-Class SVM) with temporal feature engineering, weak-label heuristics for evaluation, and PR-AUC / Recall@K as proxy metrics.",
    why: "Forces careful evaluation design when ground truth barely exists — accuracy alone would be meaningless here.",
    role: "End-to-end pipeline design and evaluation.",
    focus: "Defensible metrics when ground truth barely exists.",
    tech: ["Python", "scikit-learn", "Docker", "pytest", "GitHub Actions"],
    status: "Portfolio pipeline · not a production SOC system",
    stats: [
      { label: "Models", value: "IsoForest · LOF · OC-SVM" },
      { label: "Eval metric", value: "PR-AUC / Recall@K" },
      { label: "Labels", value: "weak / heuristic" },
    ],
    href: "https://github.com/adro0303/AI-LogAnomalyDetectionSystem",
    accent: "var(--color-red)",
    es: {
      tagline: "Detección de anomalías no supervisada sobre logs de OpenSSH — sin datos de ataque etiquetados",
      problem: 'En los logs de seguridad, lo "normal" supera con creces a los "ataques", y rara vez hay etiquetas limpias.',
      built:
        "Un pipeline configurable (Isolation Forest, LOF, One-Class SVM) con ingeniería de features temporales, heurísticas de etiquetado débil para evaluación, y PR-AUC / Recall@K como métricas proxy.",
      why: "Obliga a diseñar la evaluación con cuidado cuando apenas hay ground truth — la accuracy sola no significaría nada aquí.",
      role: "Diseño y evaluación del pipeline de principio a fin.",
      focus: "Métricas defendibles cuando apenas hay ground truth.",
      status: "Pipeline de portfolio · no es un sistema SOC en producción",
    },
    logLines: [
      { text: "sshd[10422]: Accepted publickey for deploy from 10.0.4.12" },
      { text: "sshd[10431]: Failed password for invalid user admin from 203.0.113.9", flagged: true },
      { text: "sshd[10433]: Failed password for invalid user admin from 203.0.113.9", flagged: true },
      { text: "sshd[10440]: Accepted publickey for adrian from 10.0.4.18" },
      { text: "sshd[10452]: Invalid user test from 198.51.100.4", flagged: true },
      { text: "sshd[10467]: Accepted publickey for deploy from 10.0.4.12" },
      { text: "sshd[10471]: Connection closed by 10.0.4.18" },
      { text: "sshd[10488]: Failed password for root from 198.51.100.4", flagged: true },
    ],
  },
  {
    id: "simply-apply-firefox-autofill",
    index: 2,
    kind: "security",
    category: "security",
    title: "SimplyApply + Firefox autofill",
    tagline: "Fork of an open-source résumé tailoring tool — added a Firefox extension and fixed a fabrication-guardrail security gap",
    problem:
      "The upstream tool's no-fabrication guardrail checked work history, education, and skills against your base résumé — but not name, email, phone, or URLs.",
    built:
      "A Manifest V3 Firefox extension that autofills ATS pages (Greenhouse/Lever/Workday) from a local backend, a new cover-letter endpoint with the same fail-closed guardrail as résumé tailoring, plus a fix so the fabrication check covers contact fields too, and an auth token requirement on every extension-facing endpoint.",
    why: "A security review I ran found that gap: a rogue browser extension or a poisoned job posting could have silently rewritten contact info or backend LLM settings. Same instinct as AI-LogAnomalyDetectionSystem — don't trust a plausible-looking output without checking it.",
    role: "Built the extension and new endpoints on top of an existing open-source fork; found and fixed the guardrail/auth gap myself.",
    focus: "Fail-closed guardrails — a false positive is annoying, a false negative costs you an offer.",
    tech: ["Python", "FastAPI", "TypeScript", "Firefox WebExtension", "SQLite"],
    status: "Fork (AGPL-3.0) · original pipeline by artbyjazi/simply-apply",
    stats: [
      { label: "Guardrail coverage", value: "contact + work + edu + skills" },
      { label: "Fabrication tolerance", value: "0" },
      { label: "Auth added", value: "X-SimplyApply-Token" },
    ],
    href: "https://github.com/adro0303/simply-apply-firefox-autofill",
    accent: "var(--color-magenta)",
    es: {
      tagline: "Fork de una herramienta open-source de adaptación de CVs — añadí una extensión de Firefox y arreglé un fallo de seguridad en el guardrail anti-invención",
      problem:
        "El guardrail anti-invención original comprobaba experiencia, estudios y habilidades contra tu CV base — pero no el nombre, email, teléfono ni URLs de contacto.",
      built:
        "Una extensión de Firefox (Manifest V3) que autocompleta páginas de ATS (Greenhouse/Lever/Workday) desde un backend local, un nuevo endpoint de carta de presentación con el mismo diseño fail-closed que la adaptación de CV, más un fix para que la comprobación anti-invención cubra también los datos de contacto, y un token de autenticación obligatorio en cada endpoint de la extensión.",
      why: "Una revisión de seguridad que hice encontró ese hueco: una extensión de navegador maliciosa o una oferta de empleo envenenada podían reescribir en silencio los datos de contacto o la configuración del LLM del backend. El mismo instinto que en AI-LogAnomalyDetectionSystem — no fiarse de una salida que parece correcta sin comprobarla.",
      role: "Construí la extensión y los nuevos endpoints sobre un fork open-source existente; encontré y arreglé yo mismo el fallo de guardrail/autenticación.",
      focus: "Guardrails fail-closed — un falso positivo es molesto, un falso negativo te cuesta una oferta.",
      status: "Fork (AGPL-3.0) · pipeline original de artbyjazi/simply-apply",
    },
    logLines: [
      { text: "guardrail: employer 'Authect' ✓ matches base résumé" },
      { text: "guardrail: skill 'PostgreSQL' ✓ present in base résumé" },
      { text: "guardrail: metric '40%' not found in base résumé", flagged: true },
      { text: "guardrail: basics.email 'attacker@evil.com' not found in base résumé", flagged: true },
      { text: "extension: POST /api/apply/8f2c/cover-letter — token verified" },
      { text: "extension: POST /api/jobs/adhoc — missing X-SimplyApply-Token", flagged: true },
      { text: "tailor: résumé regenerated, 0 fabrications, 1 retry" },
      { text: "output: resume.pdf + resume.docx written" },
    ],
  },
  {
    id: "quant-lab",
    index: 3,
    kind: "quant",
    category: "data-ai",
    title: "Quant Research Lab",
    tagline: "BSc final year project — can news predict returns, and can investor mandates beat a risk score?",
    problem:
      "Two linked questions: does daily macro news improve next-day ETF return forecasts, and do multi-dimensional investor mandates allocate better than a single risk score?",
    built:
      "A PyTorch MLP vs. 5 classical baselines under strict walk-forward validation for the forecasting side; a Random Forest mandate predictor feeding a regime-aware, backtested ETF allocator on the portfolio side.",
    why: "Both repos report the results that didn't work too, instead of only showing wins — the Markowitz baseline beats the mandate strategy on Sharpe.",
    role: "Independent research across two linked studies.",
    focus: "Forecasting rigor and honest reporting of what didn't work.",
    tech: ["Python", "PyTorch", "scikit-learn", "pandas"],
    status: "Coventry University BSc AI · Final Year Project",
    stats: [
      { label: "Targets", value: "15 ETFs + BTC" },
      { label: "Validation", value: "walk-forward" },
      { label: "Honesty", value: "reports the losses too" },
    ],
    href: "https://github.com/adro0303/macro-news-market-forecasting",
    accent: "var(--color-cyan)",
    es: {
      tagline: "Proyecto final de grado — ¿pueden las noticias predecir rendimientos, y pueden los mandatos de inversor superar un score de riesgo?",
      problem:
        "Dos preguntas ligadas: ¿mejoran las noticias macro diarias la predicción del retorno de ETFs al día siguiente, y asignan mejor los mandatos de inversor multidimensionales que un único score de riesgo?",
      built:
        "Un MLP en PyTorch frente a 5 baselines clásicos bajo validación walk-forward estricta para la parte de predicción; un predictor de mandato con Random Forest que alimenta un asignador de ETFs con backtesting sensible al régimen en la parte de cartera.",
      why: "Ambos repos también reportan los resultados que no funcionaron, no solo los éxitos — el baseline de Markowitz supera a la estrategia de mandato en Sharpe.",
      role: "Investigación independiente en dos estudios ligados.",
      focus: "Rigor en la predicción y reporte honesto de lo que no funcionó.",
      status: "Coventry University, Grado en IA · Proyecto Final de Grado",
    },
    tabs: [
      {
        label: "news → returns",
        href: "https://github.com/adro0303/macro-news-market-forecasting",
        metrics: [
          { label: "MLP directional acc.", value: "0.490" },
          { label: "MLP RMSE", value: "0.0320" },
          { label: "baseline_zero RMSE", value: "0.0114 (wins)" },
        ],
        bars: [
          { label: "mlp", value: 0.49, highlight: true },
          { label: "rf", value: 0.488 },
          { label: "knn", value: 0.486 },
          { label: "ridge", value: 0.467 },
          { label: "baseline_last", value: 0.344 },
        ],
        note: "~49% directional accuracy is close to random — reported as-is, not oversold.",
      },
      {
        label: "mandate allocation",
        href: "https://github.com/adro0303/mandate-investor-profiling-fyp",
        metrics: [
          { label: "Mandate model R²", value: "0.9967" },
          { label: "Mandate model MAE", value: "0.00107" },
          { label: "Model", value: "Random Forest" },
        ],
        bars: [
          { label: "markowitz", value: 1.15, highlight: true },
          { label: "mandate_regime", value: 0.95 },
          { label: "equal_weight", value: 0.92 },
          { label: "static_balanced", value: 0.91 },
        ],
        note: "Sharpe ratio by strategy — the rolling Markowitz benchmark wins this sample.",
      },
    ],
  },
  {
    id: "ai-tools",
    index: 4,
    kind: "node-graph",
    category: "data-ai",
    title: "ai-tools",
    tagline:
      "Three interactive, zero-cost demos extracted from this site's hidden terminal — sorting, pathfinding, and a tiny neural net",
    problem:
      "Static portfolio project cards don't prove you can build interactive, non-trivial UI — algorithms and a real trained model, not just describe them.",
    built:
      "Three self-contained React components: a sorting-algorithm race (bubble/selection/merge/quick as real generators), an A*/Dijkstra pathfinding visualizer, and a digit recognizer backed by a tiny MLP trained offline with NumPy on scikit-learn's digits dataset (97% test accuracy) — all running 100% client-side.",
    why: "The digit recognizer's training script and weights ship in the repo, so the accuracy claim is checkable, not just asserted — same honest-reporting habit as the other projects.",
    role: "Solo build of all three tools plus the offline training script.",
    focus: "Interactive proof over static description.",
    tech: ["TypeScript", "React", "NumPy", "scikit-learn"],
    status: "Interactive demos · extracted from this site's own terminal",
    stats: [
      { label: "Tools", value: "3" },
      { label: "Digit model accuracy", value: "97.8%" },
      { label: "API calls", value: "0" },
    ],
    href: "https://github.com/adro0303/ai-tools",
    accent: "var(--color-blue)",
    es: {
      tagline:
        "Tres demos interactivas y gratuitas, extraídas de la terminal oculta de esta web — ordenación, pathfinding y una red neuronal diminuta",
      problem:
        "Las tarjetas de proyecto estáticas no demuestran que sepas construir UI interactiva no trivial — algoritmos y un modelo entrenado de verdad, no solo describirlos.",
      built:
        "Tres componentes de React autocontenidos: una carrera de algoritmos de ordenación (bubble/selection/merge/quick como generadores reales), un visualizador de pathfinding A*/Dijkstra, y un reconocedor de dígitos con un MLP diminuto entrenado offline con NumPy sobre el dataset de dígitos de scikit-learn (97% de precisión en test) — todo corriendo 100% en el cliente.",
      why: "El script de entrenamiento y los pesos del reconocedor de dígitos van en el repo, así que la cifra de precisión se puede comprobar, no solo afirmar — la misma costumbre de reportar con honestidad que en los demás proyectos.",
      role: "Desarrollo en solitario de las tres herramientas y el script de entrenamiento offline.",
      focus: "Prueba interactiva por encima de la descripción estática.",
      status: "Demos interactivas · extraído de la propia terminal de esta web",
    },
    nodes: ["sort_race.exe", "pathfinder.exe", "digit_recognizer.exe"],
  },
  {
    id: "auto_applyer",
    index: 5,
    kind: "control-panel",
    category: "automation",
    title: "auto_applyer",
    tagline: "Local-first job-outreach automation that refuses to become a spam bot",
    problem: "Manual outreach doesn't scale, but full automation is how you burn your reputation.",
    built:
      "A CLI + Streamlit dashboard covering lead import, draft generation, manual approval, dry-run checks, rate-limited SMTP sending, and delivery reports.",
    why: 'Live sending requires AUTO_SEND_ENABLED=true and typing "SEND LIVE" — product thinking applied to a personal scripting problem.',
    role: "Full-stack build: CLI, dashboard, and guardrails.",
    focus: "Automation that still requires a human 'go'.",
    tech: ["Python", "Streamlit", "SMTP", "CLI design"],
    status: "Local-only · EN / ES dashboard UI",
    stats: [
      { label: "Confirmation", value: 'types "SEND LIVE"' },
      { label: "UI languages", value: "EN / ES" },
      { label: "Send mode", value: "rate-limited" },
    ],
    href: "https://github.com/adro0303/auto_applyer",
    accent: "var(--color-green)",
    es: {
      tagline: "Automatización local de búsqueda de empleo que se niega a convertirse en un bot de spam",
      problem: "El contacto manual no escala, pero la automatización total es la forma de quemar tu reputación.",
      built:
        "Un CLI + dashboard en Streamlit que cubre importación de leads, generación de borradores, aprobación manual, comprobaciones en modo simulado, envío por SMTP con límite de tasa, e informes de entrega.",
      why: 'El envío real requiere AUTO_SEND_ENABLED=true y escribir "SEND LIVE" — pensamiento de producto aplicado a un problema personal de scripting.',
      role: "Desarrollo full-stack: CLI, dashboard y barreras de seguridad.",
      focus: "Automatización que igual requiere un \"adelante\" humano.",
      status: "Solo local · interfaz de dashboard EN / ES",
    },
    switches: [
      { label: "DRY_RUN", state: "on" },
      { label: "AUTO_SEND_ENABLED", state: "off" },
      { label: "SEND LIVE", state: "guarded" },
    ],
  },
  {
    id: "pocket-server",
    index: 6,
    kind: "control-panel",
    category: "automation",
    title: "pocket-server",
    tagline: "An old Android phone, de-Googled and rooted, into a 24/7 home server — no Raspberry Pi, no cloud bill",
    problem:
      "Reaching a laptop remotely — waking it, checking email, watching markets — normally means buying and paying for always-on hardware.",
    built:
      "A spare phone running Termux + a local LLM, reachable only over a private Tailscale VPN — it sends Wake-on-LAN packets, drafts email replies, and reports through private Telegram bots, with a watchdog that checks its own health every 5 minutes.",
    why: "Every risky action — shutting down a machine, sending an email — needs an explicit human confirmation first, the same safety-first instinct as auto_applyer, applied to hardware instead of outreach.",
    role: "Solo build: rooting, VPN setup, local LLM integration, and the confirmation guardrails.",
    focus: "Zero cloud cost and zero exposed ports, with a human always in the loop.",
    tech: ["Android", "Termux", "Python", "local LLM", "Tailscale", "Telegram"],
    status: "Newest repo · created 2026-09-04",
    stats: [
      { label: "Cloud cost", value: "$0" },
      { label: "Exposed ports", value: "0" },
      { label: "Health check", value: "every 5 min" },
    ],
    href: "https://github.com/adro0303/pocket-server",
    accent: "var(--color-magenta)",
    es: {
      tagline:
        "Un móvil Android antiguo, sin Google y rooteado, convertido en servidor doméstico 24/7 — sin Raspberry Pi, sin factura de nube",
      problem:
        "Acceder a un portátil en remoto — despertarlo, revisar el correo, vigilar mercados — normalmente implica comprar y pagar hardware siempre encendido.",
      built:
        "Un móvil de repuesto con Termux + un LLM local, accesible solo a través de una VPN privada con Tailscale — envía paquetes Wake-on-LAN, redacta respuestas de email y reporta por bots privados de Telegram, con un watchdog que revisa su propia salud cada 5 minutos.",
      why: "Cada acción de riesgo — apagar una máquina, enviar un email — necesita confirmación humana explícita antes, el mismo instinto de seguridad que auto_applyer, aplicado esta vez al hardware en vez del outreach.",
      role: "Desarrollo en solitario: rooteo, configuración de VPN, integración del LLM local y las barreras de confirmación.",
      focus: "Cero coste de nube y cero puertos expuestos, con un humano siempre en el bucle.",
      status: "Repo más reciente · creado el 04-09-2026",
    },
    switches: [
      { label: "WATCHDOG", state: "on" },
      { label: "EMAIL_SEND", state: "guarded" },
      { label: "REMOTE_SHUTDOWN", state: "guarded" },
    ],
  },
  {
    id: "youtube-ai-pipeline",
    index: 7,
    kind: "node-graph",
    category: "data-ai",
    title: "youtube-ai-pipeline",
    tagline: "Local AI video pipeline: script → voice → character-consistent images → assembly",
    problem: "Generating narrated AI-image videos end-to-end without paying for cloud inference.",
    built:
      "n8n orchestrates a fully local flow: Kokoro TTS, ComfyUI (Krea2 Turbo + a style-reference LoRA) for character-consistent scene images, and an ffmpeg video-worker for assembly — no paid cloud services in the loop.",
    why: "Real hardware constraints, documented honestly instead of glossed over: 6GB VRAM minimum, ~30GB RAM peak, ~90s per image.",
    role: "Local orchestration across four AI stages.",
    focus: "Character-consistent generation on consumer hardware.",
    tech: ["n8n", "ComfyUI", "Kokoro TTS", "Docker Compose", "ffmpeg"],
    status: "Work in progress · most recently pushed repo",
    stats: [
      { label: "Min VRAM", value: "6 GB" },
      { label: "Peak RAM", value: "~30 GB" },
      { label: "Full run", value: "70 scenes / 1.5h+" },
    ],
    href: "https://github.com/adro0303/youtube-ai-pipeline",
    accent: "var(--color-amber)",
    es: {
      tagline: "Pipeline local de vídeo con IA: guion → voz → imágenes con personaje consistente → montaje",
      problem: "Generar vídeos narrados con imágenes de IA de principio a fin sin pagar por inferencia en la nube.",
      built:
        "n8n orquesta un flujo totalmente local: Kokoro TTS, ComfyUI (Krea2 Turbo + una LoRA de referencia de estilo) para imágenes de escena con personaje consistente, y un video-worker con ffmpeg para el montaje — sin servicios de nube de pago en el proceso.",
      why: "Limitaciones de hardware reales, documentadas con honestidad en vez de disimuladas: 6GB de VRAM mínimo, ~30GB de RAM en pico, ~90s por imagen.",
      role: "Orquestación local a través de cuatro etapas de IA.",
      focus: "Generación con personaje consistente en hardware de consumo.",
      status: "En progreso · repo con push más reciente",
    },
    nodes: ["script (70 scenes)", "n8n orchestrator", "Kokoro TTS", "ComfyUI · Krea2 + LoRA", "video-worker (ffmpeg)", "YouTube upload"],
  },
  {
    id: "ipa-builder",
    index: 8,
    kind: "pipeline",
    category: "systems",
    title: "ipa-builder",
    tagline: "Unsigned iOS builds in the cloud — no Mac, no $99/yr Apple Developer account",
    problem: "Testing your own iOS app normally means owning a Mac or paying Apple.",
    built:
      "A GitHub Actions workflow that spins up a macOS runner to compile any Expo / React Native project, using scoped fine-grained tokens to securely check out a different target repo.",
    why: "Pure CI/infrastructure engineering — no app code, just a secure, reusable build pipeline solving a real cost problem.",
    role: "CI/CD pipeline engineering, no app code.",
    focus: "Secure cross-repo builds without owning a Mac.",
    tech: ["GitHub Actions", "macOS runners", "Bash / YAML", "gh CLI"],
    status: "Open source · MIT · most recently active build pipeline",
    stats: [
      { label: "Build time", value: "10–15 min" },
      { label: "License", value: "MIT" },
      { label: "Artifact TTL", value: "14 days" },
    ],
    href: "https://github.com/adro0303/ipa-builder",
    accent: "var(--color-cyan)",
    es: {
      tagline: "Builds de iOS sin firmar en la nube — sin Mac, sin cuenta de Apple Developer de $99/año",
      problem: "Probar tu propia app de iOS normalmente implica tener un Mac o pagar a Apple.",
      built:
        "Un workflow de GitHub Actions que levanta un runner macOS para compilar cualquier proyecto Expo / React Native, usando tokens de permisos acotados para hacer checkout de forma segura de otro repo destino.",
      why: "Ingeniería pura de CI/infraestructura — sin código de app, solo un pipeline de build seguro y reutilizable que resuelve un problema de coste real.",
      role: "Ingeniería del pipeline de CI/CD, sin código de app.",
      focus: "Builds seguros entre repos sin tener un Mac.",
      status: "Open source · MIT · pipeline de build más activo recientemente",
    },
    stages: ["checkout target repo", "install deps", "expo prebuild", "xcodebuild (macOS runner)", "artifact .ipa"],
    logLines: [
      "$ gh workflow run build-ipa.yml -f repo=you/your-app",
      "[runner] macos-14 provisioned",
      "[checkout] cross-repo token scoped: contents:read",
      "[expo] prebuild ios ...",
      "[xcodebuild] Compiling 214 files",
      "[xcodebuild] BUILD SUCCEEDED",
      "[artifact] my-app-unsigned.ipa (14d TTL)",
      "[done] no Mac · no $99/yr account",
    ],
  },
  {
    id: "overclaude",
    index: 9,
    kind: "hub",
    category: "systems",
    title: "overclaude",
    tagline: "Curates and wires up add-ons for Claude Code — without opening a single inbound port",
    problem: "Every 'always-on' integration for an AI coding agent is also attack surface you didn't ask for.",
    built:
      "A curation layer for Claude Code add-ons: a codebase knowledge graph, on-demand internet access, remote control from mobile / Telegram, and custom notification hooks — all pull-based, nothing listening.",
    why: "The support-nudge feature ships opt-in and off by default — the whole design optimizes for zero inbound exposure over convenience.",
    role: "Solo design and build of the curation layer.",
    focus: "Zero inbound exposure over convenience.",
    tech: ["TypeScript", "MCP", "Telegram Bot API", "Node.js"],
    status: "Solo build · created 2026-08-19",
    stats: [
      { label: "Inbound ports", value: "0" },
      { label: "Support nudge", value: "off by default" },
      { label: "Remote control", value: "mobile / Telegram" },
    ],
    href: "https://github.com/adro0303/overclaude",
    accent: "var(--color-green)",
    es: {
      tagline: "Selecciona y conecta add-ons para Claude Code — sin abrir un solo puerto entrante",
      problem: "Cada integración 'siempre activa' para un agente de código con IA es también superficie de ataque que no pediste.",
      built:
        "Una capa de curación para add-ons de Claude Code: un grafo de conocimiento del código, acceso a internet bajo demanda, control remoto desde móvil / Telegram, y hooks de notificación personalizados — todo por pull, nada escuchando.",
      why: "El aviso de soporte se activa opt-in y viene desactivado por defecto — todo el diseño prioriza cero exposición entrante sobre la comodidad.",
      role: "Diseño y desarrollo en solitario de la capa de curación.",
      focus: "Cero exposición entrante por encima de la comodidad.",
      status: "Desarrollo en solitario · creado el 19-08-2026",
    },
    modules: ["knowledge graph", "on-demand internet", "remote control", "notification hooks"],
  },
];
