import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { randNum } from "../utils";
import "../App.css";
import Yoga, { Edge, PositionType } from "yoga-layout";
import { calcLayout, ComponentsAtom, isRunningAtom, SelectElemAtom } from "../engine";


export const TextElemDefaultValues = {
    type: "Text",
    text: "",
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    color: "#f0f0f0",
    padding: { top: 0, left: 0, right: 0, bottom: 0 },
    margin: { top: 15, left: 15, right: 15, bottom: 15 },
    position: "static",
    font_size: 16,
};




export function TextNode(props, node) {
    node = node == undefined ? Yoga.Node.create() : node;
    Yoga.Node.create().setPos

    node.setWidth(props.width);
    node.setHeight(props.height);
    if (!props.position || props.position != "absolute") {
        {
            node.setMargin(Edge.Top, props.margin.top);
            node.setMargin(Edge.Bottom, props.margin.bottom);
            node.setMargin(Edge.Left, props.margin.left);
            node.setMargin(Edge.Right, props.margin.right);
        }

        {
            node.setPadding(Edge.Top, props.padding.top);
            node.setPadding(Edge.Bottom, props.padding.bottom);
            node.setPadding(Edge.Left, props.padding.left);
            node.setPadding(Edge.Right, props.padding.right);
        }

    } else {
        node.setPositionType(PositionType.Absolute);
        node.setPosition(Edge.Left, props.x);
        node.setPosition(Edge.Top, props.y);

    }





    return node;
}

export default function Text(props) {
    const setSelectElem = useSetAtom(SelectElemAtom);
    const [Components, setComponents] = useAtom(ComponentsAtom);

    const { x, y, width, height, color, padding, margin, position, font_size, id,type, text } = { ...TextElemDefaultValues, ...props };
    const isRunning = useAtomValue(isRunningAtom);



    // options
    const options = {
        id: id,
        type: type,
        text: text,
        x: x,
        y: y,
        color: color,
        width: width,
        height: height,
        padding_left: padding.left,
        padding_right: padding.right,
        padding_top: padding.top,
        padding_bottom: padding.bottom,
        font_size: font_size,

        // margin_left: margin.left,
        // margin_right: margin.right,
        // margin_top: margin.top,
        // margin_bottom: margin.bottom,
        position: position,


        __options_width: { min: 10 },
        __options_height: { min: 10 },
        __options_x: { step: 10 },
        __options_y: { step: 10 },
        __options_id: { readonly: true },
        __options_type: { readonly: true },


        __onChange_x: (val) => { if (Components[id].position != "absolute") { return; } Components[id].x = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_y: (val) => { if (Components[id].position != "absolute") { return; } Components[id].y = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_color: (color) => { Components[id].color = color; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_text: (text) => { options.text = text; Components[id].text = text; setSelectElem(options); setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_width: (width) => { Components[id].width = width; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_height: (height) => { Components[id].height = height; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_font_size: (val) => { Components[id].font_size = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_left: (val) => { Components[id].padding.left = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_right: (val) => { Components[id].padding.right = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_top: (val) => { Components[id].padding.top = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_bottom: (val) => { Components[id].padding.bottom = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_left: (val) => { Components[id].margin.left = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_right: (val) => { Components[id].margin.right = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_top: (val) => { Components[id].margin.top = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_bottom: (val) => { Components[id].margin.bottom = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_position: (val) => { Components[id].position = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },


    }


    const style = {
        left: x, top: y,
        width: width, height: height,
        backgroundColor: color,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        margin: `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`,
        fontSize: font_size,
        position: "absolute",
    };

    if (isRunning) {
        return <p className="elem-text" style={style}
            onClick={(e) => {
                setSelectElem(options);
                e.stopPropagation();
            }}
            onChange={(e) => {
                options.__onChange_text(e.target.value);
            }}
            type="text" placeholder="text..." >{options.text}</p>
    }

    return <input className="elem-text" style={style}
        value={options.text}
        onClick={(e) => {
            setSelectElem(options);
            e.stopPropagation();
        }}
        onChange={(e) => {
            options.__onChange_text(e.target.value);
        }}
        type="text" placeholder="text..." />
}