import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'

import { AppBar } from './components'

import Loading from './pages/Loading'

const Document = lazy(() => import('./pages/Document'))
const Documents = lazy(() => import('./pages/Documents'))
const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))

function App() {
  const [currentRoute, setCurrentRoute] = useState('/')
  return (
    <Router>
      {currentRoute !== '/login' && currentRoute !== '/register' ? (
        <AppBar />
      ) : (
        ''
      )}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={<Documents setCurrentRoute={setCurrentRoute} />}
          />
          <Route
            path="/documents"
            element={<Documents setCurrentRoute={setCurrentRoute} />}
          />
          <Route
            path="/document/:id"
            element={<Document setCurrentRoute={setCurrentRoute} />}
          />
          <Route
            path="/login"
            element={<Login setCurrentRoute={setCurrentRoute} />}
          />
          <Route
            path="/register"
            element={<Register setCurrentRoute={setCurrentRoute} />}
          />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
