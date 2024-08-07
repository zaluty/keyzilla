
import InstaIcon from '../assets/icons/insta.svg'
import XIcon from '../assets/icons/x-social.svg'
import LinkedInIcon from '../assets/icons/linkedin.svg'
import YoutubeIcon from '../assets/icons/youtube.svg'
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='py-5 bg-black text-white/60 border-t border-white/20'>
      <div className="container">
        <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
          <div className="text-center"> {currentYear} Keyzilla UI All rights are reserved</div>
          <ul className='flex justify-center gap-2.5'>
            <li><Link href="https://x.com"><XIcon /></Link></li>
            <li><Link href="https://linkedin.com"><LinkedInIcon /></Link></li>
            <li><Link href="https://instagram.com"><InstaIcon /></Link></li>
            <li><YoutubeIcon /></li>
          </ul>
        </div>

      </div>
    </footer>
  )
};
