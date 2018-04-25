import React, { PureComponent } from 'react';
import { Link } from 'react-router';

class Footer extends PureComponent {

	static displayName = 'Footer';

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="footer">
				<div className="footer-content">
					<div className="about-us">
						<ul className="clearfix">
							{<li>
								<a href="#">关于我们</a>
							</li>}
							<li>
								<Link to="/app/protocol">服务条款</Link>
							</li>
							<li>
								<Link to="/app/viaOtcFee">费率说明</Link>
							</li>
							{<li>
								<a href="#">工单支持</a>
							</li>}
							{<li>
								<a href="#">常见问题</a>
							</li>}
						</ul>
					</div>
					<div className="copyright">
						Copyright © 2017 ViaOTC Inc. 保留所有权利
					</div>					
				</div>
			</div>
		)
	}
}

export default Footer;