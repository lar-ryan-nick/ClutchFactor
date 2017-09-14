import React from 'react';
import ReactDom from 'react-dom';
import {Page} from './base.jsx';

ReactDom.render(<Page inside={<div><p className="landingText">Let's cut the bullshit here's our shit</p><a className="merchandiseLink" href="/merchandise.html">Start Shopping</a></div>}/>, document.getElementById("page"));
