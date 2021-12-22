import {useState} from "react";
import {useQuery} from "react-query";
//components
import Drawer from "@material-ui/core/Drawer";
import Item from "./Item/Item"
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import Cart from "./Cart/Cart";

//Styles
import {Wrapper, StyledButton} from "./App.styles";
//types
export type CartItemType = {
    id: number,
    description: string,
    image: string,
    category: string,
    price: number,
    title: string,
    amount: number
}

const getProducts = async (): Promise<CartItemType[]> => {
    return await (await fetch('https://fakestoreapi.com/products')).json();
}

const App = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[])
    const {data, isLoading, error} = useQuery<CartItemType[]>('products', getProducts);

    console.log(data);

    const getTotalItems = (items: CartItemType[]) => {
        return items.reduce((accumulator: number, item) => accumulator + item.amount, 0);
    }

    const handleAddToCart = (clickedItem: CartItemType) => {
        setCartItems(prevState => {
            // item in cart
            const itemIsInCart = prevState.find(item => item.id === clickedItem.id);
            if (itemIsInCart) {
                return prevState.map(item => item.id === clickedItem.id ? {...item, amount: item.amount + 1} : item);
            }

            //item not in cart
            return [...prevState, {...clickedItem, amount: 1}]
        })
    }
    const handleRemoveFromCart = (id: number) => {
        setCartItems(prevState =>
            prevState.reduce((accumulator, item) => {
                if (item.id === id) {
                    if (item.amount === 1) return accumulator
                    return [...accumulator, {...item, amount: item.amount - 1}]
                } else {
                    return [...accumulator, item]
                }
            }, [] as CartItemType[])
        );
    }

    if (isLoading) return <LinearProgress/>
    if (error) return <div>Something went wrong</div>
    return (
        <Wrapper>
            <Drawer anchor={'right'} open={cartIsOpen} onClose={() => setCartIsOpen(false)}>
                <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart}/>
            </Drawer>
            <StyledButton onClick={() => setCartIsOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color={'error'}>
                    <AddShoppingCart/>
                </Badge>
            </StyledButton>
            <Grid container spacing={3}>
                {data?.map(item => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <Item item={item} handleAddToCart={handleAddToCart}></Item>
                    </Grid>
                ))}
            </Grid>
        </Wrapper>
    );
}

export default App;
