require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关的数据
let imageDatum = require('../data/imageDatum.json');

//利用箭头函数且立即执行，将图片名信息转换成图片URL路径信息
imageDatum = ((imageDatumArr) => {
		for(let i=0,len=imageDatumArr.length; i<len; i++){
			let imageData = imageDatumArr[i];
			imageData.url = require('../images/'+imageData.filename);

			imageDatumArr[i] = imageData;
		}
		return imageDatumArr;
	})(imageDatum);




class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      		img-sec
      	</section>
      	<nav className="controller-nav">
      		nav
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;