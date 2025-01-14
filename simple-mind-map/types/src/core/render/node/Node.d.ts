export default Node
declare class Node {
  constructor(opt?: {})
  nodeData: any
  uid: any
  mindMap: any
  renderer: any
  draw: any
  nodeDraw: any
  lineDraw: any
  style: Style
  shapeInstance: Shape
  shapePadding: {
    paddingX: number
    paddingY: number
  }
  isRoot: any
  isGeneralization: any
  generalizationBelongNode: any
  layerIndex: any
  width: any
  height: any
  _left: any
  _top: any
  customLeft: any
  customTop: any
  isDrag: boolean
  parent: any
  children: any
  userList: any[]
  group: any
  shapeNode: any
  hoverNode: any
  _customNodeContent: any
  _imgData: any
  _iconData: any
  _textData: any
  _hyperlinkData: any
  _tagData: any
  _noteData: any
  noteEl: any
  noteContentIsShow: boolean
  _expandBtn: any
  _lastExpandBtnType: any
  _showExpandBtn: boolean
  _openExpandNode: any
  _closeExpandNode: any
  _fillExpandNode: any
  _userListGroup: any
  _lines: any[]
  _generalizationList: any[]
  _unVisibleRectRegionNode: any
  _isMouseenter: boolean
  _rectInfo: {
    imgContentWidth: number
    imgContentHeight: number
    textContentWidth: number
    textContentHeight: number
  }
  _generalizationNodeWidth: number
  _generalizationNodeHeight: number
  textContentItemMargin: any
  blockContentMargin: any
  expandBtnSize: any
  isMultipleChoice: boolean
  needLayout: boolean
  isHide: boolean
  set left(val: any)
  get left(): any
  set top(val: any)
  get top(): any
  reset(): void
  handleData(data: any): any
  createNodeData(): void
  getSize(): boolean
  getNodeRect(): {
    width: any
    height: any
  }
  layout(): void
  bindGroupEvent(): void
  active(e: any): void
  update(): void
  getNodePosInClient(
    _left: any,
    _top: any
  ): {
    left: any
    top: any
  }
  reRender(): boolean
  updateNodeActiveClass(): void
  updateNodeByActive(active: any): void
  render(callback?: () => void): void
  remove(): void
  destroy(): void
  hide(): void
  show(): void
  setOpacity(val: any): void
  hideChildren(): void
  showChildren(): void
  startDrag(): void
  endDrag(): void
  renderLine(deep?: boolean): void
  getShape(): any
  hasCustomPosition(): boolean
  ancestorHasCustomPosition(): boolean
  ancestorHasGeneralization(): boolean
  addChildren(node: any): void
  styleLine(line: any, node: any): void
  removeLine(): void
  isAncestor(node: any): boolean
  isParent(node: any): boolean
  isBrother(node: any): any
  getIndexInBrothers(): any
  getPaddingVale(): {
    paddingX: any
    paddingY: any
  }
  getStyle(prop: any, root: any): any
  getSelfStyle(prop: any): any
  getParentSelfStyle(prop: any): any
  getSelfInhertStyle(prop: any): any
  getBorderWidth(): any
  getData(key: any): any
  getPureData(removeActiveState?: boolean, removeId?: boolean): any
  hasCustomStyle(): boolean
  getRect(): any
  getRectInSvg(): {
    left: any
    right: any
    top: any
    bottom: any
    width: number
    height: number
  }
}
import Style from './Style'
import Shape from './Shape'
