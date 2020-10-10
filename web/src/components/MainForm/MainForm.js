import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { ChromePicker } from 'react-color'
import styled from 'styled-components'
import {
  Form,
  TextAreaField,
  SelectField,
  CheckboxField,
  FileField,
  NumberField,
  RangeField,
  Submit,
} from '@redwoodjs/forms'
import { useState } from 'react'

import Loader from 'src/components/Loader'

const Swatch = styled.div`
  padding: 5px;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
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

const uploadImage = async (file, callback) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unfolded')

  fetch('https://api.cloudinary.com/v1_1/dize5fvu6/image/upload', {
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
  const [loading, setLoading] = useState(true) //TODO
  const [mainPic, setMainPic] = useState()
  const [cornerPicture, setCornerPicture] = useState({
    name: 'default',
    id: 'unfolded/unfolded_logo',
    url: `https://res.cloudinary.com/${process.env.CLOUDINARY_BUCKET}/image/upload/v1602168983/Unfolded/unfolded_logo.jpg`,
    opacity: 70,
    placement: 'south_east',
  })
  const [innerBorder, setInnerBorder] = useState({
    enabled: true,
    size: 5,
    color: '#ffffff',
  })
  const [mainBorder, setMainBorder] = useState({
    enabled: true,
    size: 10,
    color: '#000000',
  })
  const [outerBorder, setOuterBorder] = useState({
    enabled: true,
    size: 20,
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
    setLoading(true)
    setInnerBorder({
      enabled: data.innerBorderEnabled,
      size: data.innerBorderSize,
      color: innerBorder.color,
    })
    setMainBorder({
      enabled: data.mainBorderEnabled,
      size: data.mainBorderSize,
      color: mainBorder.color,
    })
    setOuterBorder({
      enabled: data.outerBorderEnabled,
      size: data.outerBorderSize,
      color: outerBorder.color,
    })

    if (
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

    if (
      data.cornerPicture[0] &&
      (!cornerPicture || data.cornerPicture[0].name != cornerPicture.name)
    )
      uploadImage(data.cornerPicture[0], (name, publicId, url) => {
        setCornerPicture({
          name: name,
          id: publicId,
          url: url,
          opacity: data.cornerOpacity,
          placement: data.cornerPlacement,
        })
        setLoading(false)
      })
    else {
      setCornerPicture({
        name: cornerPicture.name,
        id: cornerPicture.id,
        url: cornerPicture.url,
        opacity: data.cornerOpacity,
        placement: data.cornerPlacement,
      })
    }
  }

  return (
    <>
      <CloudinaryContext cloudName={process.env.CLOUDINARY_BUCKET}>
        <Form onSubmit={onSubmit}>
          {/* <label htmlFor="message">Message</label>
        <TextAreaField name="message" /> */}
          <div>
            <h2>Image content</h2>
            <label htmlFor="mainPicture">File</label>
            <FileField
              id="mainPicture"
              name="mainPicture"
              className="hidden"
              validation={{
                required: true,
              }}
            />
            <button
              className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
              onClick={() => {
                document.getElementById('mainPicture').click()
              }}
            >
              Upload a file
            </button>
          </div>
          <div>
            <h2>Corner logo</h2>
            <label htmlFor="cornerPicture">File</label>
            <FileField
              id="cornerPicture"
              name="cornerPicture"
              className="hidden"
            />
            <button
              className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
              onClick={() => {
                document.getElementById('cornerPicture').click()
              }}
            >
              Upload a file
            </button>
            Preview
            <Image publicId={cornerPicture.id} width="150" crop="thumb" />
            <label htmlFor="cornerPlacement">Placement</label>
            <SelectField
              id="cornerPlacement"
              name="cornerPlacement"
              defaultValue={cornerPicture.placement}
              validation={{
                required: true,
              }}
            >
              <option value="south_east">Bottom right</option>
              <option value="north_east">Top right</option>
              <option value="south_west">Bottom left</option>
              <option value="north_west">Top left</option>
            </SelectField>
            <label htmlFor="cornerOpacity">Opacity</label>
            <RangeField
              id="cornerOpacity"
              name="cornerOpacity"
              defaultValue={cornerPicture.opacity}
            />
          </div>

          <div>
            <h3>Border sizes</h3>
            <div>
              <label htmlFor="innerBorderEnabled">Enabled</label>
              <CheckboxField
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
              />

              <label htmlFor="innerBorderSize">Inner</label>
              <NumberField
                id="innerBorderSize"
                name="innerBorderSize"
                min="0"
                defaultValue={innerBorder.size}
                validation={{
                  required: true,
                }}
              />

              <label htmlFor="innerBorderColor">Color</label>
              <div id="innerBorderColor" name="innerBorderColor">
                <Swatch
                  onClick={() =>
                    setColorPickerInnerBorderOpen(!colorPickerInnerBorderOpen)
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
              <label htmlFor="mainBorderEnabled">Enabled</label>
              <CheckboxField
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
              />

              <label htmlFor="mainBorderSize">Main</label>
              <NumberField
                id="mainBorderSize"
                name="mainBorderSize"
                min="0"
                defaultValue={mainBorder.size}
                validation={{
                  required: true,
                }}
              />

              <label htmlFor="mainBorderColor">Color</label>
              <div id="mainBorderColor" name="mainBorderColor">
                <Swatch
                  onClick={() =>
                    setColorPickerMainBorderOpen(!colorPickerMainBorderOpen)
                  }
                >
                  <SwatchColor color={mainBorder.color} />
                </Swatch>
                {colorPickerMainBorderOpen && (
                  <SwatchPopover>
                    <SwatchCover
                      onClick={() =>
                        setColorPickerMainBorderOpen(!colorPickerMainBorderOpen)
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

            <div>
              <label htmlFor="outerBorderEnabled">Enabled</label>
              <CheckboxField
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
              />

              <label htmlFor="outerBorderSize">Outer</label>
              <NumberField
                id="outerBorderSize"
                name="outerBorderSize"
                min="0"
                defaultValue={outerBorder.size}
                validation={{
                  required: true,
                }}
              />

              <label htmlFor="outerBorderColor">Color</label>
              <div id="outerBorderColor" name="outerBorderColor">
                <Swatch
                  onClick={() =>
                    setColorPickerOuterBorderOpen(!colorPickerOuterBorderOpen)
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
                        setMainBorder({
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

            <Submit>Generate Transform</Submit>
          </div>
        </Form>

        <div>
          {loading && <Loader />}
          {mainPic && !loading && (
            <Image publicId={mainPic.id}>
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
                height="150"
                overlay={cornerPicture.id.replace('/', ':')}
                width="150"
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
          )}
        </div>
      </CloudinaryContext>
    </>
  )
}

export default MainForm
