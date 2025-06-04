import { atom, useAtom } from "jotai";
import { createStore, getDefaultStore } from 'jotai/vanilla';
import { WebSocketServer } from "ws";

import Yoga, { Direction, Edge, FlexDirection, PositionType } from 'yoga-layout';
import { RectNode } from "./Elems/Rect";
import { CanvaseNode } from "./Elems/Canvas";
import { Component } from "react";

import { lua, lauxlib, lualib, luaopen_js, to_luastring, to_jsstring } from 'fengari-web';


const store = getDefaultStore();


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
  history.replaceState({}, "", url);

  socket.send(JSON.stringify(
    {type : "reload", layout : JSON.stringify(components)}
  ));



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


const isRunningAtom = atom(false);



export function onRun() {

  const url = new URL(window.location.href);
  url.searchParams.append("run",true);
  window.location.href = url.toString();


  // let Selected = store.get(SelectElemAtom);
  // let id = store.get(SelectElemAtom).id;
  // let Components = store.get(ComponentsAtom);
  // let code = Components[id].code;




  // const L = lauxlib.luaL_newstate();
  // lua.lua_pushjsfunction(L, (L) => {
  //   let w = lua.lua_tonumber(L, 1)
  //   let h = lua.lua_tonumber(L, 2)

  //   if (w) {
  //     Selected.__onChange_width(w);
  //   }
  //   if (h) {
  //     Selected.__onChange_height(h);
  //   }

  //   return 0;
  // });



  // lualib.luaL_openlibs(L);
  // const status = lauxlib.luaL_dostring(L, to_luastring(code));


  // // lua.lua_pushglobaltable(L);

  // console.log(lua)

  // lua.lua_getglobal(L, to_luastring("_G"));
  // lua.lua_getfield(L,-1,"click")
  // let number = lua.lua_isfunction(L,-1)

  // lua.lua_getglobal(L, to_luastring("_G"));
  // lua.lua_getfield(L,-1,"click")
  // lua.lua_pcall(L,0,0,0);



  // if (status !== lua.LUA_OK) {
  //   const errorMessage = lua.lua_tostring(L, -1);
  //   console.error("Lua error:", to_jsstring(errorMessage));
  //   lua.lua_pop(L, 1);
  // }




}



const socket = new WebSocket("ws://192.168.19.156:8080")

socket.onopen = () => {
  socket.send(JSON.stringify(
    { type: "connect", id: "editor" }
  ));
};

socket.onmessage = (event) => {
  console.log("Received:", event.data);
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("Connection closed");
};





export {
  SelectElemAtom,
  ComponentsAtom,
  isRunningAtom,
  store,
  calcLayout,
};


