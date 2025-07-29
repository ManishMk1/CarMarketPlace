import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { getLoggedInUser } from '@/redux/slices/authSlice';
function Header() {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getLoggedInUser());
    },[dispatch])
    var [user,setUser]=useState();
  return (
    <div className='flex justify-between items-center shadow-sm p-5'>
        <img src={logo} width={150} height={100} alt="logo" />

        <ul className=' hidden md:flex justify-between items-center gap-16'>
            <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Search</li>
            <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Home</li>
            <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>New</li>
            <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Preowned</li>
        </ul>

        {user? 
        <div>
            <UserButton></UserButton>
            <Button>Submit  Listing<Listing></Listing></Button>

    </div>:
    <div>   
        <Button> Submit Listing</Button>
    </div>
}
  
  </div>
    )
}

export default Header