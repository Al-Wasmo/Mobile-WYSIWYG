import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { randNum } from "../utils";
import Yoga, { Edge, PositionType } from "yoga-layout";
import { calcLayout, ComponentsAtom, isRunningAtom, SelectElemAtom, store } from "../engine";
import { lua, lauxlib, lualib, luaopen_js, to_luastring, to_jsstring } from 'fengari-web';



export const RectElemDefaultValues = {
    type: "Rect",
    x: 0,
    y: 0,
    width: 60,
    height: 60,
    color: "#0000ff",
    padding: { top: 0, left: 0, right: 0, bottom: 0 },
    margin: { top: 15, left: 15, right: 15, bottom: 15 },
    position: "static",
    code: "",
};


export function RectNode(props, node) {
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



export default function Rect(props) {
    const setSelectElem = useSetAtom(SelectElemAtom);
    const [Components, setComponents] = useAtom(ComponentsAtom);
    const { x, y, width, height, color, padding, type, margin, position, id, code } = { ...RectElemDefaultValues, ...props };
    const isRunning = useAtomValue(isRunningAtom);
    const [clickCallback, setClickCallback] = useState(() => { return () => { } });

    useEffect(() => {
        if (!isRunning) return;

        const L = lauxlib.luaL_newstate();
        lualib.luaL_openlibs(L);
        let luaFuncRef;
        lauxlib.luaL_dostring(L, to_luastring(code));

        // init the event callbacks
        lua.lua_getglobal(L, to_luastring("_G"));
        lua.lua_getfield(L, -1, to_luastring("click"))
        luaFuncRef = lua.lua_toproxy(L, -1);
        lua.lua_pop(L, 1);

        lua.lua_getglobal(L, to_luastring("_G"));
        lua.lua_getfield(L, -1, to_luastring("click"))
        const isFunc = lua.lua_isfunction(L, -1);
        if (isFunc) {
            setClickCallback(() => {
                return () => {
                    luaFuncRef(L);
                    lua.lua_call(L, 0, 0);
                }
            });
        }

        // init the set function
        lua.lua_pushjsfunction(L, (L) => {
            const key = lua.lua_tojsstring(L, 1);
            let value;
            if (lua.lua_isnumber(L, 2)) {
                value = lua.lua_tonumber(L, 2);
            } else {
                value = lua.lua_tojsstring(L, 2);
            }

            options.__onChange(key, value);

            return 0;
        });
        lua.lua_setglobal(L, "set");

        lua.lua_pushjsfunction(L, (L) => {
            const id = lua.lua_tonumber(L, -3);

            const key = lua.lua_tojsstring(L, -2);
            let value;
            if (lua.lua_isnumber(L, 2)) {
                value = lua.lua_tonumber(L, -1);
            } else {
                value = lua.lua_tojsstring(L, -1);
            }

            let comp = Components[id];
            if (Object.keys(comp).includes(key)) {
                Components[id][key] = value;
                setComponents((old) => {
                    let layout = calcLayout(old);
                    return { ...layout, ...Components }
                });
            } else {
                console.log(Object.keys(comp))
                alert(`unknown key used (${key}), check the console for valid keys`);
            }

            return 0;
        });
        lua.lua_setglobal(L, "setComp");        
    }, []);


    // options
    const options = {
        id: id,
        type: type,
        x: x,
        y: y,
        color: color,
        width: width,
        height: height,
        padding_left: padding.left,
        padding_right: padding.right,
        padding_top: padding.top,
        padding_bottom: padding.bottom,
        margin_left: margin.left,
        margin_right: margin.right,
        margin_top: margin.top,
        margin_bottom: margin.bottom,
        position: position,
        code: code,

        __options_width: { min: 10, max: 500 },
        __options_height: { min: 10, max: 500 },
        __options_x: { step: 10 },
        __options_y: { step: 10 },
        __options_id: { readonly: true },
        __options_type: { readonly: true },

        __onChange: (key, value) => {
            let comp = Components[id];
            if (Object.keys(comp).includes(key)) {
                Components[id][key] = value;
                setComponents((old) => {
                    let layout = calcLayout(old);
                    return { ...layout, ...Components }
                });
            } else {
                console.log(Object.keys(comp))
                alert(`unknown key used (${key}), check the console for valid keys`);
            }
        },


        __onChange_x: (x) => { if (Components[id].position != "absolute") { return; } Components[id].x = x; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_y: (y) => { if (Components[id].position != "absolute") { return; } Components[id].y = y; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_color: (color) => { Components[id].color = color; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_width: (width) => { Components[id].width = width; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_height: (height) => { Components[id].height = height; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_left: (val) => { Components[id].padding.left = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_right: (val) => { Components[id].padding.right = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_top: (val) => { Components[id].padding.top = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_padding_bottom: (val) => { Components[id].padding.bottom = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_left: (val) => { Components[id].margin.left = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_right: (val) => { Components[id].margin.right = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_top: (val) => { Components[id].margin.top = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_margin_bottom: (val) => { Components[id].margin.bottom = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_position: (val) => { Components[id].position = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },
        __onChange_code: (val) => { Components[id].code = val; setComponents((old) => { old = calcLayout(old); return { ...old, ...Components } }); },


    }

    const style = {
        left: x, top: y,
        width: width, height: height,
        backgroundColor: color,
        padding: `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`,
        margin: `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`,
        position: "absolute",
    };

    return <div className="elem-rect"
        style={style}
        onClick={(e) => {
            e.stopPropagation();
            if (isRunning) {
                clickCallback();
            } else {
                setSelectElem(options);
            }
        }}
    />
}