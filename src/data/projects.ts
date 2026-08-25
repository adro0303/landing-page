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
    id: "quant-lab",
    index: 1,
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
    id: "overclaude",
    index: 2,
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
    status: "Newest repo · created 2026-08-19",
    stats: [
      { label: "Inbound ports", value: "0" },
      { label: "Support nudge", value: "off by default" },
      { label: "Remote control", value: "mobile / Telegram" },
    ],
    href: "https://github.com/adro0303/overclaude",
    accent: "var(--color-magenta)",
    es: {
      tagline: "Selecciona y conecta add-ons para Claude Code — sin abrir un solo puerto entrante",
      problem: "Cada integración 'siempre activa' para un agente de código con IA es también superficie de ataque que no pediste.",
      built:
        "Una capa de curación para add-ons de Claude Code: un grafo de conocimiento del código, acceso a internet bajo demanda, control remoto desde móvil / Telegram, y hooks de notificación personalizados — todo por pull, nada escuchando.",
      why: "El aviso de soporte se activa opt-in y viene desactivado por defecto — todo el diseño prioriza cero exposición entrante sobre la comodidad.",
      role: "Diseño y desarrollo en solitario de la capa de curación.",
      focus: "Cero exposición entrante por encima de la comodidad.",
      status: "Repo más reciente · creado el 19-08-2026",
    },
    modules: ["knowledge graph", "on-demand internet", "remote control", "notification hooks"],
  },
  {
    id: "ai-log-anomaly",
    index: 3,
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
    id: "ipa-builder",
    index: 4,
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
    accent: "var(--color-blue)",
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
    id: "youtube-ai-pipeline",
    index: 6,
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
];
