import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./themes/default"; 
import { GlobalStyle } from "./styles/global";
import { Router } from "./components/Router";
import { BrowserRouter } from "react-router-dom";

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      
      <GlobalStyle />
    </ThemeProvider>
  )
}
