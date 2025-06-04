import './App.css'
import 'jotai-devtools/styles.css'

import { useState, useEffect, useRef } from 'react'

import { Pane } from 'tweakpane';
import ToolBox, { data } from './ToolBox';
import SettingBox from './SettingBox';
import { DndContext } from '@dnd-kit/core';
import { useAtom, useSetAtom } from 'jotai';
import { calcLayout, ComponentsAtom, isRunningAtom } from './engine';
import { DevTools } from 'jotai-devtools';
import Canvas from './Elems/Canvas';

import { Mosaic } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import Runner from './Elems/Runner';




function App() {
  const setComponents = useSetAtom(ComponentsAtom);
  const [isRunning, setIsRunning] = useAtom(isRunningAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      setComponents(JSON.parse(data));
    }

    if (params.get("run")) {
      setIsRunning(true)
    } else {
      setIsRunning(false);
    }
  }, []);

  function onReturn() {
    const url = new URL(window.location.href);
    url.searchParams.delete('run');
    window.location.href = url.toString();
  }

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

      {
        !isRunning ? <>
          <DndContext onDragEnd={handleDragEnd} className="asd">
            <ToolBox />
            <Canvas />
            <SettingBox />
          </DndContext>

        </>  : <div id='runner-container'>
        <button onClick={() => onReturn()}>Return</button>
        <Runner />
        </div>

      }

    </div>
  )
}


export default App
