import { useFlash } from '@redwoodjs/web'
import FlashMessageDisplay from '../FlashMessageDisplay/FlashMessageDisplay'

const FlashMessages = () => {
  // messages, an array of message objects
  const { messages } = useFlash()

  // if the messages array is empty
  // return nothing
  if (!messages.length) {
    return null
  }

  return (
    <>
      {messages.map((msg, i) => (
        <FlashMessageDisplay message={msg} key={i} />
      ))}
    </>
  )
}

export default FlashMessages
