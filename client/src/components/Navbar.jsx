import { useState } from 'react'
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import LinkItem from './LinkItem'

import logo from '../images/logo.png'

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false)

  const navTitleList = ['Services', 'Transfer', 'Transactions']

  const closeMenu = () => {
    setToggleMenu(false)
  }

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      {/* logo */}
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>

      {/* nav links */}
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navTitleList.map((item, index) => (
          <LinkItem key={index} title={item} targetId={item.toLowerCase()} />
        ))}
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navTitleList.map((item, index) => (
              <>
                <LinkItem
                  key={item + index}
                  title={item}
                  classProps="my-2 text-lg"
                  targetId={item.toLowerCase()}
                  closeMenu={closeMenu}
                />
              </>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar
