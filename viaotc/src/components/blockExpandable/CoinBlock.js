import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { getBaseUrl } from 'utils/util';

class CoinBlock extends Component {

	static displayName = 'CoinBlock';

	constructor(props){
		super(props)
	}

	static propTypes = {
		onBlockClick: PropTypes.func
	}

	getTrendSymbol(up){
		if (up > 0){
			return '+'
		} else if (up < 0){
			return '-'
		} else {
			return ''
		}
	}

	getBaseUrl() {
		return '//cn-cdn.jtcool.com'
	}

	render(){

		const { item, onBlockClick, active } = this.props;
		const { coin_type='', currency, price, percent, up, src=1, base_coin } = item;

		const cls = classNames({
			'coin-block': true,
			'clearfix': true,
			'coin-block-active': active
		});

		const trendCls = classNames({
			'coin-price-trend': true,
			'coin-price-up': up > 0, 
			'coin-price-down': up < 0
		});

		const symbol = this.getTrendSymbol(up);

		return (
			<div
				className={cls}
				onClick={onBlockClick}
			>
				<img src={`${this.getBaseUrl()}/www/${coin_type.toLowerCase()}.png`} />
				<div className="coin-exchange-info">
					<div className="coin-type">{coin_type.toUpperCase()}</div>
					<div className="exchange-unit">/{base_coin}</div>
				</div>
				<div className="coin-info">
					<div className="coin-price">{price}</div>
					<div className={trendCls}>{`${symbol}${(percent*100).toFixed(2)}%`}</div>
				</div>
			</div>
		)

	}
}

export default CoinBlock