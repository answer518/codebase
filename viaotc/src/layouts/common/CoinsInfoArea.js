import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlockExpandable from 'COMPONENTS/blockExpandable';
import ajax from '../../utils/fetch';

class CoinsInfoArea extends Component {

    static displayName = 'CoinsInfoArea';

    constructor(props) {
        super(props);
        this.state = {
            blocks: []
        };
        this.getCoins = this.getCoins.bind(this);
        this.timer = null;
    }

    componentDidMount() {
        this.getCoins();
    }

    componentWillUnmount() {
        // if (this.timer) { clearTimeout(this.timer) }
    }

    getCoins() {
        // if (this.timer) { clearTimeout(this.timer) }
        ajax('/api/market', {

        }).then((response) => {
            const { msg, data } = response;
            
            if (msg.toLowerCase() == 'ok') {
            	console.log(data);
                this.setState({ blocks: data });
            }
        });

        // this.timer = setTimeout(() => {
        //     this.getCoins();
        // }, 2000);
    }

    render() {

        const { blocks } = this.state;
        return (
        	<div className="coins-info-area">
           		<BlockExpandable blocks={blocks} />
            </div>
        )
    }
}

export default CoinsInfoArea;
