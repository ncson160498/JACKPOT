import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import './App.css'
import Header from './components/Header';
import Login from './components/Login';
import Loading from './components/Loading';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import CountdownTimer from './components/CountdownTimer';
import toast from 'react-hot-toast';
import Marquee from "react-fast-marquee";
import AdminControls from './components/AdminControls';
import currency from '../constants';
function App() {
  const address = useAddress();
  const [quantity,setQuantity]=useState<number>(1);
  const [userTickets,setUserTickets]=useState(0);
  const { contract } = useContract("0xfa13538f42E8D371E67E31Cf99532B687b68709C");
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission");
  const { data: expiration } = useContractRead(contract, "expiration");
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");
  const { data: tickets } = useContractRead(contract, "getTickets");
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", [address]);
  const { mutateAsync: WithdrawWinnings} = useContractWrite(contract, "WithdrawWinnings");
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount");
  const { data: lotteryOperator } = useContractRead(contract, "lotteryOperator");
  useEffect(()=>{
    if(!tickets) return;
    const totalTickets:string[]=tickets; 
    const noOfUserTickets=totalTickets.reduce(
      (total,ticketAddress)=>(ticketAddress === address?total+1:total),
      0
      );
    setUserTickets(noOfUserTickets);
  },[tickets,address])
  const handleClick = async () =>{
    if(!ticketPrice) return;
    const notify = toast.loading('Buying your tickets...');
    try {
      const totalPrice = Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity;
      console.log("Total Price:", totalPrice);
      const parsedTotalPrice = ethers.utils.parseEther(totalPrice.toString());
      console.log("Parsed Total Price:", parsedTotalPrice.toString());
      const data = await BuyTickets([parsedTotalPrice]);

     toast.success('Tickets purchased successfully!',{
      id:notify,
     });
     console.info("Contract call success",data);
    } catch (err) {
      console.error("contract call failure",err)
    }
  };
  const onWithdraWinnings=async ()=>{
    const notify=toast.loading("Withdrawing winnings...");
    try{
      const data=await WithdrawWinnings([{}]);
      toast.success('Winnings withdrawn successfully!',{
        id:notify,
      });
    }catch(err){
      toast.error('Something went wrong!',{
        id:notify,
      });

    }
  }
  if(!address) return (<Login/>);
  // if(isLoading) return <Loading/>
  return (
    <div className='bg-[#091818] min-h-screen flex flex-col'>
      <div className='flex-1'>
      <Header/>
      <Marquee className='bg-[#0A1F1C] p-5 mb-5'gradient={false} speed={100}>
        <div className='flex space-x-2 mx-10'>
          <h4 className='text-white font-bold'>Last Winner: {lastWinner?.toString()}</h4>
          <h4 className='text-white font-bold'>Previous winnings: {lastWinnerAmount&& ethers.utils.formatEther(lastWinnerAmount?.toString())} {currency}</h4>
        </div>
      </Marquee>
      {lotteryOperator === address && (
        <div className='flex justify-center'>
          <AdminControls/>
        </div>
      )}
      {winnings > 0 && (
        <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button onClick={onWithdraWinnings} className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
            <p className='font-bold'>Winner Winner Chicken Dinner!!!</p>
            <p>Total Winnings:{ethers.utils.formatEther(winnings.toString())}{' '} {currency}</p>
            <br />
            <p className='font-semibold'>Click here to withdraw</p>
          </button>
        </div>
      )}
        {/* the next draw box */}
        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>
            <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
            <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
                <h2 className='text-sm'>Total Pool</h2>
                <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}{' '}{currency}</p>
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
                  <p>{ticketPrice && ethers.utils.formatEther(ticketPrice?.toString())} {currency}</p>
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
                    <p>{ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())} {currency}</p>
                  </div>
                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>+ NetWork Fees</p>
                    <p>TBC</p>
                  </div>
                </div>
                <button
                disabled={expiration?.toString()<Date.now().toString() || remainingTickets?.toNumber()===0}
                onClick={handleClick}
                 className='mt-5 w-full bg-gradient-to-br from-orange-500 
                 to-emerald-600 px-10 py-5 rounded-md font-semibold
                 text-white shadow-xl disabled:from-gray-500
                  disabled:text-gray-100 disabled:to-gray-600 
                  disabled:cursor-not-allowed'>Buy {quantity} tickets for {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString()))*quantity} {' '} {currency}
                </button>
              </div>
              {userTickets > 0 && (
                <div className='stats'>
                  <p className='text-lg mb-2'>You have {userTickets} Tickets in this draw</p>
                  <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                    {Array(userTickets).fill('').map((_,index) => (
                      <p className='text-emerald-300 h-20 w-12
                      bg-emerald-500/30 rounded-lg flex flex-shrink-0
                      items-center justify-center text-xs italic' key={index}>{index+1}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* the price per ticker box */}
      </div>
    </div>
  );
}

export default App
