import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { isEqual } from 'lodash';
// import ajax from 'utils/request';
// import NewsList from 'pages/component/NewsList';
import { connect } from 'react-redux';
import * as globalAction from '../../redux/actions';
import { bindActionCreators } from 'redux';
import './index.less';

const lists = [{
	name: '资产管理',
	link: '/app/assetManage',
	key: 'assetManage'
},{
	name: '我的订单',
	link: '/app/userCenter',
	key: 'myOrder'
},{
	name: '我的广告',
	link: '/app/userCenter/tradeInfo',
	key: 'orderInfo'
},{
	name: '安全设置',
	link: '/app/userCenter/secureSetting',
	key: 'secureSetting'
},{
	name: '身份认证',
	link: '/app/userCenter/identityAuth',
	key: 'identityInfo'
},{
	name: '退出账号',
	key: 'logout'
}];

const languages = [{
	name: '简体中文',
	key: 'china'
},{
	name: 'English',
	key: 'english'
}]

class Header extends Component {

	static displayName = 'Header';

	constructor(props){
		super(props);
		this.state = {
			news: 0,
			listShow: false,
			languageShow: false,
			activeItem: {
				name: '简体中文',
				key: 'china'
			}
		};
		this.handleListShow = this.handleListShow.bind(this);
		this.handleLanguageClick = this.handleLanguageClick.bind(this);
		this.handlelanguageShow = this.handlelanguageShow.bind(this);
		this.handleClickOutSide = this.handleClickOutSide.bind(this);
		this.getListRef = this.getListRef.bind(this);
		this.getLanguageRef = this.getLanguageRef.bind(this);
	};

	componentDidMount(){
		window.addEventListener('click', this.handleClickOutSide);
	}

	shouldComponentUpdate(nextProps, nextState){
		return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
	}

	componentWillUnmount(){
		window.removeEventListener('click', this.handleClickOutSide);
	}

	getListRef(ref){
		this.listDom = ref;
	}

	getLanguageRef(ref){
		this.languageDom = ref;
	}

	logout(){
		const { actions } = this.props;
		ajax.get('/api/logout')
			.then((response) => {
				if (response.error == 0){
					actions.userLogout();
					browserHistory.push('/');
				}
			});
	}

	handleClickOutSide(e){
		if (this.listDom && this.listDom.contains(e.target) || this.languageDom && this.languageDom.contains(e.target)) return;
		this.setState({listShow: false, languageShow: false});
	}

	handleListShow(){
		this.setState((prev) => {
			return {listShow: !prev.listShow, languageShow: false}
		})
	}

	handleListClick(key, link){
		this.setState({listShow: false});
		if (link){
			browserHistory.push(link);
			return;
		}

		if (key === 'logout'){
			this.logout();
		}
	}

	handleLanguageClick(item){
		this.setState({activeItem: item, languageShow: false});
	}

	renderLists(){
		return lists.map((select, i) => {
			const { name, link, key } = select;

			return (
				<div 
					className="custom-select-item"
					onClick={this.handleListClick.bind(this, key, link)}
					key={key}
				>
					{name}
				</div>)
		});
	}	

	handlelanguageShow(){
		this.setState((prev) => {
			return {languageShow: !prev.languageShow, listShow: false}
		})		
	}	

	renderLanguages(){
		return languages.map((language, i) => {
			const { name, key } = language;
			return (
				<div 
					className="custom-select-item"
					onClick={this.handleLanguageClick.bind(this, language)}
					key={key}
				>
					{name}
				</div>)			
		});
	} 

	render(){
		const { username, avatar, is_logged } = this.props.globalState.login;

		const { news, listShow, activeItem, languageShow } = this.state;
		const uid = window.OTC.uid ? `(${window.OTC.uid})` : '';
		const listHead = classNames({
			'list-active': listShow
		});

		const languageHead = classNames({
			'list-active': languageShow
		});

		return (
			<div className="header">
				<div className="header-content">
					<span className="welcome">您好，欢迎来到ViaOTC！</span>
					<div className="operate-block">
						{is_logged == 1 && <div 
							className="operate-block-item user-operate"
							ref={this.getListRef}
						>
							<div className={listHead}
								onClick={this.handleListShow}
							>
								<img src={avatar} className="inline"/>
								<span className="username substr">{`${username}${uid}`}</span>
								<div className="arrow"></div>	
							</div>
							{listShow && <div className="custom-select-body">
								{this.renderLists()}
							</div>}													
						</div>}	
						{/*is_logged == 1 && <NewsList /> */}					
						{/*is_logged && <div className="operate-block-item notice">消息</div>*/}						
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
  return { 
  	actions: bindActionCreators(globalAction, dispatch) 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);