'use client'

export default function Home() {
  const signIn = async () => {
    try {
      const response = await fetch('/api/auth/microsoft/sign-in')
      if (!response.ok) {
        throw new Error(`message: HTTP error, status: ${response.status}`)
      }
      const data = await response.json()
      window.location.href = data.redirect_url
    } catch (error) {
      console.error('An error occurred while retrieving data sign in:', error)
    }
  }

  return (
    <main>
      <button onClick={() => signIn()}>サインイン</button>
    </main>
  )
}
