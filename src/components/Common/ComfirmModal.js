import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import HTMLReactParser from 'html-react-parser'
import { MODAL_ACTION_CONFIRM, MODAL_ACTION_CLOSE } from 'utilities/constants'

function ComfirmModal(props) {
  const { title, content, onActions, show } = props

  return (
    <>
      <Modal
        show={show}
        onHide={() => onActions('close')}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onActions(MODAL_ACTION_CLOSE)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onActions(MODAL_ACTION_CONFIRM)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ComfirmModal