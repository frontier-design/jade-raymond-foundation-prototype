import { createGlobalStyle } from "styled-components";
import { GRID } from "./grid/config.js";

const colorOne = "#0ABE78";
const colorTwo = "#049878";
const colorThree = "#005E40";

const GlobalStyle = createGlobalStyle`
  /* Register custom properties so they can be animated */
  @property --color-heading { syntax: "<color>"; initial-value: ${colorOne}; inherits: true; }
  @property --color-body { syntax: "<color>"; initial-value: ${colorOne}; inherits: true; }
  @property --color-strong-bg { syntax: "<color>"; initial-value: ${colorOne}; inherits: true; }

  :root {
    --color-heading: ${colorOne};
    --color-body: ${colorOne};
    --color-strong-text: #fff;
    --color-strong-bg: ${colorOne};
    animation: colorLoop 15s ease-in-out infinite;
    animation-play-state: ${({ $loading }) => ($loading ? "paused" : "running")};
  }

  @keyframes colorLoop {
    0%, 100% {
      --color-heading: ${colorOne};
      --color-body: ${colorOne};
      --color-strong-bg: ${colorOne};
    }
    33.33% {
      --color-heading: ${colorTwo};
      --color-body: ${colorTwo};
      --color-strong-bg: ${colorTwo};
    }
    66.66% {
      --color-heading: ${colorThree};
      --color-body: ${colorThree};
      --color-strong-bg: ${colorThree};
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    /* font-weight: 100; */
  }

  html, body {
    overflow-x: hidden;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* Global typography – title and body */
  .title-type {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-weight: 800;
    font-size: 95px;
    line-height: 1;
    letter-spacing: -0.05em;
    color: var(--color-heading);
    word-break: normal;
    overflow-wrap: break-word;
  }

  @media (max-width: 1024px) {
    .title-type {
      font-size: 60px;
    }
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    .title-type {
      font-size: 2.5rem;
    }
  }

  .body-type {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-weight: 300;
    font-size: 1.2rem;
    line-height: 1.35;
    color: var(--color-body);

    @media (max-width: ${GRID.BREAKPOINT}) {
      font-size: 1rem;
    }
  }

  /* Global section header (e.g. About, Focus Areas) */
  .section-heading-type {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-weight: 350;
    font-size: clamp(1.25rem, 1.5vw, 1.5rem);
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: var(--color-heading);
    margin: 0;
  }
`;

export default GlobalStyle;
