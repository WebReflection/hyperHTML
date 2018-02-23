type TemplateFunction<T> = (template: TemplateStringsArray, ...values: any[]) => T;
export type BoundTemplateFunction<T extends Element> = TemplateFunction<T>;
export type WiredTemplateFunction = TemplateFunction<any>;

export declare class Component<T = {}> {
  handleEvent(e: Event): void;
  html: WiredTemplateFunction;
  svg: WiredTemplateFunction;
  state: T;
  readonly defaultState: T;
  setState(state: Partial<T> | ((this: this, state: T) => Partial<T>)): void;
}

export declare function bind<T extends Element>(element: T): BoundTemplateFunction<T>;

export declare function define(intent: string, callback: Function): void;

export declare function wire(obj?: object | null, type?: string): WiredTemplateFunction;

export declare const hyper: {
  Component: typeof Component;
  bind: typeof bind;
  define: typeof define;
  hyper: typeof hyper;
  wire: typeof wire;

  // hyper(null, 'html')`HTML`
  (obj: null | undefined, type?: string): WiredTemplateFunction;

  // hyper('html')`HTML`
  (type: string): WiredTemplateFunction;
  
  // hyper(element)`HTML`
  <T extends Element>(element: T): BoundTemplateFunction<T>;

  // hyper`HTML`
  (template: TemplateStringsArray, ...values: any[]): any;

  // hyper(obj, 'html:id')`HTML`
  // hyper(obj)`HTML`
  (obj: object, type_id?: string): WiredTemplateFunction;

  // hyper()`HTML`
  (): WiredTemplateFunction;
};

export default hyper;
