import { Link, routes } from '@redwoodjs/router'
import styled from 'styled-components'

import MainForm from 'src/components/MainForm'
import FlashMessages from 'src/components/FlashMessages/FlashMessages'

const HomePage = () => {
  return (
    <>
      <div className="absolute right-0 top-0 w-full sm:w-1/5 p-5">
        <FlashMessages />
      </div>
      <div className="flex justify-center items-center sm:p-12 ">
        <div className="bg-gray-100 shadow-2xl overflow-hidden sm:rounded-lg sm:w-1/2 w-full">
          <div className="px-4 py-5 border-b border-gray-300 sm:px-6">
            <h3 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-800 sm:text-4xl sm:leading-10">
              Unfolded Generator
            </h3>
            <p className="mt-1 max-w-2xl text-base leading-6 text-gray-700">
              Select your image and get it branded with your logo
            </p>
          </div>
          <MainForm />
        </div>
      </div>
    </>
  )
}

export default HomePage
