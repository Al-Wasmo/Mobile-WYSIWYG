import '../App.css'

import {  useAtom,  useSetAtom } from 'jotai';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { makeHexDarker } from '../utils';
import { calcLayout, ComponentsAtom, SelectElemAtom } from '../engine';
import Yoga, { Edge, FlexDirection } from 'yoga-layout';
import Rect, { RectNode } from './Rect';
import Text, { TextNode } from './Text';




function Runner({ props }) {
    const setSelectElem = useSetAtom(SelectElemAtom);
    const [Components, setComponents] = useAtom(ComponentsAtom);

    const { isOver, setNodeRef } = useDroppable({ id: 'droppable', });
    const RootComponent = Components["root"];


    // options
    const options = {
        color: RootComponent.color,
        width: RootComponent.width,
        height: RootComponent.height,
        padding_left: RootComponent.padding.left,
        padding_right: RootComponent.padding.right,
        padding_top: RootComponent.padding.top,
        padding_bottom: RootComponent.padding.bottom,
        __options_width: { min: 200, max: 800 },
        __options_height: { min: 200, max: 800 },
        __onChange_color: (color) => { Components["root"].color = color; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
        __onChange_width: (width) => { Components["root"].width = width; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
        __onChange_height: (height) => { Components["root"].height = height; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
        __onChange_padding_left: (val) => { Components["root"].padding.left = val; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
        __onChange_padding_right: (val) => { Components["root"].padding.right = val; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
        __onChange_padding_top: (val) => { Components["root"].padding.top = val; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
        __onChange_padding_bottom: (val) => { Components["root"].padding.bottom = val; setComponents((old) => { old = calcLayout(old); return { ...old, root: { ...RootComponent } } }); },
    }

    // style
    const style = {
        outline: !isOver ? "" : "1px blue solid",
        backgroundColor: !isOver ? options.color : makeHexDarker(options.color, 5),
        width: options.width,
        height: options.height,
    };

    return (
        <div id='canvas'
            ref={setNodeRef}
            onClick={() => {
                setSelectElem(options)
            }}
            style={style}
        >
            {
                Object.keys(Components).map((key) => {
                    if (key == "root") return;
                    if (Components[key].type == "Text") {
                        return <Text key={key} id={key} {...Components[key]} />
                    }
                    return <Rect key={key} id={key} {...Components[key]} />
                })
            }

        </div>
    )
}

export default Runner;
