import { atom, useAtom } from "jotai";
import { createStore } from 'jotai/vanilla';
import { WebSocketServer } from "ws";

import Yoga, { Direction, Edge, FlexDirection, PositionType } from 'yoga-layout';
import { RectNode } from "./Elems/Rect";
import { CanvaseNode } from "./Elems/Canvas";


function calcLayout(components) {
  // create root
  const root = CanvaseNode(components.root);



  let elems = {};
  for (let key in components) {
    if (key == "root") continue;
    elems[key] = RectNode(components[key]);
    root.insertChild(elems[key], Object.keys(elems).length - 1);
  }
  root.calculateLayout(undefined, undefined, Direction.LTR);

  for (let key in elems) {
    components[key].x = elems[key].getComputedLeft();
    components[key].y = elems[key].getComputedTop();
    elems[key].free();
  }



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
