import { Link, routes } from '@redwoodjs/router'
import styled from 'styled-components'

import MainForm from 'src/components/MainForm'

const Background = styled.div`
  /* background: radial-gradient(
    246% 106.6% at 50% 0%,
    #008ddd38 0%,
    #0075ff00 18.1%,
    #000347b3 100%
  ); */
`

const HomePage = () => {
  return (
    <Background className="w-full h-full flex justify-center items-center">
      <div className="bg-gray-100 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-300 sm:px-6">
          <h3 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            Unfolded Generator
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-700">
            Select your image and get it branded with your logo
          </p>
        </div>
        <MainForm className="p-8" />
      </div>
    </Background>
  )
}

export default HomePage
