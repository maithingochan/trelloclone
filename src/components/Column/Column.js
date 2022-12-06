
import React, { useEffect, useState, useCallback, useRef } from 'react'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sort'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'
import ComfirmModal from 'components/Common/ComfirmModal'
import { MODAL_ACTION_CONFIRM, MODAL_ACTION_CLOSE } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'


export default function Column(props) {

  const poiterRef = useRef('')

  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])
  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  const onComfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      //remove column
      const newColumn = {
        ...column, //
        _destroy:true
      }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmModal()
  }
  
  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column, //
      title: columnTitle
    }
    onUpdateColumn(newColumn)
  }
  const handleCusor = (poiterRef) => {
    poiterRef.current.style.cursor = 'move'
  }
  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            ref={poiterRef}
            className="trello-content-editable"
            value={columnTitle}
            spellCheck="false" // xoa check chinh ta
            onClick={e => selectAllInlineText(poiterRef, e)}
            onChange={handleColumnTitleChange}
            onBlur={ handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onMouseDown={e => e.preventDefault()}
            onMouseOver={() => handleCusor(poiterRef)}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle size="sm" id="dropdown-basic" className="dropdown-btn" />
            <Dropdown.Menu>
              <Dropdown.Item>Add Card</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove Column</Dropdown.Item>
              <Dropdown.Item>Move all cards in this column (beta)</Dropdown.Item>
              <Dropdown.Item>Archive all cards in this column (beta)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="thanhha-col" //    neeu khong co thi chi keo tha trong cloumn do thoi
          //   onDragStart={e => console.log('drag started', e)}
          //   onDragEnd={e => console.log('drag end', e)}
          onDrop={dropResult => onCardDrop(column.id, dropResult) }
          getChildPayload={index =>
            cards[index]
          }
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          //   onDragEnter={() => {
          //     console.log('drag enter:', column.id)
          //   }}
          //   onDragLeave={() => {
          //     console.log('drag leave:', column.id)
          //   }}
          //   onDropReady={p => console.log('Drop ready: ', p)}
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {
            cards.map((card, index) => (
              <Draggable key={index}>
                <Card card={card}/>
              </Draggable>
            ))
          }
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" />
          Add another card
        </div>
      </footer>

      <ComfirmModal
        show={showConfirmModal}
        onActions={onComfirmModalAction}
        title= 'Remove column'
        content={`Are you sure you want to removw <strong>${column.title}! <br/> </strong>All related cards will also be removed`}
      />
    </div>
  )
}
