import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const AlertMessage = ({ message, isEorror, isSetTimer }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const divErrorStyle =
    'flex justify-center items-center py-1 rounded border border-[#C70000] bg-[#FD7171]'
  const divSuccessStyle =
    'flex justify-center items-center py-1 rounded border border-[#538C01] bg-[#E5FD78]'
  const textErrorStyle = 'text-[#C70000] p-1 text-sm'
  const textSuccessStyle = 'text-[#538C01] p-1 text-sm'

  const display = isSetTimer ? isVisible : true
  return (
    <>
      {display && (
        <div className={isEorror ? divErrorStyle : divSuccessStyle}>
          <p className={isEorror ? textErrorStyle : textSuccessStyle}>
            {message}
          </p>
        </div>
      )}
    </>
  )
}

AlertMessage.propTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  isSetTimer: PropTypes.bool,
}

AlertMessage.defaultProps = {
  isError: false,
  isSetTimer: true,
}

export default AlertMessage
