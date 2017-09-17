import React from 'react';
import ReactDom from 'react-dom';
import Page from './page.jsx';
import AccountPage from './accountPage.jsx';

ReactDom.render(<Page inside={<AccountPage/>}/>, document.getElementById("page"));
