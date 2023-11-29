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

  const borderColor = isEorror ? '#C70000' : '#538C01'
  const bgColor = isEorror ? '#FD7171' : '#E5FD78'
  const textColor = isEorror ? '#C70000' : '#538C01'

  const display = isSetTimer ? isVisible : true
  return (
    <>
      {display && (
        <div
          className={`flex justify-center items-center py-1 rounded border border-[${borderColor}] bg-[${bgColor}]`}
        >
          <p className={`text-[${textColor}] p-1 text-sm`}>{message}</p>
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
