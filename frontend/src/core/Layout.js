import { Component } from './Component.js';

/**
 * Base class for layouts. A layout owns the app chrome (sidebar, navbar...)
 * and exposes `outlet`, the element where the Router mounts pages.
 */
export class Layout extends Component {
  get outlet() {
    return this.$('#main-content');
  }
}
