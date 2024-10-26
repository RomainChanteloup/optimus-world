import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Sketch } from './sketch.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sketch />
    {/* <App /> */}
  </StrictMode>,
)
