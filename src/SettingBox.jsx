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
                if(SelectedElem["__bounds_" + key]) {
                    let bounds = SelectedElem["__bounds_" + key];
                    option = pane.addBinding(SelectedElem, key,{min: bounds[0], max: bounds[1]});
                } else {
                    option = pane.addBinding(SelectedElem, key);
                }
                option.on('change', (val) => { SelectedElem["__onChange_" + key](val.value); });
            
            }
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
        />
    )
}

export default SettingBox;
