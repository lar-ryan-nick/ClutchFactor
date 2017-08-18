import React from 'react';
import ReactDom from 'react-dom';
import Header from './base.jsx';
import Footer from './base.jsx';

ReactDom.render(<Header/>, document.getElementById("header"));
ReactDom.render(<Footer/>, document.getElementById("footer"));
