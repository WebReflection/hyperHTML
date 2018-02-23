type TemplateFunction<T> = (template: TemplateStringsArray, ...values: any[]) => T;
type HyperTemplateFunction = TemplateFunction<any>;

export declare class Component<T = {}> {
  handleEvent(e: Event): void;
  html: HyperTemplateFunction;
  svg: HyperTemplateFunction;
  state: T;
  defaultState: T;
  setState(state: Partial<T> | ((this: this, state: T) => Partial<T>)): void;
}

export declare function bind<T extends Element>(element: T): TemplateFunction<T>;

export declare function define(intent: string, callback: Function): void;

export declare function diff(
  parentNode: Node,
  currentNodes: Node[],
  futureNodes: Node[],
  getNode?: ((item: Node) => Node) | null,
  beforeNode?: Node | null,
): Node[];

export declare function wire(obj?: object | null, type?: string): HyperTemplateFunction;

export declare const hyper: {
  Component: typeof Component;
  bind: typeof bind;
  define: typeof define;
  diff: typeof diff;
  hyper: typeof hyper;
  wire: typeof wire;

  // hyper(null, 'html')`HTML`
  (obj: null | undefined, type?: string): HyperTemplateFunction;

  // hyper('html')`HTML`
  (type: string): HyperTemplateFunction;
  
  // hyper(element)`HTML`
  <T extends Element>(element: T): TemplateFunction<T>;

  // hyper`HTML`
  (template: TemplateStringsArray, ...values: any[]): any;

  // hyper(obj, 'html:id')`HTML`
  // hyper(obj)`HTML`
  (obj: object, type_id?: string): HyperTemplateFunction;

  // hyper()`HTML`
  (): HyperTemplateFunction;
};

export default hyper;
