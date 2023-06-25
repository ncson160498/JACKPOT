import { useContract, useContractRead } from '@thirdweb-dev/react';
import React from 'react'
import Countdown from 'react-countdown';

type Props={
    hours:number;
    minutes:number;
    seconds:number;
    completed:boolean;
};
function CountdownTimer() {
    const { contract } = useContract("0xfa13538f42E8D371E67E31Cf99532B687b68709C");
    const { data: expiration,data: isLoadingExpiration } = useContractRead(contract, "expiration");
    const renderer=({hours, minutes, seconds,completed}:Props)=>{
        // eslint-disable-next-line no-constant-condition
        if(completed){
            return(
            <div>
                <h2 className='text-white text-lg text-center animate-bounce'>
                    Ticket Sales have now CLOSED for this draw
                </h2>
                <div className='flex space-x-6'>
                   <div className='flex-1 space-x-'>
                        <div className='countdown animate-pulse'>{hours}</div>
                        <div className='countdown-label'>hours</div>
                   </div>

                   <div className='flex-1'>
                        <div className='countdown animate-pulse'>{minutes}</div>
                        <div className='countdown-label'>minutes</div>
                   </div>

                   <div className='flex-1'>
                        <div className='countdown animate-pulse'>{seconds}</div>
                        <div className='countdown-label'>seconds</div>
                   </div>
                </div>
            </div>
            );
        }
        else{
            return(
            <div>
                <h3 className='text-white text-sm mb-2 italic'>Time Remaining</h3>
                <div className='flex space-x-6'>
                   <div className='flex-1'>
                        <div className='countdown animate-pulse'>{hours}</div>
                        <div className='countdown-label'>hours</div>
                   </div>

                   <div className='flex-1'>
                        <div className='countdown animate-pulse'>{minutes}</div>
                        <div className='countdown-label'>minutes</div>
                   </div>

                   <div className='flex-1'>
                        <div className='countdown animate-pulse'>{seconds}</div>
                        <div className='countdown-label'>seconds</div>
                   </div>
                </div>
            </div>
            )
        }
    };
    return (
        <div>
            <Countdown date={new Date(expiration*1000)} renderer={renderer}/>
        </div>
  )
}
export default CountdownTimer