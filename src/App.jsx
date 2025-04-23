import './App.css'
import 'jotai-devtools/styles.css'

import { useState, useEffect, useRef } from 'react'

import { Pane } from 'tweakpane';
import ToolBox, { data } from './ToolBox';
import SettingBox from './SettingBox';
import { DndContext } from '@dnd-kit/core';
import { useSetAtom } from 'jotai';
import { calcLayout, ComponentsAtom } from './engine';
import { DevTools } from 'jotai-devtools';
import Canvas from './Elems/Canvas';

import { Mosaic } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import { Dock } from 'react-dock';
import { DndProvider, getBackendOptions, Tree } from '@minoru/react-dnd-treeview';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';





function App() {

  const setComponents = useSetAtom(ComponentsAtom);

  useEffect(() => {







    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if(data) {
      setComponents(JSON.parse(data));
    }
  },[]);

  function handleDragEnd(event) {
    const { over } = event;

    if (over) {
      const id = Math.round(Math.random() * 1000);
      setComponents((state) => {
        state[id] = event.active.data.current;
        state[id].type = event.active.id
        state = calcLayout(state);

        return { ...state };
      });
    }
  }
  return (
    <div id='app' >
      <div style={{ position: "absolute" }}>
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
