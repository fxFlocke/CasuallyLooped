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
  allowance: number;
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
  y: number,
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
  begin: number,
  end: number,
  arrowLength: number
}
export type Configuration = {
  editingMode: string;
  node?: NodeConfiguration;
  edge?: EdgeConfiguration;
  geometries: NodeGeometry[]
};
export type Signal = {
  identifiers: SignalIdentifiers,
  delta: number
  position: number
  scale: number
}
export type SignalIdentifiers = {
  strength: number
  nodeID: number,
  edgeID: number
  receiverID: number
}
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
  allowance: number
};
export type EdgeReference = {
  node: number,
  edge: number
}
export type TextElement = {
  text: string,
  pos: Position,
}
export type NodeElement = {
  node: Node;
  config: NodeConfiguration;
  geometry: NodeGeometry;
  edges: EdgeElement[];
  edgeReferences: EdgeReference[]
};
export type EdgeElement = {
  edge: Edge;
  config: EdgeConfiguration;
  geometry: EdgeGeometry;
};
export type Loopy = {
  nodes: NodeElement[],
  texts: TextElement[],
  dimensions: Position
}

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
