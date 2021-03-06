import React from 'react';
import axios from 'axios';
import ScrollArea from 'react-scrollbar';
import './UserCart.css';

class UserCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: []
        }
        this.populateCart = this.populateCart.bind(this);
        this.deleteCartItem = this.deleteCartItem.bind(this);
    }

    async deleteCartItem(cartItemId){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            };
            let cartItemList = this.state.cartItems;
            const populatedCart = (await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`, {headers})).data;
            const response = (await axios.delete(`http://localhost:8080/cart/${populatedCart._id}/cartItem/${cartItemId}`, {headers})).data;
            cartItemList.splice(cartItemList.indexOf(cartItemList.find( (cartItem) => {
                    return String(cartItem.key) === String(cartItemId);
                })), 1);
            this.setState({cartItems: cartItemList});
        } catch (err) {
            console.log(err);
        }
    }

    async populateCart(event){
        try{
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = (await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`, {headers})).data;
            const cartItemList = [];
            response.cartItems.forEach( (cartItem) => {
                cartItemList.push(<li key={cartItem._id}>
                    {cartItem.storeItem.itemName}: {cartItem.quantity}
                    <button onClick={() => {this.deleteCartItem(cartItem._id)}}>Delete</button></li>);
            });

            this.setState({cartItems:cartItemList})

        }
        catch (e){
            console.log(e);
        }
        event.preventDefault();
    }

    displayCart() {
        if (this.state.cartItems){
            return (
                <ScrollArea speed={0.8} className="cartScrollArea" contentClassName="cartListArea" horizontal={false}>
                    <div>
                        <h1>My Cart</h1>
                        {this.state.cartItems}
                    </div>
                </ScrollArea>
            );
        }
    }

    displayUpdateButton(){
        if (this.state.cartItems){
            return (
                <button className="cartRefresh" onClick={this.populateCart}>Refresh cart!</button>
            )
        } else {
            return (
                <button className="cartRefresh" onClick={this.populateCart}>View my cart!</button>
            )
        }
    }


    render() {
        return (
            <div>
                Hello {this.props.user.firstName}
                <br/>
                <div className="cartArea">
                    {this.displayUpdateButton()}
                    {this.displayCart()}
                </div>
            </div>
        )
    }
}

export default UserCart