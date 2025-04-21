import './App.css'
import 'jotai-devtools/styles.css'

import { useState, useEffect, useRef } from 'react'

import { Pane } from 'tweakpane';
import ToolBox from './ToolBox';
import SettingBox from './SettingBox';
import Canvas from './Canvas';
import { DndContext } from '@dnd-kit/core';
import { useSetAtom } from 'jotai';
import { calcLayout, ComponentsAtom } from './engine';
import { DevTools } from 'jotai-devtools';


function App() {

  const setComponents = useSetAtom(ComponentsAtom);

  useEffect(() => {
    // const root = Yoga.Node.create();
    // root.setFlexDirection(FlexDirection.Row);
    // root.setWidth(100);
    // root.setHeight(100);
    // root.calculateLayout(600, 800, Direction.LTR);
    // console.log(root)
  }, []);

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
