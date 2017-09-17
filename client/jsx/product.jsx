import React from 'react';
import ReactDom from 'react-dom';
import Page from './base.jsx';
import ProductPage from './productPage.jsx';

ReactDom.render(<Page inside={<ProductPage ref={(input) => {var page = input;}} refresh={page.getNumCartItems}/>}/>, document.getElementById("page"));
