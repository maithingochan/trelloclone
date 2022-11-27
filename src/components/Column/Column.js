
import React from 'react'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sort'
import { Container, Draggable } from 'react-smooth-dnd'

export default function Column(props) {

  const { column } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const onCardDrop = (dropResult) => {
    console.log(dropResult)
  }

  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          groupName="thanhha-col" //    neeu khong co thi chi keo tha trong cloumn do thoi
          //   onDragStart={e => console.log('drag started', e)}
          //   onDragEnd={e => console.log('drag end', e)}
          onDrop={onCardDrop}
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
      <footer>Add another card</footer>
    </div>
  )
}
