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
/*
 *获取区间内的一个随机值
 */
function getRangeRandom(lt,gt){
	return Math.ceil(Math.random()*(gt - lt) + lt);
}

let ImgFigure = React.createClass({
	render:function(){
		let styleObj = {};

		//如果props属性中指定了这张图片的位置看，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
    }
		return (
			<figure className="img-figure" id={this.props.flag} style={styleObj}>
				<img src={this.props.data.url}  alt={this.props.data.title}  />
				<figcaption className="img-title">
					<h2>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});


let AppComponent = React.createClass({
  Constant:{
  	centerPos:{
  		left:0,
  		right:0
  	},
  	hPosRange:{	//水平方向取值范围
  		leftSecX:[0,0],
  		rightSecX:[0,0],
  		y:[0,0]
  	},
  	vPosRange:{	//垂直方向的取值范围
  		x:[0,0],
  		topY:[0,0]
  	}
  },
  getInitialState:function(){
  	return {
  		imgsArrangeArr:[]
  	};
  },
  componentDidMount: function(){
  	let stageDOM = this.refs.stage,
  		stageW = stageDOM.scrollWidth,
  		stageH = stageDOM.scrollHeight,
  		halfStageW = Math.ceil(stageW/2),
  		halfStageH = Math.ceil(stageH/2),
  		//拿到一个imageFigure的大小
  		imgFigureDOM =document.querySelector('#imgFigure0'),
  		imgW = imgFigureDOM.scrollWidth,
  		imgH = imgFigureDOM.scrollHeight,
  		halfImgW = Math.ceil(imgW/2),
  		halfImgH = Math.ceil(imgH/2);

    //计算图片中心点的位置
  	this.Constant.centerPos = {
  		left: halfStageW - halfImgW,
  		top: halfStageH - halfImgH
  	}
  	
  	
  //计算左侧，右侧区域图片排布位置的取值范围
	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
	this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
	this.Constant.hPosRange.y[0] = -halfImgH;
	this.Constant.hPosRange.y[1] = stageH - halfImgH;

	//计算上侧区域图片排布位置的取值范围
	this.Constant.vPosRange.topY[0] = -halfImgH
	this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
	this.Constant.vPosRange.x[0] = -halfStageH - imgW;
	this.Constant.vPosRange.x[1] = halfStageW;

	this.rearrange(0);
  },
  /*
   *重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange: function(centerIndex){
  	let imgsArrangeArr = this.state.imgsArrangeArr,
  		Constant = this.Constant,
  		centerPos = Constant.centerPos,
  		hPosRange = Constant.hPosRange,
  		vPosRange = Constant.vPosRange,
  		hPosRangeLeftSecX = hPosRange.leftSecX,
  		hPosRangeRightSecX = hPosRange.rightSecX,
  		hPosRangeY = hPosRange.y,
  		vPosRangeTopY = vPosRange.topY,
  		vPosRangeX = vPosRange.x,
  		imgsArrangeTopArr = [],
  		topImgNum = Math.ceil(Math.random()*2),//取一个或者不取
  		topImgSpliceIndex = 0,
  		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

  	//首选居中 centerIndex的图片
  	imgsArrangeCenterArr[0].pos = centerPos;

    console.log(topImgNum);
  	//取出要布局上侧的图片状态信息
  	topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
  	imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

  	//布局位于上侧的图片
  	imgsArrangeTopArr.forEach(function(value,index){
  		imgsArrangeTopArr[index].pos = {
  			top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
  			left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
  		}
  	});

  	//布局左右两侧的图片
  	for(let i=0,len=imgsArrangeArr.length,k=len/2; i<len; i++){
  		var hPosRangeLORX = null;

  		//前半部分布局左边，右半部分布局右边
  		if(i<k){
  			hPosRangeLORX = hPosRangeLeftSecX;
  		}else{
  			hPosRangeLORX = hPosRangeRightSecX;
  		}


  		imgsArrangeArr[i].pos = {
  			top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
  			left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
  		}
  	}

  	if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
  		imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
  	}

  	imgsArrangeArr.splice(centerIndex,0, imgsArrangeCenterArr[0]);

  	this.setState({
  		imgsArrangeArr:imgsArrangeArr
  	});
  },
  render: function() {
	let controllerUnits = [],
		imgFigures = [];

	imageDatum.forEach(function(value,index){
    if(!this.state.imgsArrangeArr[index]){
      this.state.imgsArrangeArr[index] = {
				pos:{
					left:0,
					top:0
				}
			};
		}
		imgFigures.push(<ImgFigure data={value} key={value.filename} flag={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} />);
	}.bind(this));

    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
});



AppComponent.defaultProps = {
};

export default AppComponent;