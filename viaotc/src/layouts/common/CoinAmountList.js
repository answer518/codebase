import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Table } from 'antd';
import ClickOutside from 'react-click-outside';
import ajax from '../../utils/fetch';

const columns = [{
	title: '币种',
	dataIndex: 'coin_type',
	key: 'coin_type'
},{
	title: '可用',
	dataIndex: 'usable',
	key: 'usable'
},{
	title: '锁定',
	dataIndex: 'locked',
	key: 'locked'
},{
	title: '冻结',
	dataIndex: 'freeze',
	key: 'freeze'
},{
	title: '人民币',
	dataIndex: 'balance_cny',
	key: 'balance_cny',
	render: (text) => {
		return `≈${text}`
	}
}];

class CoinAmountList extends Component {

	static displayName = 'CoinAmountList';  

	constructor(props){
		super(props);
		this.state = {
			show: false,
			balance: []
		};
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount(){
		this.getBalance();
	}

	getBalance(){
		ajax.get('/api/balance')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({balance: data.balance});
				}
			})
	}

	handleShow(){
		this.setState((prev) => {
			if (!prev.show){
				this.getBalance();
			}
			return {show: !prev.show}
		})
	}

	handleClose(){
		this.setState({show: false}); 
	}

	render(){
		const { show, balance } = this.state;

		return (
			<div className="coin-amount-list">
				<ClickOutside onClickOutside={this.handleClose}> 
					<div className="coin-amount-head" onClick={this.handleShow}></div>
					{show &&
						<div className="coin-amount-body">
							<div className="coin-amount-body-head"></div>
							<div className="coin-amount-body-content">
								<Table 
									columns={columns}
									dataSource={balance}
									pagination={false}
								/>
							</div>
						</div>
					}
				</ClickOutside>
			</div>
		)
		
	}
}

export default CoinAmountList
