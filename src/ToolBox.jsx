import './App.css'

import { Pane } from 'tweakpane';
import { atom, useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { DndContext, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';

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
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, data: {
        width: 60,
        height: 60,
        color: "pink",
    }});
    const [isDragged, setIsDragged] = useState(false);

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        padding: '1rem',
        cursor: 'grab',
        outline:  !isDragged ?  "" : "solid 2px blue",
        
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


function ToolBox() {
    const toolBoxRef = useRef(null);
    const [TooBoxPane, setTooBoxPane] = useAtom(TooBoxPaneAtom);


    useEffect(() => {

    }, []);




    return (
        <div
            className='menubox'
            id='toolbox'
            ref={toolBoxRef}
        >
            <Draggable text="Rect" />
            <Draggable text="Text" />
        </div>
    )
}

export default ToolBox
