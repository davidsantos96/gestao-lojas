import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --c-bg: ${props => props.theme.colors.bg};
    --c-surface: ${props => props.theme.colors.surface};
    --c-s2: ${props => props.theme.colors.s2};
    --c-s3: ${props => props.theme.colors.s3};
    --c-border: ${props => props.theme.colors.border};
    --c-b2: ${props => props.theme.colors.b2};
    --c-accent: ${props => props.theme.colors.accent};
    --c-accentD: ${props => props.theme.colors.accentD};
    --c-blue: ${props => props.theme.colors.blue};
    --c-blueD: ${props => props.theme.colors.blueD};
    --c-red: ${props => props.theme.colors.red};
    --c-yellow: ${props => props.theme.colors.yellow};
    --c-purple: ${props => props.theme.colors.purple};
    --c-text: ${props => props.theme.colors.text};
    --c-muted: ${props => props.theme.colors.muted};
    --c-muted2: ${props => props.theme.colors.muted2};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    width: 100%;
    height: 100%;
  }

  body {
    background: var(--c-bg);
    color: var(--c-text);
    transition: background 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--c-bg);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--c-border);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--c-muted);
  }

  /* ─── Print: módulo de Relatórios ───────────────────────────── */
  @media print {
    [data-print-hide] { display: none !important; }
    [data-print-expand] { width: 100% !important; margin-left: 0 !important; }
    body { background: #fff !important; color: #000 !important; }
  }
`;
