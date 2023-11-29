import React from 'react'

const LinkItem = ({ title, classProps, targetId, closeMenu }) => {
  const scrollToOnClick = (targetId) => {
    const targetSection = document.getElementById(targetId)
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' })

      if (closeMenu) {
        closeMenu()
      }
    }
  }
  return (
    <li
      className={`mx-4 cursor-pointer ${classProps}`}
      onClick={() => scrollToOnClick(targetId)}
    >
      {title}
    </li>
  )
}

export default LinkItem
