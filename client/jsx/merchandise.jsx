import React from 'react';
import ReactDom from 'react-dom';
import Page from './page.jsx';
import MerchandisePage from './merchandisePage.jsx';

ReactDom.render(<Page inside={<MerchandisePage/>}/>, document.getElementById("page"));
