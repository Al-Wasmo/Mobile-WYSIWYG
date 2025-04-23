import './App.css'

import { Pane } from 'tweakpane';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { SelectElemAtom } from './engine';

const SettingPaneAtom = atom(undefined);

function SettingBox() {
    const SelectedElem = useAtomValue(SelectElemAtom);
    const settingPane = useRef(null);
    const [SettingPane, setSettingPane] = useAtom(SettingPaneAtom);
    const ref = useRef();

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
                option.on('change', (val) => { SelectedElem["__onChange_" + key](val.value); });
            }
            ref.current.value = SelectedElem["code"];
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
            <textarea 
                ref={ref}
                name="code"
                id=""
                onChange={(val) => SelectedElem["__onChange_code"](val.target.value)}
            />

        </div>
    )
}

export default SettingBox;
