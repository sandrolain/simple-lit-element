import { CSSResultGroup, html, LitElement, TemplateResult, unsafeCSS, css } from "lit";

class SimpleLitElement extends LitElement {
  protected state: Map<string, any> = new Map();
  setState (key: string | Record<string, any>, value?: any): void {
    if(typeof key === "string") {
      this.state.set(key, value);
    } else {
      for(const [k, v] of Object.entries(key)) {
        this.state.set(k, v);
      }
    }
    this.requestUpdate();
  }
  getState (key?: string, defaultValue?: any): any {
    if(typeof key === "string") {
      return this.state.get(key) ?? defaultValue;
    }
    return Array.from(this.state.entries()).reduce((ret, [key, value]) => {
      ret[key] = value;
      return ret;
    }, {} as Record<string, any>);
  }
}

export type ElementRenderResult = TemplateResult | string | Node;
export type ElementRender = ElementRenderResult | ((element: SimpleLitElement, htmlFn: typeof html, cssFn: typeof css) => ElementRenderResult);

export default function element (tagName: string, styles?: CSSResultGroup | string, content?: ElementRender): typeof SimpleLitElement {

  if(typeof styles === "string") {
    styles = unsafeCSS(styles);
  }

  const parseContent = (content: ElementRender): (() => TemplateResult) => {
    let render: () => TemplateResult = (): TemplateResult => html`<slot></slot>`;
    if(typeof content === "function") {
      render = function (): TemplateResult {
        return parseContent(content(this, html, css))();
      };
    } else if(typeof content === "string") {
      const template = document.createElement("template");
      template.innerHTML = content;
      render = (): TemplateResult => html`${template.content.cloneNode(true)}`;
    } else if(content instanceof Node) {
      render = (): TemplateResult => html`${content.cloneNode(true)}`;
    } else if(content) {
      render = (): TemplateResult => html`${content}`;
    }
    return render;
  };

  const render = parseContent(content);

  const cls = class extends SimpleLitElement {
    static styles = (styles as CSSResultGroup) ?? LitElement.styles;
    protected render = render;
  };

  window.customElements.define(tagName, cls);

  return cls;
}
