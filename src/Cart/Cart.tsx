import CartItem from "../CartItem/CartItem";
//types
import {CartItemType} from "../App";
//styles
import {Wrapper} from "./Cart.styles";
import React from "react";
import item from "../Item/Item";

type Props = {
    cartItems: CartItemType[],
    addToCart: (clickedItem: CartItemType) => void,
    removeFromCart: (id: number) => void
}

const Cart: React.FC<Props> = ({cartItems, addToCart, removeFromCart}) => {

    const calculateTotalAmount = (items: CartItemType[]) => {
        return items.reduce((accumulator: number, item) =>
                accumulator + (item.amount * item.price)
            , 0);
    }
    return (<Wrapper>
        <h2>Your Shopping Cart</h2>
        {cartItems.length === 0 ? `Your cart is empty` : null}
        {cartItems.map((item) => {
            return (<CartItem key={item.id} addToCart={addToCart} removeFromCart={removeFromCart} item={item}/>)
        })
        }
        <h2>Total Amount: ${calculateTotalAmount(cartItems).toFixed(2)}</h2>
    </Wrapper>);
}

export default Cart;