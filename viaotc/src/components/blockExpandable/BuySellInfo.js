import React, { Component } from 'react';
import { Link } from 'react-router';
import { isEmpty, isEqual, isNil } from 'lodash';
import PropTypes from 'prop-types';
import CoinTableWrap from './CoinTableWrap';
import ajax from '../../utils/fetch';
// import { getAvatar } from 'utils/util';
// import { defaultFooter } from 'utils/tableUtil';

const buyColumns = [
		{
			title: () => {
				return (<span style={{fontSize: '18px', color: '#195efa'}}>卖家信息</span>)
		}, 
			dataKey: 'username',
			width: '19%',
			key: 'username',
			render: (text, record, index) => {
				return (<div className="user-wrap">
					<img className="user-img" src={getAvatar(record.avatar)}/>
					<div className="user-info">
						<div className="user-name substr">{text}</div>
					</div>
				</div>)
			}
		},
		{
			title: '交易价格',
			dataKey: 'price',
			key: 'price',
			width: '16%',
			render: (text, record, index) => {
				return <span>{`${text} ${record.currency}`}</span>
			}			
		},{
			title: '交易限额',
			dataKey: 'min_amount',
			key: 'min_amount',
			width: '15%',
			render: (text, record) => {
				return `${text}-${record.max_amount}`
			}
		},	
		{title: '交易次数', dataKey: 'order_times', width: '9%'},
		{title: '付款方式', dataKey: 'pay_method', width: '15%',
			render: (text, record, index) => {
				return text.join('/')
			}
		}, 
		{title: '平均放行时间', dataKey: 'unlock_avg_period', width: '11%',
			render: (text, record, index) => {
				const newText = isNil(text) ? '-' : `${text}分钟`;
				return <span>{newText}</span>
			}			 
		}, 
		{title: '操作', dataKey: 'operate', width: '15%', className: 'operate-td', 
			render: (text, record) => {
				const { ad_id, user_id } = record;
				const actionText = (window.OTC.id == user_id) ? '查看' : '买入'; //是否自己
				return (<Link className="button" to={{pathname: "/app/dealCenter/detail/buy", query: {ad_id}}}>{actionText}</Link>)
			}
		}
];

const sellColumns = [
		{
			title: () => {
				return (<span style={{fontSize: '18px', color: '#1cbb66'}}>买家信息</span>)
		}, 
			dataKey: 'username',
			key: 'username',
			width: '19%',
			render: (text, record, index) => {
				return (<div className="user-wrap">
					<img className="user-img" src={getAvatar(record.avatar)}/>
					<div className="user-info">
						<div className="user-name substr">{text}</div>
					</div>
				</div>)
			}
		},
		{
			title: '交易价格',
			dataKey: 'price',
			key: 'price',
			width: '16%',
			render: (text, record, index) => {
				return <span>{`${text} ${record.currency}`}</span>
			}				
		},{
			title: '交易限额',
			dataKey: 'min_amount',
			key: 'min_amount',
			width: '15%',
			render: (text, record) => {
				return `${text}-${record.max_amount}`
			}
		},
		{title: '交易次数', dataKey: 'order_times', width: '9%'},
		{title: '付款方式', dataKey: 'pay_method', width: '15%',
			render: (text, record, index) => {
				return text.join('/')
			}
		}, 
		{title: '平均放行时间', dataKey: 'unlock_avg_period', width: '11%',
			render: (text, record, index) => {
				const newText = isNil(text) ? '-' : `${text}分钟`;
				return <span>{newText}</span>
			}			
		}, 
		{title: '操作', dataKey: 'operate', width: '15%', className: 'operate-td',  
			render: (text, record) => {
				const { ad_id, user_id } = record;
				const actionText = (window.OTC.id == user_id) ? '查看' : '卖出'; //是否自己	
				return (<Link className="button" to={{pathname: "/app/dealCenter/detail/sell", query: {ad_id: record.ad_id}}} style={{backgroundColor: '#1cb78d'}}>{actionText}</Link>)							
			}
		}
];


class BuySellInfo extends Component {

	static displayName = 'BuySellInfo';

	constructor(props){
		super(props);
	}

	render(){
		const { position, url, coin_type='' } = this.props;

		const left = 15 + position * 35;

		return (
			<div className="buy-sell-info">
				<div className="arrow-wrap"> 
					<div className="arrow" style={{marginLeft: `${left}%`}}></div>
				</div>	
				<div className="buy-info">
					<CoinTableWrap 
						ad_type="sell"
						url={url}
						coin_type={coin_type}
						columns={buyColumns}
						footer={defaultFooter(`/app/dealCenter/buyList?coin_type=${coin_type.toLowerCase()}`)}
					/>
				</div>
				<div className="sell-info">
					<CoinTableWrap 
						ad_type="buy"
						url={url}
						coin_type={coin_type}						
						columns={sellColumns}
						footer={defaultFooter(`/app/dealCenter/sellList?coin_type=${coin_type.toLowerCase()}`)}
					/>							
				</div>
			</div>
		)
		
	}
}

export default BuySellInfo;