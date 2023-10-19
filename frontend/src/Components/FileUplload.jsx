import React from 'react'
import { Form  } from 'react-bootstrap'


const FileUplload = ({handle}) => {
  return (
    <Form.Group >
    <Form.Label>
    </Form.Label>
    <Form.Control type="file"
    id='file-file'
    label='Choose File'
    onChange={handle} />
    </Form.Group>
  )
}

export default FileUplload