import React from 'react';
import { NavBar,TabBar } from 'antd-mobile';
const TabPane = Tabs.TabPane;

import './index.css';

function callback(key) {
  	console.log(key);
}

class MyOrder extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const { location } = this.props;
		return (
        	<div className="container">
        		 <NavBar>
        		 	<div style={{ position: 'relative', height: '80%' }}>我的订单</div>
        		 </NavBar>
        	</div>
        );
	}
}

export default MyOrder