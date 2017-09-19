import React from 'react';
import ReactDom from 'react-dom';
import Page from './page.jsx';
import AccountPage from './accountPage.jsx';

ReactDom.render(<Page inside={<div className="paddedDiv"><AccountPage/></div>}/>, document.getElementById("page"));
