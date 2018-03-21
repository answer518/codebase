import React,{Component} from 'react';

import MostVisite from './MostVisite';
import Search from './Search';

export default class extends Component{

  render(){
    return(
      <div className="home">
        <Search {...this.props} />
        <MostVisite />
      </div>
    )
  }
}