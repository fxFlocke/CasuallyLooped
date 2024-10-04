//UITypes
export type NodeConfiguration = {
  id: number;
  startValue: number;
  label: string;
  hue: number;
  radius: number;
};
export type NodeGeometry = {
  circleRadius: number,
  controlsAlpha: number,
  controlsDirection: number
}
export type EdgeConfiguration = {
  id: number;
  label: string,
  strength: number;
  lowBound: number;
  highBound: number;
};
export type EdgeGeometry = {
  arc: number,
  from: number,
  to: number,
  rotation: number,
  drawBase: EdgeDrawBase,
  labelDrawBase: LabelDrawBase,
  arrowDrawBase: ArrowDrawBase
}
export type EdgeDrawBase = {
  f: Position,
  ap: Position,
  a: number,
  aa: number,
  w: number,
  y2: number,
  r: number
}
export type LabelDrawBase = {
  lp: Position,
  l: string,
  labelXY: Position
}
export type ArrowDrawBase = {
  startAngle: number,
  end: number,
  arrowLength: number
}
export type Configuration = {
  editingMode: string;
  node?: NodeConfiguration;
  edge?: EdgeConfiguration;
  geometries: NodeGeometry[]
};
export type Loopy = {
  nodes: Node[];
};
export type Signal = {};
export type Position = {
  x: number;
  y: number;
};

//CommonDataTypes
export type Node = {
  id: number;
  pos: Position;
  label: string;
  value: number;
  edges: Edge[];
};
export type Edge = {
  id: number;
  from: number;
  to: number;
  impact: number;
};
export type NodeElement = {
  node: Node;
  config: NodeConfiguration;
  geometry: NodeGeometry;
  edges: EdgeElement[];
};
export type EdgeElement = {
  edge: Edge;
  config: EdgeConfiguration;
  geometry: EdgeGeometry;
};
export type LoopyConfiguration = {
  nodes: NodeConfiguration[];
  edges: EdgeConfiguration[];
};
export type ToolConfigurations = {
  loopy?: LoopyConfiguration;
  //all following compatabilities can be extended here
};
export type CommonDataDiagram = {
  nodes: Node[];
  configs: ToolConfigurations;
};

//GeometryTypes
export type Bound = {
  top: number,
  bottom: number,
  left: number,
  right: number,
  width: number,
  height: number,
}

//GraphTypes
export type GraphNode = {
  searchLabel: string;
  size: number; //always translate to 0..1
};
export type GraphEdge = {
  label: string;
  impact: number; //always translate to -1..1
};
export type Graph = {
  rootNode: Node;
};
