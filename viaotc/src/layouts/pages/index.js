import React from 'react';
import Header from 'COMPONENTS/header';
// import Navigation from 'COMPONENTS/navigation';
// import Footer from 'COMPONENTS/footer';

class Container extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
        	<div className="root">
        		<Header />
        	</div>
        );
	}
}

export default Container