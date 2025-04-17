import Head from 'next/head'
import { useEffect, useState } from 'react'
import GameCanvas from '@/components/GameCanvas'
import GameMenu from '@/components/ui/GameMenu'

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  
  // Prevent scrolling on mobile devices
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault()
    document.addEventListener('touchmove', preventDefault, { passive: false })
    
    return () => {
      document.removeEventListener('touchmove', preventDefault)
    }
  }, [])
  
  return (
    <>
      <Head>
        <title>Sky Jumpers: The Battle Above the Blocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex min-h-screen flex-col items-center justify-center">
        {gameStarted ? (
          <GameCanvas />
        ) : (
          <GameMenu onStart={() => setGameStarted(true)} />
        )}
      </main>
    </>
  )
} 