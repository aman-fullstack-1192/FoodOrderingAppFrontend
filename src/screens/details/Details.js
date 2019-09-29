import React, { Component } from 'react';
import './Details.css';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({});

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
	
	render() {
		return (
			<div> Hi </div>
		)
	}
}

export default withStyles(styles)(Details);