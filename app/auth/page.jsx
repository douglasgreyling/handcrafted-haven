'use client'

import { useState } from 'react'
import LoginForm from '../../components/LoginForm'
import SignupForm from '../../components/SignupForm'

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true)

  const handleSuccess = () => {
    window.location.href = '/'
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16 w-full">
          {showLogin ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToSignup={() => setShowLogin(false)}
            />
          ) : (
            <SignupForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
