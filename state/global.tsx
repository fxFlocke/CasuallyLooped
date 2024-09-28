import { NodeConfiguration, NodeElement } from '@/datatypes/commondatatypes'
import React, { useReducer } from 'react'

export const globalReducer = (state: any, action: any)=>{
    switch(action.type){
        case "LOAD_CONFIG":{
            return { ...state, config: action.config}
        }
        case "CREATE_NODE": {
            state.config.nodes.push(action.data)
            return { ...state, config: {
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                node: action.data,
                egde: state.config.edge,
                nodes: state.config.nodes
            }}
        }
        case "CHANGE_NODE":{
            return { ...state, config: {
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                node: action.data,
                egde: state.config.edge,
                nodes: state.config.nodes
            }}
        }
        case "CHANGE_EDGE":{
            return { ...state, config: {
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                node: state.config.node,
                egde: action.data,
                nodes: state.config.nodes
            }}
        } 
        case "CHANGE_EDIT":{
            state.config.node = action.data;
            return { ...state, config: {
                editMode: action.data,
                editingIndex: state.config.editingIndex,
                node: state.config.node,
                egde: state.config.edge,
                nodes: state.config.nodes
            }}
        }
        case "CHANGE_LABEL":{ 
            // state.config.nodes = action.data
            return { ...state, config: {
                editMode: state.config.editMode,
                editingIndex: state.config.editingIndex,
                node: state.config.node,
                egde: state.config.edge,
                nodes: action.data
            }}
        }
        case "CHANGE_COLOR":{
        }
        case "CHANGE_EDITING_INDEX":{
            return { ...state, config: {
                editMode: state.config.editMode,
                editingIndex: action.data,
                node: state.config.node,
                egde: state.config.edge,
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
        editMode: "ink",
        editingIndex: -1,
        node: undefined,
        edge: undefined,
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