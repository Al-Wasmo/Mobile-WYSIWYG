import { atom, useAtom } from "jotai";
import { createStore, getDefaultStore } from 'jotai/vanilla';
import { WebSocketServer } from "ws";

import Yoga, { Direction, Edge, FlexDirection, PositionType } from 'yoga-layout';
import { RectNode } from "./Elems/Rect";
import { CanvaseNode } from "./Elems/Canvas";
import { Component } from "react";

import { lua, lauxlib, lualib,luaopen_js, to_luastring,to_jsstring } from 'fengari-web';


export const store = getDefaultStore();


function calcLayout(components) {
  // create root
  const root = CanvaseNode(components.root);



  let elems = {};
  for (let key in components) {
    if (key == "root") continue;
      elems[key] = RectNode
      (components[key]);
    root.insertChild(elems[key], Object.keys(elems).length - 1);
  }
  root.calculateLayout(undefined, undefined, Direction.LTR);

  for (let key in elems) {
    components[key].x = elems[key].getComputedLeft();
    components[key].y = elems[key].getComputedTop();
    elems[key].free();
  }


  const data = encodeURIComponent(JSON.stringify(components));
  const url = window.location.pathname + `?data=${data}`;
  history.replaceState({},"",url);

  return components;
}



const SelectElemAtom = atom(undefined);
const ComponentsAtom = atom({
  root: {
    color: "#ffffff",
    width: 360,
    height: 800,
    padding: { top: 0, left: 0, right: 0, bottom: 0, },
    margin: { top: 0, left: 0, right: 0, bottom: 0, },
  }
});



export  function onRun() {
  // const luaconf  = fengari.luaconf;
  // const lua      = fengari.lua;
  // const lauxlib  = fengari.lauxlib;
  // const lualib   = fengari.lualib;
   

  let code = store.get(SelectElemAtom).code;
  console.log(code);



  const L = lauxlib.luaL_newstate();
  lua.lua_pushjsfunction(L, (L) => {
    const lenPtr = new Uint32Array(1);
    const ptr = lua.lua_tolstring(L, 1);
    let color = new TextDecoder().decode(ptr.buffer);

    let comps = store.get(ComponentsAtom);
    comps["root"].color = color;
    store.set(ComponentsAtom,{...comps});
    return 0;
  });
  lua.lua_setglobal(L, to_luastring("jsPrint"));


  lualib.luaL_openlibs(L);
  const status = lauxlib.luaL_dostring(L, to_luastring(code));
  
  

  
  if (status !== lua.LUA_OK) {
    const errorMessage = lua.lua_tostring(L, -1);
    console.error("Lua error:", to_jsstring(errorMessage));
    lua.lua_pop(L, 1);
  }

}


// socket.send(JSON.stringify(
//   {type : "reload", layout : JSON.stringify(components)}
// ));


// const socket = new WebSocket("ws://192.168.193.156:8080")

// socket.onopen = () => {
//   socket.send(JSON.stringify(
//     { type: "connect", id: "editor" }
//   ));
// };

// socket.onmessage = (event) => {
//   console.log("Received:", event.data);
// };

// socket.onerror = (error) => {
//   console.error("WebSocket error:", error);
// };

// socket.onclose = () => {
//   console.log("Connection closed");
// };





export {
  SelectElemAtom,
  ComponentsAtom,
  calcLayout,
};


