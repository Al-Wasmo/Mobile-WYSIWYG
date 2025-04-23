import './App.css'

import { Pane } from 'tweakpane';
import { atom, useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { DndContext, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import { RectElemDefaultValues } from './Elems/Rect';
import { TextElemDefaultValues } from './Elems/Text';
import { DndProvider, getBackendOptions, Tree } from '@minoru/react-dnd-treeview';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { onRun } from './engine';

const TooBoxPaneAtom = atom(undefined);


function Draggable({ id, text }) {
  useDndMonitor({
    onDragStart(event) {
      if (event.active.id == id) {
        setIsDragged(true);
      } else {
        setIsDragged(false);
      }
    },
    onDragEnd(event) {
      if (event.active.id === id) {
        setIsDragged(false);
      }
    },
    onDragCancel(event) {
      if (event.active.id === id) {
        setIsDragged(false);
      }
    },
  });


  id = id ? id : text;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, data: id == "Text" ? { ...TextElemDefaultValues } : { ...RectElemDefaultValues } });
  const [isDragged, setIsDragged] = useState(false);

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    padding: '1rem',
    cursor: 'grab',
    outline: !isDragged ? "" : "solid 2px blue",

  };
  return (
    <div ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className='draggable'
    >
      {text}
    </div>
  );
}


export let data = [
  {
    "id": 1,
    "parent": 0,
    "droppable": true,
    "text": "Folder 1"
  },
  {
    "id": 2,
    "parent": 1,
    "text": "File 1-1",
    "data": {
      "fileType": "csv",
      "fileSize": "0.5MB"
    }
  },
  {
    "id": 3,
    "parent": 1,
    "text": "File 1-2",
    "data": {
      "fileType": "pdf",
      "fileSize": "4.8MB"
    }
  },
  {
    "id": 4,
    "parent": 0,
    "droppable": true,
    "text": "Folder 2"
  },
  {
    "id": 5,
    "parent": 4,
    "droppable": true,
    "text": "Folder 2-1"
  },
  {
    "id": 6,
    "parent": 5,
    "text": "File 2-1-1",
    "data": {
      "fileType": "image",
      "fileSize": "2.1MB"
    }
  }
]




function ToolBox() {
  const toolBoxRef = useRef(null);
  const [TooBoxPane, setTooBoxPane] = useAtom(TooBoxPaneAtom);


  useEffect(() => {

  }, []);


  const [treeData, setTreeData] = useState(data);
  const handleDrop = (newTreeData) => {
    setTreeData(newTreeData);
  }


  return (
    <div
      className='menubox'
      id='toolbox'
      ref={toolBoxRef}
    >
      <Draggable text="Rect" />
      <Draggable text="Text" />



      <DndProvider backend={HTML5Backend}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginInlineStart: depth * 10 }}>
              {node.droppable && (
                <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
              )}
              {node.text}
            </div>
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
        />
      </DndProvider>
      <button onClick={onRun}>Run</button>
    </div>

  )
}

export default ToolBox
