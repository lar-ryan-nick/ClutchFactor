import React from 'react';

class CartItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.data == null || this.props.data == {}) {
			return (
				<div></div>
			);
		}
		let remove = [];
		if (this.props.data.loading == true) {
			remove.push(<div key="1" className="loader"></div>);
		} else {
			remove.push(<button key="1" className="removeProductButton" onClick={this.props.removeItem}>Remove from cart</button>);
			if (this.props.data.response != null) {
				remove.push(<div key="2"><img key="3" className="icon" src="/RedXIcon.png"/><p key="4" className="errorLabel">{this.props.data.response}</p></div>);
			}
		}
		return (
			<div className="cartItemDiv">
				<img className="productImage" src={"/" + this.props.data.modelname + this.props.data.articletype + this.props.data.color + "Low.png"}/>
				<div className="TitleAndOptionsDiv">
					<a className="productTitle" href={"/product.html?id=" + this.props.data.productid}>{this.props.data.modelname + " " + this.props.data.articletype + " - " + this.props.data.color}</a>
					{remove}	
				</div>
				<p className="cartPriceTitle">{"$" + this.props.data.price}</p>
			</div>
		);
	}
}

export default CartItem;
