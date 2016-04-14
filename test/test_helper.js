import jsdom from 'jsdom'; // in-js implementatin of the DOM w/o the browser
import jquery from 'jquery';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOM from  'react-dom';
import React from 'react';
import chai, { expect, assert } from 'chai';
import chaiJquery from 'chai-jquery';

// Define some html to be our basic document
// JSDOM will consume this and act as if we were in a browser
const DEFAULT_HTML = '<html><body></body></html>';

// Define some variables to make it look like we're a browser
// First, use JSDOM's fake DOM as the document
global.document = jsdom.jsdom(DEFAULT_HTML);

// Set up a mock window
global.window = document.defaultView;

// Allow for things like window.location
global.navigator = window.navigator;

export { expect, assert, ReactTestUtils };
