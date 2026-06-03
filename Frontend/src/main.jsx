import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'

const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.dataset.theme = savedTheme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  </StrictMode>,
)
