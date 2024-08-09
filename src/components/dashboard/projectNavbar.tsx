"use client"
import { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from 'lucide-react';



const Navbar = ({ project }: any) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLinkClick = () => {
        setIsSheetOpen(false);
    };

    return (
        <div className="bg-black text-white md:bg-inherit lg:bg-inherit">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <p className='text-white text-xl font-bold' >{project.name}</p>
                <div className="flex items-center">

                    <nav className="hidden md:flex space-x-4 ml-4">
                        <Tabs defaultValue="overview" className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                                <TabsTrigger value="domains">Domains</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                                <TabsTrigger value="storage">Storage</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">Change your password here.</TabsContent>
                            <TabsContent value="integrations">Change your password here.</TabsContent>
                            <TabsContent value="domains">Change your password here.</TabsContent>
                            <TabsContent value="activity">Change your password here.</TabsContent>
                            <TabsContent value="monitoring">Change your password here.</TabsContent>
                            <TabsContent value="storage">Change your password here.</TabsContent>
                        </Tabs>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <SignInButton mode='modal'>
                            <button className='bg-white text-black py-2 px-4 rounded-lg'>Start for free</button>
                        </SignInButton>
                    </SignedOut>

                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <div className="md:hidden">
                                <MenuIcon className="h-6 w-6" />
                            </div>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="/overview" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Overview</Link>
                                <Link href="/integrations" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Integrations</Link>
                                <Link href="/activity" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Activity</Link>
                                <Link href="/domains" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Domains</Link>
                                <Link href="/usage" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Usage</Link>
                                <Link href="/monitoring" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Monitoring</Link>
                                <Link href="/storage" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Storage</Link>
                                <Link href="/ai" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>AI</Link>
                                <Link href="/settings" className='text-opacity-60 text-white hover:text-opacity-100 transition' onClick={handleLinkClick}>Settings</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};

export default Navbar;