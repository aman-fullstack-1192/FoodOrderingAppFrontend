import React, { Component } from 'react';
import './Details.css';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({});
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';

class Details extends Component {
	constructor() {
        super();
        this.state = {
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
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Details);