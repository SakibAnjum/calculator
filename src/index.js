//Raziur Rahman, 2018

// const {createStore} = Redux
// const {Provider, connect} = ReactRedux

import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'
import './index.scss'

const symbols = {
  MUL: '×',
  DIV: '÷'
}

const initialState = {
  result: 0,
  display:'0',
  preNum: '',  //previous number
  curNum: '', //current number
  op:'PLUS' // last used operator
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
      case '-':
        return {type: 'MINUS'}
      case symbols.MUL:
        return {type: 'MUL'}
      case symbols.DIV:
        return {type: 'DIV'}
      case '=':
        return {type: 'EQUAL'}
      default:
        //Handle numbers: 0-9
        if(Number.isInteger(parseInt(label)))
          return {type: 'ADD_NUM', data: label}
    }
  }
}

function compute(mathOp, num1, num2){
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)

  switch(mathOp){
    case 'PLUS':
      return num1 + num2
    case 'MINUS':
      return num1 - num2
    case 'MUL':
      return num1 * num2
    case 'DIV':
      return num1 / num2
  }
}

function reducer(state=initialState, action){
  //Result is pre calculated with previous Math op.
  let result = 0

  switch(action.type){
    case 'CLEAR':
      return initialState

    case 'ADD_NUM':
      let curNum = ''.concat(state.curNum,action.data)
      return {
        ...state,
        curNum,
        display: curNum,
        //After pressing the equal, if the user presses numbers then reset.
        result: state.op == 'EQUAL' ? 0 : state.result 
      }

    case 'ADD_DOT':
      if(state.curNum.indexOf('.') == -1){
        let curNum = ''.concat(state.curNum,'.') 
        return { ...state, curNum, display: curNum }
      }
      else return state

    case 'PLUS':

      result = compute(state.op, state.result, state.curNum)
      return state.curNum ? { ...state, op: 'PLUS', preNum: '', curNum: '', result} : state

    case 'MINUS':
      result = compute(state.op, state.result, state.curNum)
      return state.curNum ? { ...state, op: 'MINUS', preNum: '', curNum: '', result} : state

    case 'MUL':
      result = compute(state.op, state.result, state.curNum)
      return state.curNum ? { ...state, op: 'MUL', preNum: '', curNum: '', result} : state

    case 'DIV':
      result = compute(state.op, state.result, state.curNum)
      return state.curNum ? { ...state, op: 'DIV', preNum: '', curNum: '', result}: state

    case 'EQUAL':
      result = compute(state.op, state.result, state.curNum)
      return { ...state, op: 'PLUS', preNum: '', curNum: '', display: result, result}
  
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
    [8,9,symbols.DIV,symbols.MUL],
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