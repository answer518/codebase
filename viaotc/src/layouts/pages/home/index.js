import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoinsInfoArea from '../../common/CoinsInfoArea';
import * as globalAction from '../../../redux/actions';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';

class HomePage extends Component {
    static displayName = 'HomePage';

    constructor(props) {
        super(props);
        this.handleBannerClick = this.handleBannerClick.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleBannerClick(type) {
        const { is_logged } = this.props.globalState;
        if (type == 'notice') {
            browserHistory.push('/app/userCenter/noticeDetail');
        } else if (type == 'register') {
            if (is_logged == 1) return;
            browserHistory.push('/app/entrance/register');
        }
    }

    handleRegister(e) {
        e.stopPropagation();
    }

    render() {
		const { is_logged } = this.props.globalState.login;
		const baseUrl = '//cn-cdn.jtcool.com';
		return (
			<div className="body-content">
				<div className="carousel-container">
					<div className="login-register-wrap">
						{is_logged != 1 && <LoginForm/>}
						<Carousel autoplay className="banner">
						    <div className="banner-wrap" onClick={this.handleBannerClick.bind(this, 'notice')}>
						    	<img src={`${baseUrl}/www/banner_2.jpg`}/>
						    	{is_logged != 1 && <Link className="link-btn" to="/app/entrance/register" onClick={this.handleRegister}>注册有礼</Link>}
						    </div>
						    <div className="banner-wrap" onClick={this.handleBannerClick.bind(this, 'register')}>
						    	<img src={`${baseUrl}/www/banner_3.jpg`}/>
						    </div>										    						
						</Carousel>
					</div>
				</div>	
				<div className="coin-list-container">
					<CoinsInfoArea />
					<div className="suspend-operate chat">
						<div className="service-qrcode">
							<p>客服微信</p>
							<img src={`${baseUrl}/www/kefu.jpg`} />
						</div>
					</div>					
				</div>
				<div className="product-advantage">
					<div className="product-advantage-content">
						<h1>专业、安全、负责的服务平台</h1>
						<div className="product-advantage-items clearfix">
							<div className="product-advantage-item">
								<div className="product-advantage-img icon-technology"></div>
								<div className="title">技术</div>
								<div className="detail">
									<p>专业团队精心打造</p>
									<p>多年数字资产从业经验</p>
								</div>
							</div>
							<div className="product-advantage-item">
								<div className="product-advantage-img icon-security"></div>
								<div className="title">安全</div>
								<div className="detail">
									<p>多层安全构架实施</p>
									<p>数字资产多重签名冷钱包存储</p>
								</div>
							</div>
							<div className="product-advantage-item">
								<div className="product-advantage-img icon-service"></div>
								<div className="title">服务</div>
								<div className="detail">
									<p>7x24小时贴心服务</p>
									<p>保障用户真实可信交易安全</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
    }
}

function mapStateToProps(state) {
  return {globalState: state}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(globalAction, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
