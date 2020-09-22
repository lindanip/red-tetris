import React from 'react';
import ReactDOM from 'react-dom';


let name = 'some';
const template = <h1> hello from react2{name} </h1>;

ReactDOM.render(template, document.getElementById('app'));