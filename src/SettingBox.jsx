import './App.css'

import { Pane } from 'tweakpane';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { SelectElemAtom } from './engine';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-lua';
import 'prismjs/themes/prism.css'; //Example style, you can use another



const SettingPaneAtom = atom(undefined);

function SettingBox() {
    const SelectedElem = useAtomValue(SelectElemAtom);
    const settingPane = useRef(null);
    const [SettingPane, setSettingPane] = useAtom(SettingPaneAtom);

    const [code, setCode] = useState(``);
    useEffect(() => {
        let pane = SettingPane;
        if (settingPane.current) {
            pane = new Pane({ container: settingPane.current });
            setSettingPane(pane);
        }


        if (SelectedElem) {
            pane.children.forEach((input) => {
                pane.remove(input);
            });

            for (let key of Object.keys(SelectedElem)) {
                if (key.startsWith("__")) continue;
                let option;
                if (key == "position") {
                    option = pane.addBinding(SelectedElem, key, { options: { static: "static", absolute: "absolute" } });
                } else {
                    if (SelectedElem["__options_" + key]) {
                        let options = SelectedElem["__options_" + key];
                        option = pane.addBinding(SelectedElem, key, { ...options });
                    } else {
                        option = pane.addBinding(SelectedElem, key);
                    }
                }
                if (SelectedElem["__onChange_" + key]) {
                    option.on('change', (val) => { 
                        SelectedElem["__onChange_" + key](val.value); });
                }
            }
            setCode("");
            if(Object.keys(SelectedElem ?? {}).includes("code")) {
                setCode(SelectedElem["code"]);
            }
            // ref.current.value = SelectedElem["code"];
        }
        return () => {
            pane.dispose()
        }
    }, [SelectedElem]);
    return (
        <div
            className='menubox'
            id='settingbox'
            ref={settingPane}

        >
            <Editor
                value={code}
                onValueChange={code => { setCode(code); SelectedElem["__onChange_code"](code);}}
                highlight={code => highlight(code, languages.lua)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                }}
            />
            {/* <textarea
                ref={ref}
                name="code"
                id=""
                onChange={}
            /> */}

        </div>
    )
}

export default SettingBox;
