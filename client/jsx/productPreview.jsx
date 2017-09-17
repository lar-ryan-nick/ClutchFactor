import React from 'react';

class ProductPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		if (this.props.data == null) {
			return (
				<div></div>
			);
		}
		return (
			<div className="productPreviewDiv">
				<img className="productPreviewImage" src={"/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + "Med.png"}/>
			</div>
		);
	}
}

export default ProductPreview;
