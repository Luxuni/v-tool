export declare namespace TOOLS {
  type pointMapItem = { name: string; x?: number; y?: number; z?: number; message?: string }
  type pointMap = pointMapItem[]
  type pointMapAndRelation = {
    pointsMap: pointMap
    relation: { start: string; end: string }[]
  }
}
