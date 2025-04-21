import { atom, useAtom } from "jotai";
import { createStore } from 'jotai/vanilla';
import { WebSocketServer } from "ws";

import Yoga, { Direction, Edge, FlexDirection, PositionType } from 'yoga-layout';


function calcLayout(components) {
  const root = Yoga.Node.create();
  root.setFlexDirection(FlexDirection.Row);
  root.setWidth(components.root.width);
  root.setHeight(components.root.height);
  root.setPadding(Edge.Bottom,components.root.padding.bottom);
  root.setPadding(Edge.Left,components.root.padding.left);
  root.setPadding(Edge.Right,components.root.padding.right);
  root.setPadding(Edge.Top,components.root.padding.top);
  let children = {};
  for(let key in components) {
    if(key == "root") continue;
    let child = Yoga.Node.create();
    child.setWidth(components[key].width);
    child.setHeight(components[key].height);
    child.setMargin(Edge.All,5);
    children[key] = child;
    root.insertChild(child, Object.keys(children).length - 1);
  }

  root.calculateLayout(undefined, undefined, Direction.LTR);
  for(let key in children) { 
    components[key].x = children[key].getComputedLeft();
    components[key].y = children[key].getComputedTop();
    children[key].free();
  }


  // socket.send(JSON.stringify(
  //   {type : "reload", layout : JSON.stringify(components)}
  // ));

  return components;
}


const SelectElemAtom = atom(undefined);
const ComponentsAtom = atom({
    root : {
        color: "#ffffff",
        width: 360,
        height: 800,
        padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
    }
});








const socket = new WebSocket("ws://192.168.193.156:8080")



socket.onopen = () => {
  socket.send(JSON.stringify(
    { type : "connect", id : "editor"}
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
    calcLayout,
};
