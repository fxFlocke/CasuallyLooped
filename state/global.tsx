import { NodeConfiguration } from '@/datatypes/commondatatypes'
import React, { useReducer } from 'react'

export const globalReducer = (state: any, action: any)=>{
    switch(action.type){
        case "LOAD_CONFIG":{
            return { ...state, config: action.config}
        }
        case "CHANGE_NODE":{
            return { ...state, config: {
                editMode: state.editMode,
                node: action.node,
                egde: state.edge,
                geometries: state.geometries
            }}
        }
        case "CHANGE_EDGE":{
            return { ...state, config: {
                editMode: state.editMode,
                node: state.node,
                egde: action.edge,
                geometries: state.geometries
            }}
        } 
        case "CHANGE_EDIT":{
            if(action.data === "ink"){
                state.node = initialNode;
            }
            return { ...state, config: {
                editMode: action.data,
                node: state.node,
                egde: state.edge,
                geometries: state.geometries
            }}
        }
        case "CHANGE_LABEL":{
            return { ...state, config: {
                editMode: action.data,
                node: state.node,
                egde: state.edge,
                geometries: state.geometries
            }}
        }
        case "CHANGE_COLOR":{
            
        }
        default:
            return state;
    }
}

const initialNode: NodeConfiguration = {
    id: 0,
    startValue: 0,
    label: "",
    hue: 0,
    radius: 50,
}

const initialAppState: any = {
    config: {
        editMode: "ink",
        node: undefined,
        edge: undefined,
        geometries: undefined
    }
}

export const AppContext = React.createContext([initialAppState, () => {}])

export function AppProvider({children}:any){
    const [appState, dispatch] = useReducer(globalReducer, initialAppState);
    return(
        <AppContext.Provider value={[appState, dispatch]}>
            {children}
        </AppContext.Provider>
    )
}