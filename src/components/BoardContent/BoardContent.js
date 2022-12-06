import Column from 'components/Column/Column'
import React, { useEffect, useState, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { initialdata } from 'actions/initialdata'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sort'
import { applyDrag } from 'utilities/dragDrop'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'

export default function BoardContent() {

  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  

  const newColumnInputRef = useRef(null)
  const [newColumnTitle, setColumnTitle] = useState('')
  useEffect(() => {
    const boardFromDb = initialdata.boards.find(board => board.id === 'board-1')
    // console.log(boardFromDb)
    if (boardFromDb) {
      setBoard(boardFromDb)

      // sort columns

      setColumns(mapOrder(boardFromDb.columns, boardFromDb.columnOrder, 'id'))
    }
  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

  if (isEmpty(board)) {
    return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board not found</div>
  }

  const onColumnDrop = (dropResult) => {
    //console.log(dropResult)
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)
    //console.log(newColumns)
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    //console.log(newColumns)
    //console.log(newBoard)
    setColumns(newColumns)
    setBoard(newBoard)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)
      setColumns(newColumns)
    }
  }

  const toggleOpennewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5), // random 5 ky tu ngau nhien
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)

    setColumnTitle('')
    toggleOpennewColumnForm()
  }
  const onNewColumnTitleChange = (e) => {
    setColumnTitle(e.target.value)
  }

  const onUpdateColumn = (newColumntoUpdate) => {
    const columnIdToUpdate = newColumntoUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)
    if (newColumntoUpdate._destroy) {
      //remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else { 
      // update column info 
      newColumns.splice(columnIndexToUpdate, 1, newColumntoUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }
  return (
    <div className="board_content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index =>
          columns[index]
        }
        dragHandleSelector=".column-drag-handle"// class caan keo
        dropPlaceholder={{ // laf background khi chung ta keos di
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}>
        {
          columns.map((column, index) => (
            <Draggable key={index}>
              <Column column= {column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
            </Draggable>
          ))
        }
      </Container>
      <BootstrapContainer className="trello-container">
        {!openNewColumnForm &&
        <Row>
          <Col className="add-new-column" onClick={toggleOpennewColumnForm}>
            <i className="fa fa-plus icon" />Add another column
          </Col>
        </Row>}

        {openNewColumnForm &&
        <Row>
          <Col className="enter-new-column">
            <Form.Control
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="Enter column titke..."
              className="input-enter-new-column"
              ref={newColumnInputRef}
              value={newColumnTitle}
              onChange={onNewColumnTitleChange}
              onKeyDown={e => (e.key === 'Enter') && addNewColumn()}
            />
            <Button variant="success" size="sm" onClick={addNewColumn} onKeyDown={e => (e.key === 'Enter') && addNewColumn()}>Add column</Button>
            <span className="cancel-new-column" onClick={toggleOpennewColumnForm}><i className="fa fa-trash icon" /></span>
          </Col>
        </Row>}
      </BootstrapContainer>
    </div>
  )
}
