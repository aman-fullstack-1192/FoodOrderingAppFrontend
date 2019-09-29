import React, { Component } from 'react';
import './Details.css';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({});
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import Divider from '@material-ui/core/Divider';


class Details extends Component {
	constructor() {
        super();
        this.state = {
			open: false,
            btnClicked: '',
            checkoutArr: [],
            itemAdded: 0,
            totalPrice: 0,
            restaurantDetails: {
                'address': '',
                'average_price': '',
                'categories': '',
                'customer_rating': '',
                'id': '',
                'number_customers_rated': '',
                'photo_URL': '',
                'restaurant_name': '',
            },
        }
    }

    componentWillMount() {
        // clear existing cart item
        sessionStorage.removeItem('customer-cart');

        let that = this;
        let dataRestaurant = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurantDetails: JSON.parse(this.responseText),
                });
            }
        });
        xhrRestaurant.open('GET', `${this.props.baseUrl}restaurant/${this.props.match.params.id}`);
        xhrRestaurant.setRequestHeader('Cache-Control', 'no-cache');
        xhrRestaurant.send(dataRestaurant);
    }
	
	//get category
    getCategory = () => {
        let data = this.state.restaurantDetails;
        let dataLength = data.categories && data.categories.length;
        return dataLength > 0 ?
            data.categories.map((item, index) => {
                return <span key={index}>{item.category_name}{dataLength === index + 1 ? '' : ', '} </span>
            }) : null
    }
	
	//remove menu click handler
    removeMenuClick = item => event => {
        const itemLength = this.state.itemAdded - 1;
        if (item.count === 1) {
            let newArr = [...this.state.checkoutArr];
            newArr.forEach((data, index) => {
                if (item.id === data.id && item.category_name === data.category_name) {
                    newArr.splice(index, 1);
                }
            });
            const totalPrice = this.state.totalPrice - item.price;
            this.setState({ checkoutArr: newArr, totalPrice: totalPrice, open: true, btnClicked: 'REMOVE', itemAdded: itemLength });
        } else {
            let newArr = [...this.state.checkoutArr];
            newArr.forEach((data, index) => {
                if (item.id === data.id && item.category_name === data.category_name) {
                    newArr[index].count = data.count - 1;
                    newArr[index].totalItemPrice = data.totalItemPrice - data.price;
                }
            })
            const totalPrice = this.state.totalPrice - item.price;
            this.setState({ checkoutArr: newArr, totalPrice: totalPrice, open: true, btnClicked: 'DECREMENT', itemAdded: itemLength });
        }
    }

	//add menu click handler
    addMenuClick = (item, method) => event => {
        let selectedItem, newAdded;
        let duplicates = this.state.checkoutArr.filter(data => item.id === data.id && item.category_name === data.category_name);
        if (duplicates.length > 0) {
            selectedItem = this.state.checkoutArr.map(eachItem => {
                if (eachItem.id === duplicates[0].id && eachItem.category_name === duplicates[0].category_name) {
                    let count = eachItem.count + 1;
                    eachItem.count = count;
                    eachItem.totalItemPrice = eachItem.price * count;
                }
                return eachItem;
            })
            newAdded = [...selectedItem];
        } else {
            let count = duplicates.length + 1;
            selectedItem = { ...item, count: count, totalItemPrice: item.price * count };
            newAdded = [...this.state.checkoutArr, selectedItem];
        }

        const itemLength = this.state.itemAdded + 1;
        const totalPrice = this.state.totalPrice + item.price;
        this.setState({ checkoutArr: newAdded, open: true, btnClicked: method, itemAdded: itemLength, totalPrice: totalPrice });
    };
	
	//get each dish
    getEachDish = (item_list, category_name) => {
        return item_list.map((item, index) => {
            item = { ...item, 'category_name': category_name }
            return <div className="flex pd-1-per" key={index}>
                <div className="flex-5"><i className={item.item_type === 'NON_VEG' ? 'fa fa-circle non-veg' : 'fa fa-circle veg'}></i></div>
                <div className="flex-75">{item.item_name}</div>
                <div className="flex-10"><i className='fa fa-inr'></i> {item.price}.00</div>
                <div className="flex-10 plus-btn">
                    <IconButton aria-label="Add" style={{ padding: '1px' }} onClick={this.addMenuClick(item, 'ADD')}>
                        <AddIcon />
                    </IconButton>
                </div>
            </div>
        })
    }
	
	//get category list
    getCategoryList = () => {
        let data = this.state.restaurantDetails;
        let dataLength = data.categories && data.categories.length;
        return dataLength > 0 ?
            data.categories.map((item, index) => {
                return <div className="mt-15" key={'item' + item.id}>
                    <div>{item.category_name}</div>
                    <Divider className="divider-margin-10" />
                    {this.getEachDish(item.item_list, item.category_name)}
                </div>
            }) : null
    }
	
	//get checkout dish list
    getCheckoutDishList = (checkoutArr) => {
        return checkoutArr.map((item, index) => {
            return <div className="flex width-100 pd-1-per" key={index}>
                <div className="width-5"><i className={item.item_type === 'NON_VEG' ? 'fa fa-stop-circle-o non-veg' : 'fa fa-stop-circle-o veg'}></i></div>
                <div className="width-40 capital checkout-grey-color">{item.item_name}</div>
                <div className="width-40">
                    <IconButton aria-label="AddIcon" className="btn-hover" style={{ padding: '1px' }} onClick={this.removeMenuClick(item)}>
                        <div className="minus-icon"> - </div>
                    </IconButton>
                    {item.count}
                    <IconButton aria-label="Add" className="btn-hover" style={{ padding: '1px' }} onClick={this.addMenuClick(item, 'INCREMENT')}>
                        <AddIcon className="black-color" />
                    </IconButton>
                </div>
                <div className="width-2-5 checkout-grey-color"><i className='fa fa-inr'></i></div>
                <div className='checkout-grey-color'> {item.totalItemPrice}.00</div>
            </div>
        })
    }
	
	//checkout event handler
    checkoutHandler = () => {
        if (this.state.checkoutArr && this.state.checkoutArr.length === 0) {
            this.setState({ open: true, btnClicked: 'CHECKOUT' });
            return;
        }

        if (sessionStorage.getItem('access-token') === null) {
            this.setState({ open: true, btnClicked: 'LOGIN' });
            return;
        }

        let customerCart = {
            restaurantDetails: this.state.restaurantDetails,
            cartItems: this.state.checkoutArr,
            totalPrice: this.state.totalPrice
        };
        sessionStorage.setItem('customer-cart', JSON.stringify(customerCart));
        this.props.history.push('/checkout');
    }
	
	render() {
		const { photo_URL, restaurant_name, address, customer_rating, average_price, number_customers_rated } = this.state.restaurantDetails;
		return (
			<div>
				<Header />
				<div>
					<Grid container spacing={24} className="bggrey mobile-text-center" >
                        <Grid item xs={12} sm={3} className="text-center">
                            <img src={photo_URL} width="300" alt={photo_URL} height="250" className="margin-top-20" />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={12} className="font-family-serif">
                                    <h1>{restaurant_name}</h1>
                                    <h3>{address.locality}</h3>
                                    <h3>{this.getCategory()}</h3>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6} sm={6}>
                                            <div className="container_item3">
                                                <i className='fa fa-star'></i> {customer_rating}
                                                <p className="text_format">AVERAGE RATING BY<br /><span className="bold">{number_customers_rated}</span> CUSTOMERS</p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} sm={6}>
                                            <div className="container_item3">
                                                <i className='fa fa-inr'></i> {average_price}
                                                <p className="text_format">AVERAGE COST FOR<br />TWO PEOPLE</p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
					<Grid container spacing={24} className="item-list-container">
                        <Grid item xs={12} sm={7}>
                            {this.getCategoryList()}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" color="default" gutterBottom>
                                        <Badge badgeContent={this.state.itemAdded} color="primary">
                                            <ShoppingCart />
                                        </Badge>
                                        <span className="mycart">My Cart</span>
                                    </Typography>

                                    {this.getCheckoutDishList(this.state.checkoutArr)}
                                    <div className="bold pd-1-per">TOTAL AMOUNT <span className="right mr-8"><i className='fa fa-inr'></i> {this.state.totalPrice}.00</span></div>
                                    <Button className="mt-24-px" variant="contained" fullWidth size="medium" color="primary" onClick={this.checkoutHandler}>
                                        CHECKOUT
									</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Details);