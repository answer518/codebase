import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimulateTable from 'COMPONENTS/simulateTable';
import ajax from '../../utils/fetch';

class CoinTableWrap extends Component {

	static displayName = 'CoinTableWrap';

	constructor(props){
		super(props);
		this.state = {
			data: []
		};
		this.timer = null;
	}

	static propTypes = {
		columns: PropTypes.array,
		data: PropTypes.array
	};

	static defaultProps = {
		interval: 10000
	};	

	componentDidMount(){
		const { url, coin_type, ad_type } = this.props;
		if (!url || !coin_type) return;
		this.getCoinAd(url, coin_type, ad_type);
	}

	componentWillReceiveProps(nextProps){
		const { url, coin_type } = this.props;
		const { url:nextUrl, coin_type:nextCoinType, ad_type } = nextProps;
	
		if (nextCoinType && (nextUrl !== url || nextCoinType !== coin_type)){
			this.clearTimer();
			this.timer = this.getCoinAd(nextUrl, nextCoinType, ad_type);
		}
	}

	componentWillUnmount(){
		this.clearTimer();
	}	

	clearTimer(){
		if (this.timer){ clearTimeout(this.timer); }
	}	

	getCoinAd(url, coin_type, ad_type){
		const { interval } = this.props;
		this.clearTimer();
		ajax.get(url, {coin_type, ad_type, page: 1, page_size: 3}, interval/1000) 
			.then((response) => {
				const { error, data } = response; 
				if (error == 0){
					this.setState({data: data.ads || []});
				}
			});
		this.timer = setTimeout(() => {
			this.getCoinAd(url, coin_type, ad_type);	
		}, interval);
	}	

	render(){
		const { columns, footer } = this.props;
		const { data } = this.state;

		return (
			<div className="coin-table-wrap">
				<SimulateTable
					columns={columns}
					data={data}
					footer={footer}
				/>				
			</div>
		)
		
	}
}

export default CoinTableWrap