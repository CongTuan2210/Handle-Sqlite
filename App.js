import React from 'react'
import MainBottom from './src/MainNavigation'
import { AuthProvider } from './src/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <MainBottom/>
    </AuthProvider>
  )
}

export default App

