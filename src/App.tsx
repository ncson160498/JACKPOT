import { useAddress } from '@thirdweb-dev/react';
import './App.css'
import Header from './components/Header';
import Login from './components/Login';


function App() {
  const address = useAddress();
  console.log(address);
  if(!address)
    return (<Login/>)
  return (
    <div className='bg-[#091818] min-h-screen flex flex-col'>
        <Header/>
    </div>
  );
}

export default App
