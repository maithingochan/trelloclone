import Column from 'components/Column/Column'
import React, { useEffect, useState } from 'react'
import './BoardContent.scss'
import {initialdata} from 'actions/initialdata'
import { isEmpty} from 'lodash'
import {mapOrder} from 'utilities/sort'

export default function BoardContent() {

    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => { 
        const boardFromDb = initialdata.boards.find(board => board.id === 'board-1')
        console.log(boardFromDb)
        if(boardFromDb) { 
            setBoard(boardFromDb)

            // sort columns 
            
            setColumns(mapOrder(boardFromDb.columns, boardFromDb.columnOrder, 'id'))
        }
    },[])

    if (isEmpty(board)) {
        return <div className="not-found" style={{'padding': '10px', 'color': 'white'}}>Board not found</div>
    }

  return (
    <div className="board_content">
        {
            columns.map((column, index) => {
                return <Column key={index} column= {column}/>
            })
        }
    </div>
  )
}
