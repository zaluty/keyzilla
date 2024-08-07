"use client"
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import LogoImage from '../assets/icons/logo.svg';
import MenuIcon from '../assets/icons/menu.svg';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const Navbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="bg-black">
      <div className="px-4">
        <div className="container bg-black">
          <div className="py-4 flex items-center justify-between">

            <div className="relative">
              <Link href={"/"}>
                <div className='absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F7AABE,#B57CEC,#E472D1)] blur-md '></div>

                <LogoImage className="h-12 w-12 relative mt-1" />

              </Link>
            </div>

            {/* Mobile menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <div className="    h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden">
                  <MenuIcon className="text-white" />
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black">
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>About</a>
                  <a href="#Features" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Features</a>
                  <a href="#pricing" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Pricing</a>
                  <a href="#help" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Help</a>
                  <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Docs</a>
                  <SignedOut>
                    <SignInButton mode='modal'>
                      <button className='bg-white py-2 px-4 rounded-lg text-black' onClick={handleLinkClick}>Start for free</button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <button className='bg-white py-2 px-4 rounded-lg text-black' onClick={handleLinkClick}>Dashboard</button>
                    </Link>
                  </SignedIn>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop menu */}
            <nav className="text-white gap-6 items-center hidden sm:flex">
              <a href="" className='text-opacity-60 text-white hover:text-opacity-100 transition'>About</a>
              <a href="#Features" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Features</a>
              <a href="#pricing" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Pricing</a>
              <a href="#help" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Help</a>
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Docs</a>
              <SignedOut>
                <SignInButton mode='modal'>
                  <button className='bg-white py-2 px-4 rounded-lg text-black'>Start for free</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className='bg-white py-2 px-4 rounded-lg text-black'>Dashboard</button>
                </Link>
              </SignedIn>
            </nav>

          </div>
        </div>
      </div>
    </div >
  )
};