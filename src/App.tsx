import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import './App.css'
import Header from './components/Header';
import Login from './components/Login';
import Loading from './components/Loading';
import { useState } from 'react';
import { ethers } from 'ethers';
import CountdownTimer from './components/CountdownTimer';
import toast from 'react-hot-toast';


function App() {
  const address = useAddress();
  const [quantity,setQuantity]=useState<number>(1);
  const { contract } = useContract("0xfa13538f42E8D371E67E31Cf99532B687b68709C");
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission")
  const { data: expiration } = useContractRead(contract, "expiration");
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");
  const handleClick = async () =>{
    if(!ticketPrice) return;
    const notify = toast.loading('Buying your tickets...');
    try {
     const data=await BuyTickets([
      {
        value: ethers.utils.parseEther(
          (
            Number(ethers.utils.formatEther(ticketPrice)) * quantity
          ).toString()
        )
      },
     ]);
     toast.success('Tickets purchased successfully!',{
      id:notify,
     });
     console.info("Contract call success",data);
    } catch (err) {
      console.error("contract call failure",err)
    }
  };
  if(!address) return (<Login/>);
  // if(isLoading) return <Loading/>
  return (
    <div className='bg-[#091818] min-h-screen flex flex-col'>
      <div className='flex-1'>
      <Header/>
        {/* the next draw box */}
        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>
            <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
            <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
                <h2 className='text-sm'>Total Pool</h2>
                <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}{' '}MATIC</p>
              </div>
              <div className='stats'>
                  <h2 className='text-sm'>Tickets Remaining</h2>
                  <p className='text-xl'>{remainingTickets?.toNumber()}</p>
              </div>
          </div>
          {/* Countdown time */}
          <div className='mt-5 mb-3'>
              <CountdownTimer/>
          </div>
        </div>
        <div>
            <div className="stats-container space-y-2">
              <div className="stats-container">
                <div className='flex justify-between items-center text-white pb-2'>
                  <h2 className=''>
                    Price per ticker 
                  </h2>
                  <p>{ticketPrice && ethers.utils.formatEther(ticketPrice?.toString())} MATIC</p>
                </div>
                <div className='flex text-white items-center space-x-2 bg-[#091818] border-[#004337] border p-4'>
                  <p>TICKETS</p>
                  <input className='flex w-full bg-transparent text-right outline-none' 
                  type="number" 
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={e=>setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className='space-y-2 mt-5'>
                  <div className='flex items-center justify-between text-emerald-300 text-xs italic font-extrabold'>
                    <p>Total cost of tickets</p>
                    <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString()))*quantity}</p>
                  </div>
                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>Service fees</p>
                    <p>{ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())} MATIC</p>
                  </div>
                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>+ NetWork Fees</p>
                    <p>TBC</p>
                  </div>
                </div>
                <button
                disabled={expiration?.toString()<Date.now().toString() || remainingTickets?.toNumber()===0}
                onClick={handleClick}
                 className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-500 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed'>Buy tickets</button>
              </div>
            </div>
          </div>
        </div>
        {/* the price per ticker box */}
        <div></div>
      </div>
    </div>
  );
}

export default App
