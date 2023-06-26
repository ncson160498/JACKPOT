import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'

function Login() {
    const connectWithMetamask=useMetamask()
  return (
    <div className='bg-[#091818] min-h-screen flex flex-col items-center justify-center text-center'>
        <div className='flex flex-col items-center mb-10'>
            <img className='rounded-full h-56 wo-56 mb-10' 
            src="jackpotlogo.jpg" 
            alt="" />
            <h1 className='text-6xl text-white font-bold'>JACKPOT GAME</h1>
            <h2 className='text-white'>Get started by logging in with your MetaMask!!!</h2>
            <button onClick={connectWithMetamask} className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>Login with MetaMask</button>
        </div>
    </div>
  )
}

export default Login