import { useFlash } from '@redwoodjs/web'

const FlashMessageDisplay = ({ message }) => {
  const { dismissMessage } = useFlash()

  return (
    <>
      <div className="flex bg-red-300 max-w-sm mb-4 relative">
        <button
          onClick={() => dismissMessage(message.id)}
          className="float-right pt-2 pr-2 outline-none focus:outline-none absolute top-0 right-0 p-2"
        >
          <svg
            className="fill-current text-white "
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
        </button>
        <div className="w-16 bg-red-400">
          <div className="p-4">
            <svg
              className="h-8 w-8 text-white fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                d="M437.019 74.981C388.667 26.629 324.38 0 256 0S123.333 26.63 74.981 74.981 0 187.62 0 256s26.629 132.667 74.981 181.019C123.332 485.371 187.62 512 256 512s132.667-26.629 181.019-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.668-74.981-181.019zM256 470.636C137.65 470.636 41.364 374.35 41.364 256S137.65 41.364 256 41.364 470.636 137.65 470.636 256 374.35 470.636 256 470.636z"
                fill="#FFF"
              />
              <path
                d="M341.22 170.781c-8.077-8.077-21.172-8.077-29.249 0L170.78 311.971c-8.077 8.077-8.077 21.172 0 29.249 4.038 4.039 9.332 6.058 14.625 6.058s10.587-2.019 14.625-6.058l141.19-141.191c8.076-8.076 8.076-21.171 0-29.248z"
                fill="#FFF"
              />
              <path
                d="M341.22 311.971l-141.191-141.19c-8.076-8.077-21.172-8.077-29.248 0-8.077 8.076-8.077 21.171 0 29.248l141.19 141.191a20.616 20.616 0 0 0 14.625 6.058 20.618 20.618 0 0 0 14.625-6.058c8.075-8.077 8.075-21.172-.001-29.249z"
                fill="#FFF"
              />
            </svg>
          </div>
        </div>
        <div
          className="w-auto text-black opacity-75 items-center p-4"
          onClick={() => dismissMessage(message.id)}
        >
          <span className="text-lg font-bold pb-4">Error!</span>
          <p className="leading-tight">{message.text}</p>
        </div>
      </div>
    </>
  )
}

export default FlashMessageDisplay
