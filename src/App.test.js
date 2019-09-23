import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Job from './Job';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('renders Job Table without crashing',()=>{
  const div = document.createElement('div');
  ReactDOM.render(<Job data={[]} />,div);
  ReactDOM.unmountComponentAtNode(div);
});
