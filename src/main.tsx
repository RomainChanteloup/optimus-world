import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Test from './Test.tsx'
import './index.css'
import { Sketch } from './sketch.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sketch />
    {/* <Test /> */}
  </StrictMode>,
)
