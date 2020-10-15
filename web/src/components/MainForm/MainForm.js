import {
  Image,
  Transformation,
  CloudinaryContext,
  Placeholder,
} from 'cloudinary-react'
import { ChromePicker } from 'react-color'
import { useLocalStorage } from 'web-api-hooks'
import styled from 'styled-components'
import {
  Form,
  SelectField,
  CheckboxField,
  FileField,
  NumberField,
  RangeField,
  Submit,
} from '@redwoodjs/forms'
import { useFlash } from '@redwoodjs/web'
import { useState } from 'react'

import Loader from 'src/components/Loader'

const Swatch = styled.div`
  padding: 10px;
  background: rgb(237, 242, 247);
  border-radius: 1px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    background: rgb(226, 232, 240);
  }
`

const SwatchColor = styled.div`
  width: 36px;
  height: 14px;
  border-radius: 2px;
  background: ${(props) => props.color};
`

const SwatchPopover = styled.div`
  position: absolute;
  z-index: 2;
`

const SwatchCover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

const CheckBox = styled(CheckboxField)`
  &:checked + svg {
    display: block;
  }
`

const uploadImage = async (file, callback) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unfolded')

  fetch(`https://api.cloudinary.com/v1_1/dize5fvu6/image/upload`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.secure_url !== '') {
        callback(data.original_filename, data.public_id, data.secure_url)
      }
    })
    .catch((err) => console.error(err))
}

