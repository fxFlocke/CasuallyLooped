import {
    NodeConfiguration,
    EdgeConfiguration
} from "@/datatypes/commondatatypes";

export function CreateDefaultNodeConfiguration(){
    return {
          id: 0,
          startValue: 0.5,
          label: "",
          hue: 0,
          radius: 50,
      } as NodeConfiguration;
}

export function CreateDefaultEdgeConfiguration(){
    return {
          id: 0,
          label: "",
          strength: 1,
          lowBound: 0,
          highBound: 1,
      } as EdgeConfiguration;
}