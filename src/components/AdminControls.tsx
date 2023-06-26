import React from 'react'
import {
    StarIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ArrowUturnDownIcon
} from "@heroicons/react/24/solid"
import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import currency from '../../constants';
import { toast } from 'react-hot-toast';

function AdminControls() {
    const { contract } = useContract("0xfa13538f42E8D371E67E31Cf99532B687b68709C");
    const { data: operatorTotalCommission } = useContractRead(contract, "operatorTotalCommission");
    const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll")
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw")
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");
    const drawWinner = async () => {
        const notify = toast.loading("Picking a lucky winner...");
        try{
            const data = await DrawWinnerTicket([{}])
            toast.success('A Winner has been selected!',{
                id:notify,
            });
            
        }catch(err){
            toast.error("Some thing went wrong!",{
                id:notify,
            });
        }
    }
    const onWithdrawCommission  = async () => {
        const notify = toast.loading("Withdrawing the commission...");
        try{
            const data = await WithdrawCommission([{}])
            toast.success("Commission has been withdrawn successfully!",{
                id:notify,
            });
            
        }catch(err){
            toast.error("Some thing went wrong!",{
                id:notify,
            });
        }
    }
    const onRestartDraw  = async () => {
        const notify = toast.loading("Restarting the draw...");
        try{
            const data = await restartDraw([{}]);
            toast.success("Draw restarted successfully!",{
                id:notify,
            });
            
        }catch(err){
            toast.error("Some thing went wrong!",{
                id:notify,
            });
        }
    }
    const onRefundAll  = async () => {
        const notify = toast.loading("Refunding all...");
        try{
            const data = await RefundAll([{}])
            toast.success("All refunded successfully!",{
                id:notify,
            });
            
        }catch(err){
            toast.error("Some thing went wrong!",{
                id:notify,
            });
        }
    }
    return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
        <h2 className='font-bold'>
            Admin Controls
        </h2>
        <p className='mb-5'>
            Total Commission to be withdraw: {' '}
            {operatorTotalCommission && ethers.utils.formatEther(operatorTotalCommission?.toString())}{' '}{currency}
        </p>
        <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button onClick={drawWinner} className='admin-button'>
                <StarIcon className='h-6 mx-auto mb-2' />
                Draw Winner</button>
            <button onClick={onWithdrawCommission} className='admin-button'>
                <CurrencyDollarIcon className='h-6 mx-auto mb-2'/>
                Withdraw Commission</button>
            <button onClick={onRestartDraw} className='admin-button'>
                <ArrowPathIcon className='h-6 mx-auto mb-2'/>
                Restart Draw</button>
            <button onClick={onRefundAll} className='admin-button'>
                <ArrowUturnDownIcon className='h-6 mx-auto mb-2'/>
                Refund All</button>
        </div>
    </div>
  )
}

export default AdminControls