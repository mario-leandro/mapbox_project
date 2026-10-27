import { Component } from './Component.js';

/** Base class for routed pages. Props are injected by the Router. */
export class Page extends Component {
  /** Used for document.title and the screen reader announcement. */
  get title() {
    return '';
  }
  get params() {
    return this.props.params ?? {};
  }
  get query() {
    return this.props.query ?? {};
  }
  get router() {
    return this.props.router;
  }
  get store() {
    return this.props.store;
  }
}
