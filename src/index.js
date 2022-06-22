import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MoralisProvider } from 'react-moralis'
import NewPost from './components/NewPost'
import Home from './components/Home'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MoralisProvider
      appId="xstDCksGRBa48R82OMBuHv7mAZfV4CWtfsSyHBSK"
      serverUrl="https://wfadi11lk1u3.usemoralis.com:2053/server"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="NewPost" element={<NewPost />} />
          <Route path="Home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