const MainForm = () => {
  const { addMessage } = useFlash()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalopen] = useState(false)
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false)
  const [mainPic, setMainPic] = useState()
  const [cornerPicture, setCornerPicture] = useLocalStorage('cornerPicture', {
    name: 'default',
    id: 'unfolded/text_logo',
    url: `https://res.cloudinary.com/dize5fvu6/image/upload/v1602764818/unfolded/text_logo.png`,
    opacity: 70,
    placement: 'south_east',
  })
  const [innerBorder, setInnerBorder] = useLocalStorage('innerBorder', {
    enabled: true,
    size: 20,
    color: '#ffffff',
  })
  const [mainBorder, setMainBorder] = useLocalStorage('mainBorder', {
    enabled: true,
    size: 10,
    color: '#000000',
  })
  const [outerBorder, setOuterBorder] = useLocalStorage('outerBorder', {
    enabled: true,
    size: 30,
    color: '#ffffff',
  })

  const [colorPickerInnerBorderOpen, setColorPickerInnerBorderOpen] = useState(
    false
  )
  const [colorPickerMainBorderOpen, setColorPickerMainBorderOpen] = useState(
    false
  )
  const [colorPickerOuterBorderOpen, setColorPickerOuterBorderOpen] = useState(
    false
  )

  const onSubmit = (data) => {
    if (!data.mainPicture || !data.mainPicture[0]) {
      addMessage('No Main Picture selected')
      return
    }
    if ((!data.cornerPicture || !data.cornerPicture[0]) && !cornerPicture.id) {
      addMessage('No Corner Picture selected')
      return
    }
    setModalopen(true)
    setLoading(true)

    setInnerBorder({
      enabled: data.innerBorderEnabled
        ? data.innerBorderEnabled
        : innerBorder.enabled,
      size: data.innerBorderSize ? data.innerBorderSize : innerBorder.size,
      color: innerBorder.color,
    })
    setMainBorder({
      enabled: data.mainBorderEnabled
        ? data.mainBorderEnabled
        : mainBorder.enabled,
      size: data.mainBorderSize ? data.mainBorderSize : mainBorder.size,
      color: mainBorder.color,
    })
    setOuterBorder({
      enabled: data.outerBorderEnabled
        ? data.outerBorderEnabled
        : outerBorder.enabled,
      size: data.outerBorderSize ? data.outerBorderSize : outerBorder.size,
      color: outerBorder.color,
    })

    if (
      data.cornerPicture &&
      data.cornerPicture[0] &&
      (!cornerPicture || data.cornerPicture[0].name != cornerPicture.name)
    )
      uploadImage(data.cornerPicture[0], (name, publicId, url) => {
        setCornerPicture({
          name: name,
          id: publicId,
          url: url,
          opacity: data.cornerOpacity
            ? data.cornerOpacity
            : cornerPicture.opacity,
          placement: data.cornerPlacement
            ? data.cornerPlacement
            : cornerPicture.placement,
        })
      })
    else {
      setCornerPicture({
        name: cornerPicture.name,
        id: cornerPicture.id,
        url: cornerPicture.url,
        opacity: data.cornerOpacity
          ? data.cornerOpacity
          : cornerPicture.opacity,
        placement: data.cornerPlacement
          ? data.cornerPlacement
          : cornerPicture.placement,
      })
    }

    if (
      data.mainPicture &&
      data.mainPicture[0] &&
      (!mainPic || data.mainPicture[0].name != mainPic.name)
    )
      uploadImage(data.mainPicture[0], (name, publicId, url) => {
        setMainPic({
          name: name,
          id: publicId,
          url: url,
        })
        setLoading(false)
      })
  }

  return (
    <>
      <CloudinaryContext cloudName="dize5fvu6">
        <Form onSubmit={onSubmit}>
          <div className="border-b border-gray-300 ">
            <div className="px-4 py-5 sm:px-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div>
                <h2 className="font-bold">Image content</h2>
                <div className="flex py-2">
                  <label htmlFor="cornerPlacement" className="text-gray-500">
                    File
                  </label>
                  <FileField
                    id="mainPicture"
                    name="mainPicture"
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="ml-auto rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                    onClick={() => {
                      document.getElementById('mainPicture').click()
                    }}
                  >
                    Upload a file
                  </button>
                </div>
              </div>
              <div className="relative cursor-pointer">
                <div
                  onClick={() => {
                    setAdvancedSettingsOpen(!advancedSettingsOpen)
                  }}
                  className="flex justify-end"
                >
                  <div className="text-sm text-gray-600 pr-8">
                    Advanced settings
                  </div>
                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      transform={advancedSettingsOpen ? 'rotate(180)' : ''}
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
              {advancedSettingsOpen && (
                <>
                  <div>
                    <h2 className="font-bold">Corner logo</h2>
                    <div className="flex py-2">
                      <label
                        htmlFor="cornerPlacement"
                        className="text-gray-500"
                      >
                        File
                      </label>
                      <FileField
                        id="cornerPicture"
                        name="cornerPicture"
                        className="hidden"
                      />
                      <button
                        type="button"
                        className="ml-auto rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                        onClick={() => {
                          document.getElementById('cornerPicture').click()
                        }}
                      >
                        Upload a file
                      </button>
                    </div>
                    <div>
                      <div className="flex border-t border-gray-300 py-2">
                        <label
                          htmlFor="cornerPlacement"
                          className="text-gray-500"
                        >
                          Preview
                        </label>
                        <span className="ml-auto shadow-lg">
                          <Image
                            publicId={cornerPicture.id}
                            width="100"
                            crop="thumb"
                          />
                        </span>
                      </div>
                    </div>

                    <div className="flex border-t border-gray-300 py-2">
                      <label
                        htmlFor="cornerPlacement"
                        className="text-gray-500"
                      >
                        Placement
                      </label>
                      <div className="ml-auto relative">
                        <SelectField
                          id="cornerPlacement"
                          name="cornerPlacement"
                          defaultValue={cornerPicture.placement}
                          className="rounded-sm appearance-none bg-gray-200 hover:bg-gray-300 focus:shadow-none pr-8 py-1 pl-3 cursor-pointer"
                        >
                          <option value="south_east">Bottom right</option>
                          <option value="north_east">Top right</option>
                          <option value="south_west">Bottom left</option>
                          <option value="north_west">Top left</option>
                          <option value="center">Center</option>
                        </SelectField>
                        <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="flex border-t border-gray-300 py-2">
                      <label htmlFor="cornerOpacity" className="text-gray-500">
                        Opacity
                      </label>
                      <RangeField
                        id="cornerOpacity"
                        name="cornerOpacity"
                        defaultValue={cornerPicture.opacity}
                        className="ml-auto w-32"
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="font-bold">Inner border</h2>
                    <div className="flex py-2">
                      <label
                        htmlFor="innerBorderEnabled"
                        className="text-gray-500"
                      >
                        Enabled
                      </label>
                      <div className="ml-auto bg-gray-200 rounded-sm hover:bg-gray-300 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                        <CheckBox
                          id="innerBorderEnabled"
                          name="innerBorderEnabled"
                          checked={innerBorder.enabled}
                          onChange={() => {
                            setInnerBorder({
                              enabled: !innerBorder.enabled,
                              size: innerBorder.size,
                              color: innerBorder.color,
                            })
                          }}
                          className="opacity-0 absolute"
                        />
                        <svg
                          className="fill-current hidden w-4 h-4 text-black pointer-events-none"
                          viewBox="0 0 20 20"
                        >
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex border-t border-gray-300 py-2">
                      <label
                        htmlFor="innerBorderSize"
                        className="text-gray-500"
                      >
                        Size
                      </label>
                      <NumberField
                        id="innerBorderSize"
                        name="innerBorderSize"
                        min="0"
                        defaultValue={innerBorder.size}
                        className="ml-auto bg-gray-200 rounded-sm hover:bg-gray-300 appearance-none w-16 pl-2"
                        disabled={!innerBorder.enabled}
                      />
                    </div>

                    <div className="flex border-t border-gray-300 py-2">
                      <label
                        htmlFor="innerBorderColor"
                        className="text-gray-500"
                      >
                        Color
                      </label>
                      <div
                        id="innerBorderColor"
                        name="innerBorderColor"
                        className="ml-auto"
                      >
                        <Swatch
                          onClick={() =>
                            setColorPickerInnerBorderOpen(
                              !colorPickerInnerBorderOpen
                            )
                          }
                        >
                          <SwatchColor color={innerBorder.color} />
                        </Swatch>
                        {colorPickerInnerBorderOpen && (
                          <SwatchPopover>
                            <SwatchCover
                              onClick={() =>
                                setColorPickerInnerBorderOpen(
                                  !colorPickerInnerBorderOpen
                                )
                              }
                            />
                            <ChromePicker
                              color={innerBorder.color}
                              onChangeComplete={(e) => {
                                setInnerBorder({
                                  enabled: innerBorder.enabled,
                                  size: innerBorder.size,
                                  color: e.hex,
                                })
                              }}
                            />
                          </SwatchPopover>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="font-bold">Main border</h2>
                      <div className="flex py-2">
                        <label
                          htmlFor="mainBorderEnabled"
                          className="text-gray-500"
                        >
                          Enabled
                        </label>
                        <div className="ml-auto bg-gray-200 rounded-sm hover:bg-gray-300 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                          <CheckBox
                            id="mainBorderEnabled"
                            name="mainBorderEnabled"
                            checked={mainBorder.enabled}
                            onChange={() => {
                              setMainBorder({
                                enabled: !mainBorder.enabled,
                                size: mainBorder.size,
                                color: mainBorder.color,
                              })
                            }}
                            className="opacity-0 absolute"
                          />
                          <svg
                            className="fill-current hidden w-4 h-4 text-black pointer-events-none"
                            viewBox="0 0 20 20"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                      </div>

                      <div className="flex border-t border-gray-300 py-2">
                        <label
                          htmlFor="mainBorderSize"
                          className="text-gray-500"
                        >
                          Size
                        </label>
                        <NumberField
                          id="mainBorderSize"
                          name="mainBorderSize"
                          min="0"
                          defaultValue={mainBorder.size}
                          className="ml-auto bg-gray-200 rounded-sm hover:bg-gray-300 appearance-none w-16 pl-2"
                          disabled={!mainBorder.enabled}
                        />
                      </div>

                      <div className="flex border-t border-gray-300 py-2">
                        <label
                          htmlFor="mainBorderColor"
                          className="text-gray-500"
                        >
                          Color
                        </label>
                        <div
                          id="mainBorderColor"
                          name="mainBorderColor"
                          className="ml-auto"
                        >
                          <Swatch
                            onClick={() =>
                              setColorPickerMainBorderOpen(
                                !colorPickerMainBorderOpen
                              )
                            }
                          >
                            <SwatchColor color={mainBorder.color} />
                          </Swatch>
                          {colorPickerMainBorderOpen && (
                            <SwatchPopover>
                              <SwatchCover
                                onClick={() =>
                                  setColorPickerMainBorderOpen(
                                    !colorPickerMainBorderOpen
                                  )
                                }
                              />
                              <ChromePicker
                                color={mainBorder.color}
                                onChangeComplete={(e) => {
                                  setMainBorder({
                                    enabled: mainBorder.enabled,
                                    size: mainBorder.size,
                                    color: e.hex,
                                  })
                                }}
                              />
                            </SwatchPopover>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-bold">Outer border</h2>
                      <div className="flex py-2">
                        <label
                          htmlFor="outerBorderEnabled"
                          className="text-gray-500"
                        >
                          Enabled
                        </label>
                        <div className="ml-auto bg-gray-200 rounded-sm hover:bg-gray-300 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                          <CheckBox
                            id="outerBorderEnabled"
                            name="outerBorderEnabled"
                            checked={outerBorder.enabled}
                            onChange={() => {
                              setOuterBorder({
                                enabled: !outerBorder.enabled,
                                size: outerBorder.size,
                                color: outerBorder.color,
                              })
                            }}
                            className="opacity-0 absolute"
                          />
                          <svg
                            className="fill-current hidden w-4 h-4 text-black pointer-events-none"
                            viewBox="0 0 20 20"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                      </div>

                      <div className="flex border-t border-gray-300 py-2">
                        <label
                          htmlFor="outerBorderSize"
                          className="text-gray-500"
                        >
                          Size
                        </label>
                        <NumberField
                          id="outerBorderSize"
                          name="outerBorderSize"
                          min="0"
                          defaultValue={outerBorder.size}
                          className="ml-auto bg-gray-200 rounded-sm hover:bg-gray-300 appearance-none appearance-textfield w-16 pl-2"
                          disabled={!outerBorder.enabled}
                        />
                      </div>

                      <div className="flex border-t border-gray-300 py-2">
                        <label
                          htmlFor="outerBorderColor"
                          className="text-gray-500"
                        >
                          Color
                        </label>
                        <div
                          id="outerBorderColor"
                          name="outerBorderColor"
                          className="ml-auto"
                        >
                          <Swatch
                            onClick={() =>
                              setColorPickerOuterBorderOpen(
                                !colorPickerOuterBorderOpen
                              )
                            }
                          >
                            <SwatchColor color={outerBorder.color} />
                          </Swatch>
                          {colorPickerOuterBorderOpen && (
                            <SwatchPopover>
                              <SwatchCover
                                onClick={() =>
                                  setColorPickerOuterBorderOpen(
                                    !colorPickerOuterBorderOpen
                                  )
                                }
                              />
                              <ChromePicker
                                color={outerBorder.color}
                                onChangeComplete={(e) => {
                                  setOuterBorder({
                                    enabled: outerBorder.enabled,
                                    size: outerBorder.size,
                                    color: e.hex,
                                  })
                                }}
                              />
                            </SwatchPopover>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex p-4 justify-end">
            <Submit
              className="bg-gray-800 hover:bg-gray-700 text-white focus:shadow-outline focus:outline-none font-bold rounded-md
              py-2 px-4 w-48
            transition ease-in-out duration-500"
            >
              Render image
            </Submit>
          </div>
        </Form>

        {modalOpen && (
          <div
            className="p-2 fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center bg-black bg-opacity-75"
            onClick={() => setModalopen(false)}
          >
            <div
              className="flex flex-col max-w-3xl max-h-full overflow-auto"
              onClick={() => setModalopen(false)}
            >
              {loading && <Loader />}
              {mainPic && !loading && (
                <>
                  <div className="z-50">
                    <button
                      onClick={() => setModalopen(false)}
                      className="float-right pt-2 pr-2 outline-none focus:outline-none"
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
                  </div>
                  <div className="p-2">
                    <Image publicId={mainPic.id}>
                      <Placeholder type="blur" />
                      {innerBorder.enabled && (
                        <Transformation
                          border={
                            innerBorder.size +
                            'px_solid_rgb:' +
                            innerBorder.color.replace('#', '')
                          }
                        />
                      )}
                      {mainBorder.enabled && (
                        <Transformation
                          border={
                            mainBorder.size +
                            'px_solid_rgb:' +
                            mainBorder.color.replace('#', '')
                          }
                        />
                      )}
                      <Transformation
                        gravity={cornerPicture.placement}
                        height="100"
                        overlay={cornerPicture.id.replace('/', ':')}
                        x="20"
                        y="20"
                        crop="pad"
                        opacity={cornerPicture.opacity}
                      />
                      {outerBorder.enabled && (
                        <Transformation
                          border={
                            outerBorder.size +
                            'px_solid_rgb:' +
                            outerBorder.color.replace('#', '')
                          }
                        />
                      )}
                    </Image>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CloudinaryContext>
    </>
  )
}

export default MainForm
