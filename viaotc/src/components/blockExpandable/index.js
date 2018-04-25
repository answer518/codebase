import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import CoinBlock from './CoinBlock';
import BuySellInfo from './BuySellInfo';
import './index.less';

class BlockExpandable extends Component {

	static displayName = 'BlockExpandable';

	constructor(props){
		super(props);
		this.state = {
			active: -1,
			blockActive: -1,
			position: 0,
			item: {}
		};
	}

	static defaultProps = {
		blocks: [],
		step: 3
	};

	handleClick(groupIndex, index, position, item){
		this.setState((prev) => {
			return {active: groupIndex, blockActive: prev.blockActive === index ? -1 : index, position, item}
		});
	}

	renderBlock() {
		const { blocks, url, param, step } = this.props;
		const { active, blockActive, position, item } = this.state;
		let items = [], group = 0;
		const chunks = chunk(blocks, step);

		chunks.forEach((chunk, i) => {
			const blockGroup = chunk.map((group, m) => {
				return (<CoinBlock
							onBlockClick={this.handleClick.bind(this, i, i*step + m, m, group)}
							active = {blockActive === (i*step + m)}
							item={group}
							key={`${m}-${i}`}
					/>)
			});

			items = items.concat(<div className="block-group clearfix" key={`group-${i}`}>{blockGroup}</div>);
			(active === i && blockActive !== -1) && items.push(<BuySellInfo 
					url={url}
					coin_type={item.coin_type || ''}
					position={position}
					key={`${group}-expand`}
			/>);
		});		

		return items;
	}

	render(){
		
		return (
			<div className="block-expandable">
				{this.renderBlock()}
			</div>
		)
	}
}

export default BlockExpandable;