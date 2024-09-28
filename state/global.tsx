import { NodeConfiguration, NodeElement } from '@/datatypes/commondatatypes'
import React, { useReducer } from 'react'

export const globalReducer = (state: any, action: any)=>{
    switch(action.type){
        case "LOAD_CONFIG":{
            return { ...state, config: action.config}
        }
        case "CHANGE_EDITING_INDEX":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: action.data,
                nodes: state.config.nodes
            }}
        }
        case "CHANGE_ACTION_MODE":{
            return { ...state, config: {
                actionMode: action.data,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                nodes: state.config.nodes
            }}
        }
        case "CHANGE_EDIT_MODE":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: action.data,
                editingIndex: state.config.editingIndex,
                nodes: state.config.nodes
            }}
        }
        case "CREATE_NODE": {
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                nodes: state.config.nodes
            }}
        }
        case "CHANGE_NODE":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                nodes: action.data
            }}
        }
        case "CHANGE_EDGE":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                nodes: state.config.nodes
            }}
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

const initialNodes: NodeElement[] = []

const initialAppState: any = {
    config: {
        actionMode: "ink",
        editMode: "info",
        editingIndex: -1,
        nodes: initialNodes
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