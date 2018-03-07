//Raziur Rahman, 2018

// const {createStore} = Redux
// const {Provider, connect} = ReactRedux

import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'
import './index.scss'

const initialState = {
  display:'0',
  preNum: '',  //previous number
  curNum: '', //current number
  op:'' // last used operator
}

const actions = {
  keypress: (label)=>{
    switch(label){
      case 'C':
        return {type: 'CLEAR'}
      case '.':
        return {type: 'ADD_DOT'}
      case '+':
        return {type: 'PLUS'}
      case '=':
        return {type: 'EQUAL'}
      default:
        //Handle numbers: 0-9
        if(Number.isInteger(parseInt(label)))
          return {type: 'ADD_NUM', data: label}
        else
          return {type: 'KEY', label}
    }
  }
}

function reducer(state=initialState, action){
  switch(action.type){
    case 'CLEAR':
      return initialState

    case 'KEY':
      return { ...state, curNum:'', display: action.label}

    case 'ADD_NUM':
      let curNum = ''.concat(state.curNum,action.data)
      return { ...state, curNum, display: curNum }

    case 'ADD_DOT':
      if(state.curNum.indexOf('.') == -1){
        let curNum = ''.concat(state.curNum,'.') 
        return { ...state, curNum, display: curNum }
      }
      else return state

    case 'PLUS':
      return { ...state, op: 'PLUS', preNum: state.curNum, curNum: ''}

    case 'EQUAL':
      switch(state.op){
        case 'PLUS':
          return { ...state, display: parseFloat(state.preNum) + parseFloat(state.curNum) }
      }
    default:
      return state
  }
  
}

const _Display = (props)=>{
  return (
    <div className='display'>{props.display}</div>
  )
}

const Display = connect(state=>state)(_Display)

const _Key = ({keypress, children})=>{
  return (
    <div className='key' onClick={()=>keypress(children)}>
      {children}
    </div>
  )
}

const Key = connect(null, actions)(_Key)

const Keyboard = (props)=>{
  let layout = [
    ['SQR','SQRT','C'],
    [8,9,'÷','×'],
    [5,6,7,'-'],
    [2,3,4,'+'],
    [0,1,'.','='],
  ]
  return (
    <div className='keyboard'>
      {layout.map((row, rid)=>{
        return (
         <div className='row' key={'rid'+rid}>
          {row.map((item, idx)=><Key key={'item'+idx}>{item}</Key>)}
         </div> 
        )
      })}
    </div>
  )
}

const Calculator = ()=>{
  return (
    <div className='container'>
      <div className='calc'>
        <Display/>
        <Keyboard/>
      </div>
    </div>
  )
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
  <Provider store={store}>
    <Calculator/>
  </Provider>
  , document.getElementById('app'))