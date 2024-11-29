import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Sketch } from './sketch.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sketch />
  </StrictMode>,
)
