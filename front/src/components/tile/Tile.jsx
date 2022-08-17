import React from 'react'
import './Tile.css'

export default function Tile({type, pic, num, name}) {
  return (
    <div className={'tile ' + type}>
        {pic && <div className={"piece " + type} piece={pic} name={name} num={num} style={{backgroundImage: `url(${pic})`}} ></div>}
    </div>
  )
}
