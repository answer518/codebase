import React from 'react';
import { NavBar, TabBar, Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import FontAwesome from 'react-fontawesome';
// import OrderList from './orderList';

// import './index.css';

function callback(key) {
  	console.log(key);
}

const tabs = [
  { title: '进行中' },
  { title: '已完成' },
  { title: '已取消' },
  { title: '申诉中' }
];

class MyOrder extends React.Component {

	constructor(props) {
		super(props);
	    this.state = {
	      title: '我的订单',
	      selectedTab: 'blueTab',
	      label: 'cog',
	      fullScreen: false,
	    };
	}

	renderTabBar(props) {
	  return (<Sticky>
	    {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
	  </Sticky>);
	}

	render() {
		const { location } = this.props;
		return (
        	<div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 600 }}>
        		<NavBar style={{ background: '#333', color: '#fff' }}>
			        <span style={{ fontSize: "80%", fontWeight: "lighter"}}>{this.state.title}</span>
			    </NavBar>
				 <StickyContainer>
					<Tabs tabs={tabs}
				        initalPage={'t2'}
				        renderTabBar={this.renderTabBar}>
				        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f0f0' }}>
				          	<div className="order-list" style={{ width: '90%', margin: '20px 0'}}>
				          		<div className="order-item">
				          			<div className="order-title" style={{color: '#fff', backgroundColor: 'blue', padding: '10px', fontSize: '1.2em', borderRadius: '10px 10px 0 0'}}>
				          				<p style={{overflow: 'hidden', lineHeight: '2em'}}>
				          					<span style={{float: 'left'}}>订单编号 1111111111111111</span>
				          					<span style={{float: 'right'}}>2017-01-01 00:00</span>
				          				</p>
				          				<p style={{overflow: 'hidden', lineHeight: '2em'}}>
				          					<span style={{marginRight: '5em'}}>BTC</span>
				          					<span>购买</span>
				          					<span style={{float: 'right'}}>136********</span>
				          				</p>
				          			</div>
				          			<div className="order-info" style={{ overflow: 'hidden', padding: '10px', backgroundColor: '#fff'}}>
				          				<div className="order-detail" style={{ overflow: 'hidden' }}>
				          					<div style={{float: 'left'}}>
					          					<p style={{overflow: 'hidden', lineHeight: '2em'}}><span>价格</span><em>5044.23</em></p>
					          					<p style={{overflow: 'hidden', lineHeight: '2em'}}><span>数量</span><em>5044.23</em></p>
					          					<p style={{overflow: 'hidden', lineHeight: '2em'}}><span>交易总额</span><em>5044.23</em></p>
					          					<p style={{overflow: 'hidden', lineHeight: '2em'}}><span>手续费</span><em>--</em></p>
				          					</div>
				          					<div className="count-down" style={{float: 'right'}}>
					          					<span style={{color: '#c00'}}>待支付</span>
					          				</div>
				          				</div>
				          				<div className="order-buttons" style={{ overflow: 'hidden', padding: '10px', float: 'right'}}>
					          				<span style={{ color: '#c00', lineHeight: '30px', float: 'left'}}>新消息提醒</span>
					          				<button style={{ background:'none', border: '1px solid #053b63', padding: '4px 15px', borderRadius: '20px', float: 'left'}}>进入交易</button>
					          				<button style={{ background:'none', border: '1px solid #ccc', padding: '4px 15px', borderRadius: '20px', float: 'left'}}>申诉</button>
					          			</div>
				          			</div>
				          		</div>
				          	</div>
				        </div>
				        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
				          Content of second tab
				        </div>
				        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
				          Content of third tab
				        </div>
				        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
				          
				        </div>
				    </Tabs>
				 </StickyContainer>
        		<TabBar
			        unselectedTintColor="#949494"
			        tintColor="#33A3F4"
			        barTintColor="white"
			        hidden={this.state.hidden}
			      >
		        <TabBar.Item
		          title={<span style={{ color: "#333" }}>交易</span>}
		          key="learn"
		          icon={<FontAwesome name='pencil-square-o'/>}
		          selectedIcon={<FontAwesome name='pencil-square-o' style={{ color: "#333" }}/>}
		          selected={this.state.selectedTab === 'blueTab'}
		          onPress={() => {
		            this.setState({
		              selectedTab: 'blueTab',
		            });
		            hashHistory.push('/')
		          }}
		          data-seed="logId">
		        </TabBar.Item>
		        <TabBar.Item
		          icon={<FontAwesome name='hand-spock-o'/>}
		          selectedIcon={<FontAwesome name='hand-spock-o' style={{ color: "#333" }}/>}
		          title={<span style={{ color: "#333" }}>订单</span>}
		          key="community"
		          selected={this.state.selectedTab === 'redTab'}
		          onPress={() => {
		            this.setState({
		              selectedTab: 'redTab',
		            });
		            hashHistory.push('/s2')
		          }}
		          data-seed="logId1"
		        >
		        </TabBar.Item>
		        <TabBar.Item
		          icon={<FontAwesome name='commenting-o'/>}
		          selectedIcon={<FontAwesome name='commenting-o' style={{ color: "#333" }}/>}
		          title={<span style={{ color: "#333" }}>资产</span>}
		          key="message"
		          dot
		          selected={this.state.selectedTab === 'greenTab'}
		          onPress={() => {
		            this.setState({
		              selectedTab: 'greenTab',
		            });
		            hashHistory.push('/s3')
		          }}
		        >
		        </TabBar.Item>
		        <TabBar.Item
		          icon={<FontAwesome name='user-o'/>}
		          selectedIcon={<FontAwesome name='user-o' style={{ color: "#333" }}/>}
		          title={<span style={{ color: "#333" }}>我的</span>}
		          key="me"
		          selected={this.state.selectedTab === 'yellowTab'}
		          onPress={() => {
		            this.setState({
		              selectedTab: 'yellowTab',
		            });
		            hashHistory.push('/s4')
		          }}
		        >
		        </TabBar.Item>
		      </TabBar>
        	</div>
        );
	}
}

export default MyOrder