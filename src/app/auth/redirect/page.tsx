'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthRedirectHome() {
  const params = useSearchParams()
  const [state, setState] = useState({
    username: '',
    jwt: ''
  })
  const [code] = useState(params.get('code'))
  useEffect(() => {
    (async () => {
      try {
        const url = '/api/auth/microsoft/verify'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
          })
        })
        if (!response.ok) {
          throw new Error(`message: HTTP error, status: ${response.status}`)
        }
        const data = await response.json()
        setState({ username: data.account.username, jwt: data.accessToken })
      } catch (error) {
        console.error('An error occurred while retrieving data verify:', error)
      }
    })()
  }, [code])

  return (
    <>
      <div>
        username: {state.username}
      </div>
      <div>
        jwt: {state.jwt}
      </div>
    </>
  )
}
