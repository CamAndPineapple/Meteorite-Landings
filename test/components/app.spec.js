import React from 'react';
import ReactDom from 'react-dom';
import { ReactTestUtils, expect, assert } from '../test_helper';
import App from '../../src/components/app';

describe('App', () => {

  let renderedComponent;
  let DOMNode;

  before('render and locate element', () => {
    renderedComponent = ReactTestUtils.renderIntoDocument(<App />);
    DOMNode = ReactDom.findDOMNode(renderedComponent);

  });

  it('can be rendered', () => {
    assert(renderedComponent);
  });

  it('has class name "test" ', () => {
      expect(DOMNode.classList.length).to.equal(1);
      expect(DOMNode.classList[0]).to.equal('test');
  });


});
