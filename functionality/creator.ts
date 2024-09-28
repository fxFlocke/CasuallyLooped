import {
    NodeConfiguration,
} from "@/datatypes/commondatatypes";

export function CreateDefaultNodeConfiguration(){
    return {
          id: 0,
          startValue: 0,
          label: "",
          hue: 0,
          radius: 50,
      } as NodeConfiguration;
}