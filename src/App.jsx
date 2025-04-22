import './App.css'
import 'jotai-devtools/styles.css'

import { useState, useEffect, useRef } from 'react'

import { Pane } from 'tweakpane';
import ToolBox from './ToolBox';
import SettingBox from './SettingBox';
import { DndContext } from '@dnd-kit/core';
import { useSetAtom } from 'jotai';
import { calcLayout, ComponentsAtom } from './engine';
import { DevTools } from 'jotai-devtools';
import Canvas from './Elems/Canvas';


function App() {

  const setComponents = useSetAtom(ComponentsAtom);

  function handleDragEnd(event) {
    const { over } = event;

    if (over) {
      const id = Math.round(Math.random() * 1000);
      setComponents((state) => {
        state[id] = event.active.data.current;
        state = calcLayout(state);

        return {...state};
      });
    }
  }
  return (
    <div id='app' >
      <div style={{position: "absolute"}}>
        <DevTools />
      </div>
      <DndContext onDragEnd={handleDragEnd} className="asd">
        <ToolBox />
        <Canvas />
        <SettingBox />
      </DndContext>

    </div>
  )
}

export default App
