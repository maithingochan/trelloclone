import Column from 'components/Column/Column'
import React, { useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { initialdata } from 'actions/initialdata'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sort'

export default function BoardContent() {

  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFromDb = initialdata.boards.find(board => board.id === 'board-1')
    // console.log(boardFromDb)
    if (boardFromDb) {
      setBoard(boardFromDb)

      // sort columns

      setColumns(mapOrder(boardFromDb.columns, boardFromDb.columnOrder, 'id'))
    }
  }, [])

  if (isEmpty(board)) {
    return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board not found</div>
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
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
              <Column column= {column}/>
            </Draggable>
          ))
        }
      </Container>

    </div>
  )
}
