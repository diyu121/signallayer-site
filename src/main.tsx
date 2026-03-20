import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import HealthcarePage from './HealthcarePage.tsx'

const siteVariant = (import.meta.env.VITE_SITE_VARIANT || 'property').toLowerCase()
const RootPage = siteVariant === 'healthcare' ? HealthcarePage : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)
