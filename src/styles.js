import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.backgroundColor || "#F7F7F7"};
    color: ${(props) => props.cursorColor || "#049878"};
    transition: background-color 0.6s ease-out, color 0.6s ease-out;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: #049878;
    color: white;
  }

  ::-moz-selection {
    background-color: #049878;
    color: white;
  }

  p {
    font-size: 16px;
    line-height: 1.4;
    margin: 0;
  }


  .grid-container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
  }
`;

export default GlobalStyle;
