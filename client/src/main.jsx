import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from "react-router-dom"
import App from './App.jsx'
import './cssstyles/index.css'
import './cssstyles/layer.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
)
