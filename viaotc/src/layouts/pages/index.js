import React from 'react';
import Header from 'COMPONENTS/header';
import Navigation from 'COMPONENTS/navigation';
import Footer from 'COMPONENTS/footer';

class Container extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const { location } = this.props;
		return (
        	<div className="root">
        		<Header />
				<Navigation location={location}/>
				<div className="main">
					{this.props.children}
				</div>
				<Footer />	
        	</div>
        );
	}
}

export default Container