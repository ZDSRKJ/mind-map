export default Render
declare class Render {
  constructor(opt?: {})
  opt: {}
  mindMap: any
  themeConfig: any
  renderTree: any
  reRender: boolean
  isRendering: boolean
  hasWaitRendering: boolean
  waitRenderingParams: any[]
  nodeCache: {}
  lastNodeCache: {}
  renderSource: string
  activeNodeList: any[]
  root: any
  textEdit: TextEdit
  lastBeingCopyData: any
  beingCopyData: any
  beingPasteText: string
  beingPasteImgSize: number
  currentBeingPasteType: string
  highlightBoxNode: any
  setLayout(): void
  layout:
    | MindMap
    | CatalogOrganization
    | OrganizationStructure
    | Timeline
    | VerticalTimeline
  setData(data: any): void
  bindEvent(): void
  registerCommands(): void
  selectAll(): void
  back(step: any): void
  forward(step: any): void
  insertNode(
    openEdit?: boolean,
    appointNodes?: any[],
    appointData?: any,
    appointChildren?: any[]
  ): void
  insertMultiNode(appointNodes: any, nodeList: any): void
  insertChildNode(
    openEdit?: boolean,
    appointNodes?: any[],
    appointData?: any,
    appointChildren?: any[]
  ): void
  insertMultiChildNode(appointNodes: any, childList: any): void
  insertParentNode(openEdit: boolean, appointNodes: any, appointData: any): void
  upNode(): void
  downNode(): void
  insertAfter(node: any, exist: any): void
  insertBefore(node: any, exist: any): void
  moveNodeTo(node: any, toNode: any): void
  removeNode(appointNodes?: any[]): void
  removeCurrentNode(appointNodes?: any[]): void
  pasteNode(data: any): void
  cutNode(callback: any): void
  setNodeStyle(node: any, prop: any, value: any): void
  setNodeStyles(node: any, style: any): void
  setNodeActive(node: any, active: any): void
  clearActiveNode(): void
  setNodeExpand(node: any, expand: any): void
  expandAllNode(): void
  unexpandAllNode(): void
  expandToLevel(level: any): void
  setNodeData(node: any, data: any): void
  setNodeText(node: any, text: any, richText: any, resetRichText: any): void
  setNodeImage(node: any, data: any): void
  setNodeIcon(node: any, icons: any): void
  setNodeHyperlink(node: any, link: any, title?: string): void
  setNodeNote(node: any, note: any): void
  setNodeTag(node: any, tag: any): void
  insertFormula(formula: any, appointNodes?: any[]): void
  addGeneralization(data: any): void
  removeGeneralization(): void
  setNodeCustomPosition(node: any, left?: any, top?: any): void
  resetLayout(): void
  setNodeShape(node: any, shape: any): void
  goTargetNode(node: any, callback?: () => void): void
  registerShortcutKeys(): void
  toggleActiveExpand(): void
  clearActiveNodeListOnDrawClick(e: any, eventType: any): void
  startTextEdit(): void
  endTextEdit(): void
  render(callback: () => void, source: any): void
  clearActiveNodeList(): void
  addNodeToActiveList(node: any): void
  removeNodeFromActiveList(node: any): void
  findActiveNodeIndex(node: any): any
  backForward(type: any, step: any): void
  copy(): void
  cut(): void
  paste(): void
  onPaste(): Promise<void>
  insertTo(node: any, exist: any, dir?: string): void
  checkNodeLayerChange(node: any, toNode: any): void
  deleteNodeGeneralization(node: any): void
  getNextActiveNode(): any
  copyNode(): any
  toggleNodeExpand(node: any): void
  setNodeDataRender(node: any, data: any, notRender?: boolean): void
  moveNodeToCenter(node: any): void
  setRootNodeCenter(): void
  expandToNodeUid(uid: any, callback?: () => void): void
  findNodeByUid(uid: any): any
  emitNodeActiveEvent(): void
  highlightNode(node: any, range: any): void
  closeHighlightNode(): void
}
import TextEdit from './TextEdit'
import MindMap from '../../layouts/MindMap'
import CatalogOrganization from '../../layouts/CatalogOrganization'
import OrganizationStructure from '../../layouts/OrganizationStructure'
import Timeline from '../../layouts/Timeline'
import VerticalTimeline from '../../layouts/VerticalTimeline'
