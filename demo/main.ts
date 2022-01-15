import element from "./sle/index.js";

element("el-one", /*css*/`
  :host {
    display: block;
    padding: 3em 0;
    text-align: center;
    background: #FF0000;
    color: #FFF;
  }
`);


element("el-two", /*css*/`
  :host {
    display: inline-block;
    padding: 3em;
    text-align: center;
    background: #003399;
    color: #FFF;
  }
`, /*html*/`<slot></slot><br/><img src="https://picsum.photos/400/200" />`);


element("el-three", /*css*/`
  :host {
    display: inline-block;
    padding: 3em;
    text-align: center;
    background: #009933;
    color: #FFF;
  }
  span {
    cursor: pointer;
  }
`, function (el, html) {
  return html`<span @click=${(): any => el.requestUpdate()}>Dynamic Content: ${Math.random()}, click here to update</span>`;
});
