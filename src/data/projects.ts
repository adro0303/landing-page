import type { Lang } from "@/lib/i18n";

export type Stat = { label: string; value: string };

export type ProjectCategory = "systems" | "security" | "data-ai" | "automation";

export type ProjectText = {
  tagline: string;
  what: string;
  built: string;
  learned: string;
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

export type DeviceProject = BaseProject & {
  kind: "device";
  link: { via: string };
  heartbeat: string;
  guarded: string[];
};

export type SecurityProject = BaseProject & {
  kind: "security";
  logLines: { text: string; flagged?: boolean }[];
};

export type GuardrailProject = BaseProject & {
  kind: "guardrail";
  stages: string[];
  retryLabel: string;
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
  | DeviceProject
  | SecurityProject
  | GuardrailProject
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
    what: "An anomaly detection pipeline that scans SSH login logs and flags suspicious activity — without needing pre-labeled examples of what an attack looks like.",
    built:
      "A config-driven pipeline (Isolation Forest, LOF, One-Class SVM) with temporal feature engineering, weak-label heuristics for evaluation, and PR-AUC / Recall@K as proxy metrics.",
    learned:
      "Learned to design an evaluation strategy when there's no ground truth to check against — accuracy alone means nothing when 99% of the data is normal traffic.",
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
      what: "Un pipeline de detección de anomalías que analiza logs de acceso SSH y marca actividad sospechosa — sin necesitar ejemplos pre-etiquetados de qué es un ataque.",
      built:
        "Un pipeline configurable (Isolation Forest, LOF, One-Class SVM) con ingeniería de features temporales, heurísticas de etiquetado débil para evaluación, y PR-AUC / Recall@K como métricas proxy.",
      learned:
        "Aprendí a diseñar una estrategia de evaluación cuando no hay ground truth con el que comparar — la accuracy sola no significa nada cuando el 99% de los datos es tráfico normal.",
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
    id: "quant-lab",
    index: 2,
    kind: "quant",
    category: "data-ai",
    title: "Quant Research Lab",
    tagline: "BSc final year project — can news predict returns, and can investor mandates beat a risk score?",
    what: "My BSc final year project — does daily macro news predict next-day ETF returns, and do investor risk profiles beat a single score?",
    built:
      "A PyTorch MLP vs. 5 classical baselines under strict walk-forward validation for the forecasting side; a Random Forest mandate predictor feeding a regime-aware, backtested ETF allocator on the portfolio side.",
    learned:
      "Learned to use strict walk-forward validation instead of a lucky train/test split — and to publish the result that didn't work instead of hiding it.",
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
      what: "Mi proyecto final de grado — ¿predicen las noticias macro diarias el retorno de ETFs al día siguiente, y superan los perfiles de riesgo de inversor a un único score?",
      built:
        "Un MLP en PyTorch frente a 5 baselines clásicos bajo validación walk-forward estricta para la parte de predicción; un predictor de mandato con Random Forest que alimenta un asignador de ETFs con backtesting sensible al régimen en la parte de cartera.",
      learned:
        "Aprendí a usar validación walk-forward estricta en vez de un split de train/test con suerte — y a publicar el resultado que no funcionó en vez de esconderlo.",
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
    index: 3,
    kind: "node-graph",
    category: "data-ai",
    title: "ai-tools",
    tagline:
      "Three interactive, zero-cost demos extracted from this site's hidden terminal — sorting, pathfinding, and a tiny neural net",
    what: "Three small interactive tools built into this site's own hidden terminal — a sorting-algorithm race, a pathfinding visualizer, and a digit recognizer backed by a neural network I trained myself.",
    built:
      "Three self-contained React components: a sorting-algorithm race (bubble/selection/merge/quick as real generators), an A*/Dijkstra pathfinding visualizer, and a digit recognizer backed by a tiny MLP trained offline with NumPy on scikit-learn's digits dataset (97% test accuracy) — all running 100% client-side.",
    learned:
      "Learned to train a small neural network from scratch with just NumPy, no PyTorch or TensorFlow — and shipped the weights so the 97.8% accuracy is checkable, not just claimed.",
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
      what: "Tres herramientas interactivas construidas en la terminal oculta de esta misma web — una carrera de algoritmos de ordenación, un visualizador de pathfinding, y un reconocedor de dígitos con una red neuronal que entrené yo mismo.",
      built:
        "Tres componentes de React autocontenidos: una carrera de algoritmos de ordenación (bubble/selection/merge/quick como generadores reales), un visualizador de pathfinding A*/Dijkstra, y un reconocedor de dígitos con un MLP diminuto entrenado offline con NumPy sobre el dataset de dígitos de scikit-learn (97% de precisión en test) — todo corriendo 100% en el cliente.",
      learned:
        "Aprendí a entrenar una red neuronal pequeña desde cero con solo NumPy, sin PyTorch ni TensorFlow — y publiqué los pesos para que el 97.8% de precisión se pueda comprobar, no solo afirmar.",
      role: "Desarrollo en solitario de las tres herramientas y el script de entrenamiento offline.",
      focus: "Prueba interactiva por encima de la descripción estática.",
      status: "Demos interactivas · extraído de la propia terminal de esta web",
    },
    nodes: ["sort_race.exe", "pathfinder.exe", "digit_recognizer.exe"],
  },
  {
    id: "overclaude",
    index: 4,
    kind: "hub",
    category: "systems",
    title: "overclaude",
    tagline: "Curates and wires up add-ons for Claude Code — without opening a single inbound port",
    what: "A curation layer for Claude Code add-ons I use daily — a codebase knowledge graph, on-demand internet access, and remote control from my phone over Telegram, all wired together myself.",
    built:
      "A curation layer for Claude Code add-ons: a codebase knowledge graph, on-demand internet access, remote control from mobile / Telegram, and custom notification hooks — all pull-based, nothing listening.",
    learned:
      "Learned to design for zero inbound exposure by default — every integration is pull-based, nothing listens for incoming connections, and the one feature that could nudge the user ships opt-in and off.",
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
      what: "Una capa de curación para add-ons de Claude Code que uso a diario — un grafo de conocimiento del código, acceso a internet bajo demanda, y control remoto desde el móvil por Telegram, todo conectado por mí.",
      built:
        "Una capa de curación para add-ons de Claude Code: un grafo de conocimiento del código, acceso a internet bajo demanda, control remoto desde móvil / Telegram, y hooks de notificación personalizados — todo por pull, nada escuchando.",
      learned:
        "Aprendí a diseñar con cero exposición entrante por defecto — cada integración funciona por pull, nada escucha conexiones entrantes, y la única función que podría interrumpir al usuario viene apagada por defecto.",
      role: "Diseño y desarrollo en solitario de la capa de curación.",
      focus: "Cero exposición entrante por encima de la comodidad.",
      status: "Desarrollo en solitario · creado el 19-08-2026",
    },
    modules: ["knowledge graph", "on-demand internet", "remote control", "notification hooks"],
  },
  {
    id: "simply-apply-firefox-autofill",
    index: 5,
    kind: "guardrail",
    category: "security",
    title: "SimplyApply + Firefox autofill",
    tagline: "Fork of an open-source résumé tailoring tool — added a Firefox extension and fixed a fabrication-guardrail security gap",
    what: "A Firefox extension I built on top of an existing open-source résumé tool, autofilling job applications directly on Greenhouse, Lever, and Workday.",
    built:
      "A Manifest V3 Firefox extension that autofills ATS pages (Greenhouse/Lever/Workday) from a local backend, a new cover-letter endpoint with the same fail-closed guardrail as résumé tailoring, plus a fix so the fabrication check covers contact fields too, and an auth token requirement on every extension-facing endpoint.",
    learned:
      "Ran a security review on someone else's codebase and found a real gap in its anti-fabrication guardrail — it checked your work history and skills but not your contact details. Fixed it and added auth to every extension-facing endpoint.",
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
    accent: "var(--color-amber)",
    es: {
      tagline: "Fork de una herramienta open-source de adaptación de CVs — añadí una extensión de Firefox y arreglé un fallo de seguridad en el guardrail anti-invención",
      what: "Una extensión de Firefox que construí sobre una herramienta open-source existente de adaptación de CVs, que autocompleta solicitudes de empleo directamente en Greenhouse, Lever y Workday.",
      built:
        "Una extensión de Firefox (Manifest V3) que autocompleta páginas de ATS (Greenhouse/Lever/Workday) desde un backend local, un nuevo endpoint de carta de presentación con el mismo diseño fail-closed que la adaptación de CV, más un fix para que la comprobación anti-invención cubra también los datos de contacto, y un token de autenticación obligatorio en cada endpoint de la extensión.",
      learned:
        "Hice una revisión de seguridad sobre el código de otra persona y encontré un fallo real en su guardrail anti-invención — comprobaba tu experiencia y habilidades pero no tus datos de contacto. Lo arreglé y añadí autenticación a cada endpoint expuesto a la extensión.",
      role: "Construí la extensión y los nuevos endpoints sobre un fork open-source existente; encontré y arreglé yo mismo el fallo de guardrail/autenticación.",
      focus: "Guardrails fail-closed — un falso positivo es molesto, un falso negativo te cuesta una oferta.",
      status: "Fork (AGPL-3.0) · pipeline original de artbyjazi/simply-apply",
    },
    stages: ["job posting", "tailor()", "guardrail check", "docx+pdf · apply"],
    retryLabel: "retry ×1 on fail",
  },
  {
    id: "pocket-server",
    index: 6,
    kind: "device",
    category: "automation",
    title: "pocket-server",
    tagline: "An old Android phone, de-Googled and rooted, into a 24/7 home server — no Raspberry Pi, no cloud bill",
    what: "An old Android phone, de-Googled and rooted, running as a 24/7 home server with a local LLM — no Raspberry Pi, no cloud bill.",
    built:
      "A spare phone running Termux + a local LLM, reachable only over a private Tailscale VPN — it sends Wake-on-LAN packets, drafts email replies, and reports through private Telegram bots, with a watchdog that checks its own health every 5 minutes.",
    learned:
      "Learned to build in safety rails for anything autonomous: the watchdog can check its own health and draft replies on its own, but nothing that shuts down a machine or sends an email fires without me confirming it first.",
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
      what: "Un móvil Android antiguo, sin Google y rooteado, funcionando como servidor doméstico 24/7 con un LLM local — sin Raspberry Pi, sin factura de nube.",
      built:
        "Un móvil de repuesto con Termux + un LLM local, accesible solo a través de una VPN privada con Tailscale — envía paquetes Wake-on-LAN, redacta respuestas de email y reporta por bots privados de Telegram, con un watchdog que revisa su propia salud cada 5 minutos.",
      learned:
        "Aprendí a construir barreras de seguridad para cualquier cosa autónoma: el watchdog puede comprobar su propia salud y redactar respuestas por su cuenta, pero nada que apague una máquina o envíe un email se dispara sin que yo lo confirme antes.",
      role: "Desarrollo en solitario: rooteo, configuración de VPN, integración del LLM local y las barreras de confirmación.",
      focus: "Cero coste de nube y cero puertos expuestos, con un humano siempre en el bucle.",
      status: "Repo más reciente · creado el 04-09-2026",
    },
    link: { via: "Tailscale VPN" },
    heartbeat: "watchdog · every 5 min",
    guarded: ["EMAIL_SEND", "REMOTE_SHUTDOWN"],
  },
  {
    id: "youtube-ai-pipeline",
    index: 7,
    kind: "node-graph",
    category: "data-ai",
    title: "youtube-ai-pipeline",
    tagline: "Local AI video pipeline: script → voice → character-consistent images → assembly",
    what: "A local pipeline that turns a script into a narrated video with character-consistent AI-generated scenes — script, voice, images, and final assembly, all running on my own hardware.",
    built:
      "n8n orchestrates a fully local flow: Kokoro TTS, ComfyUI (Krea2 Turbo + a style-reference LoRA) for character-consistent scene images, and an ffmpeg video-worker for assembly — no paid cloud services in the loop.",
    learned:
      "Learned to orchestrate four different AI stages with n8n and to work within real hardware limits instead of just renting more cloud GPU — and to document those limits honestly (6GB VRAM minimum, ~90s per image) instead of glossing over them.",
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
      what: "Un pipeline local que convierte un guion en un vídeo narrado con escenas generadas por IA con personaje consistente — guion, voz, imágenes y montaje final, todo corriendo en mi propio hardware.",
      built:
        "n8n orquesta un flujo totalmente local: Kokoro TTS, ComfyUI (Krea2 Turbo + una LoRA de referencia de estilo) para imágenes de escena con personaje consistente, y un video-worker con ffmpeg para el montaje — sin servicios de nube de pago en el proceso.",
      learned:
        "Aprendí a orquestar cuatro etapas de IA distintas con n8n y a trabajar dentro de límites reales de hardware en vez de simplemente alquilar más GPU en la nube — y a documentar esos límites con honestidad (6GB de VRAM mínimo, ~90s por imagen) en vez de disimularlos.",
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
    what: "A GitHub Actions workflow that builds unsigned iOS apps in the cloud on a macOS runner — no Mac, no $99/yr Apple Developer account needed.",
    built:
      "A GitHub Actions workflow that spins up a macOS runner to compile any Expo / React Native project, using scoped fine-grained tokens to securely check out a different target repo.",
    learned:
      "Learned to scope GitHub tokens tightly for secure cross-repo checkouts — this pipeline can build any target repo without ever holding more access than it needs.",
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
      what: "Un workflow de GitHub Actions que compila apps de iOS sin firmar en la nube usando un runner macOS — sin Mac, sin cuenta de Apple Developer de $99/año.",
      built:
        "Un workflow de GitHub Actions que levanta un runner macOS para compilar cualquier proyecto Expo / React Native, usando tokens de permisos acotados para hacer checkout de forma segura de otro repo destino.",
      learned:
        "Aprendí a acotar tokens de GitHub con precisión para hacer checkouts seguros entre repos — este pipeline puede compilar cualquier repo destino sin tener nunca más acceso del que necesita.",
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
];
