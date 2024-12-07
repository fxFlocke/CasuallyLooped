import { NodeConfiguration, NodeElement, TextElement } from '@/datatypes/commondatatypes'
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
                edgeEditingIndex: state.config.edgeEditingIndex,
                nodes: state.config.nodes,
                texts: state.config.texts
            }}
        }
        case "CHANGE_EDGE_EDITING_INDEX":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                edgeEditingIndex: action.data,
                nodes: state.config.nodes,
                texts: state.config.texts
            }}
        }
        case "CHANGE_ACTION_MODE":{
            return { ...state, config: {
                actionMode: action.data,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                edgeEditingIndex: state.config.edgeEditingIndex,
                nodes: state.config.nodes,
                texts: state.config.texts
            }}
        }
        case "CHANGE_EDIT_MODE":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: action.data,
                editingIndex: state.config.editingIndex,
                edgeEditingIndex: state.config.edgeEditingIndex,
                nodes: state.config.nodes,
                texts: state.config.texts
            }}
        }
        case "EDIT":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                edgeEditingIndex: state.config.edgeEditingIndex,
                nodes: action.data,
                texts: state.config.texts
            }}
        }
        case "EDIT_TEXTS":{
            return { ...state, config: {
                actionMode: state.config.actionMode,
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                edgeEditingIndex: state.config.edgeEditingIndex,
                nodes: state.config.nodes,
                texts: action.data
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
const initialTexts: TextElement[] = []

const initialAppState: any = {
    config: {
        actionMode: "ink",
        editMode: "node",
        editingIndex: -1,
        edgeEditingIndex: -1,
        nodes: initialNodes,
        texts: initialTexts
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