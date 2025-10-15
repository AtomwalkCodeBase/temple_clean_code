import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&family=Dancing+Script:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
    font-family:"Poppins", sans-serif;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family:"Poppins", sans-serif;
    font-weight: 700;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Advanced Animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes glow {
    from { text-shadow: 0 0 20px #DAA520, 0 0 30px #DAA520, 0 0 40px #DAA520; }
    to { text-shadow: 0 0 30px #FF9933, 0 0 40px #FF9933, 0 0 50px #FF9933; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: linear-gradient(180deg, ${(props) =>
      props.theme.colors.lightGray}, ${(props) =>
  props.theme.colors.background});
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.gradient.primary};
    border-radius: 6px;
    border: 2px solid ${(props) => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.gradient.sunset};
  }

  /* Selection */
  ::selection {
    background: ${(props) => props.theme.colors.primary};
    color: white;
  }

  /* Utility Classes */
  .gradient-text {
    background: ${(props) => props.theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  .floating {
    animation: ${(props) => props.theme.animations.float};
  }

  .glowing {
    animation: ${(props) => props.theme.animations.glow};
  }
`;

export default GlobalStyles;
