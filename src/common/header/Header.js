import React, { Component } from 'react';
import './Header.css';
import { withStyles } from '@material-ui/core/styles';
import FastFoodIcon from '@material-ui/icons/Fastfood'
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

const loginModalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const styles = theme => ({
    searchUnderline: {
        '&:after': {
            borderBottomColor: 'white',
        },
    },
});

const TabContainer = function (props) {
    return (
        <Typography component='div' style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            loginContactNoRequired: 'display-none',
            loginContactNoRequiredMsg: 'required',
            loginContactNo: '',
            loginPasswordRequired: 'display-none',
            loginPasswordRequiredMsg: 'required',
            loginPassword: '',
            firstNameRequired: 'display-none',
            firstName: '',
            lastName: '',
            emailRequired: 'display-none',
            emailRequiredMsg: 'required',
            email: '',
            signupPasswordRequired: 'display-none',
            signupPasswordRequiredMsg: 'required',
            signupPassword: '',
            signupContactNoRequired: 'display-none',
            signupContactNoRequiredMsg: 'required',
            signupContactNo: '',
            signupSuccess: false,
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true,
            openLoginSuccessMsg: false,
            openSignupSuccessMsg: false,
            anchorEl: null,
        }
    }

    openLoginModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            loginContactNoRequired: 'display-none',
            loginContactNoRequiredMsg: 'required',
            loginContactNo: '',
            loginPasswordRequired: 'display-none',
            loginPasswordRequiredMsg: 'required',
            loginPassword: '',
            firstNameRequired: 'display-none',
            firstName: '',
            lastName: '',
            emailRequired: 'display-none',
            emailRequiredMsg: 'required',
            email: '',
            signupPasswordRequired: 'display-none',
            signupPasswordRequiredMsg: 'required',
            signupPassword: '',
            signupContactNoRequired: 'display-none',
            signupContactNoRequiredMsg: 'required',
            signupContactNo: '',
        });
    }

    closeLoginModalHandler = () => {
        this.setState({ modalIsOpen: false });
    }

    loginModalTabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    inputLoginContactNoChangeHandler = (event) => {
        this.setState({ loginContactNo: event.target.value });
    }

    inputLoginPasswordChangeHandler = (event) => {
        this.setState({ loginPassword: event.target.value });
    }

    loginClickHandler = () => {
        let contactReq = false;
        if (this.state.loginContactNo === '') {
            this.setState({
                loginContactNoRequired: 'display-block',
                loginContactNoRequiredMsg: 'required'
            });
            contactReq = true;
        } else {
            this.setState({ loginContactNoRequired: 'display-none' });
        }

        let passwordReq = false;
        if (this.state.loginPassword === '') {
            this.setState({
                loginPasswordRequired: 'display-block',
                loginPasswordRequiredMsg: 'required'
            });
            passwordReq = true;
        } else {
            this.setState({ loginPasswordRequired: 'display-none' });
        }

        // validate login contact no.
        let validateContact = new RegExp('[0-9]+');
        if (contactReq === false && (validateContact.test(this.state.loginContactNo) === false || this.state.loginContactNo.length !== 10)) {
            this.setState({
                loginContactNoRequired: 'display-block',
                loginContactNoRequiredMsg: 'Invalid Contact',
            });
            return;
        }

        if (contactReq || passwordReq) {
            return;
        }

        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        xhrLogin.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);

                if (responseText.code === 'ATH-001' || responseText.code === 'ATH-002') {
                    that.setState({
                        loginPasswordRequired: 'display-block',
                        loginPasswordRequiredMsg: responseText.message,
                    });
                    return;
                }

                sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));
                sessionStorage.setItem('user-uuid', responseText.id);
                sessionStorage.setItem('user-first-name', responseText.first_name);

                that.setState({
                    loggedIn: true,
                    openLoginSuccessMsg: true,
                });

                that.closeLoginModalHandler();
            }
        });
        xhrLogin.open('POST', 'http://localhost:8080/api/customer/login');
        xhrLogin.setRequestHeader('authorization', 'Basic ' + window.btoa(this.state.loginContactNo + ':' + this.state.loginPassword));
        xhrLogin.setRequestHeader('Content-Type', 'application/json');
        xhrLogin.send(dataLogin);
    }

    inputFirstNameChangeHandler = (event) => {
        this.setState({ firstName: event.target.value });
    }

    inputLastNameChangeHandler = (event) => {
        this.setState({ lastName: event.target.value });
    }

    inputEmailChangeHandler = (event) => {
        this.setState({ email: event.target.value });
    }

    inputSignupPasswordChangeHandler = (event) => {
        this.setState({ signupPassword: event.target.value });
    }

    inputSignupContactNoChangeHandler = (event) => {
        this.setState({ signupContactNo: event.target.value });
    }

    singupClickHandler = () => {
        let firstNameReq = false
        if (this.state.firstName === '') {
            this.setState({ firstNameRequired: 'display-block' });
            firstNameReq = true;
        } else {
            this.setState({ firstNameRequired: 'display-none' });
        }

        let emailReq = false;
        if (this.state.email === '') {
            this.setState({
                emailRequired: 'display-block',
                emailRequiredMsg: 'required'
            });
            emailReq = true;
        } else {
            this.setState({ emailRequired: 'display-none' });
        }

        let passwordReq = false;
        if (this.state.signupPassword === '') {
            this.setState({
                signupPasswordRequired: 'display-block',
                signupPasswordRequiredMsg: 'required'
            });
            passwordReq = true;
        } else {
            this.setState({ signupPasswordRequired: 'display-none' });
        }

        let contactNoReq = false;
        if (this.state.signupContactNo === '') {
            this.setState({
                signupContactNoRequired: 'display-block',
                signupContactNoRequiredMsg: 'required'
            })
            contactNoReq = true;
        } else {
            this.setState({ signupContactNoRequired: 'display-none' });
        }

        // validate signup email
        let validateEmail = new RegExp('^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}'); // eslint-disable-line no-useless-escape
        if (emailReq === false && validateEmail.test(this.state.email) === false) {
            this.setState({
                emailRequired: 'display-block',
                emailRequiredMsg: 'Invalid Email'
            });
            return;
        }

        // validate signup password
        let validatePassword = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#@$%&*!^-]).{8,}$');
        if (passwordReq === false && validatePassword.test(this.state.signupPassword) === false) {
            this.setState({
                signupPasswordRequired: 'display-block',
                signupPasswordRequiredMsg: 'Password must contain at least one capital letter, one small letter, one number, and one special character'
            });
            return;
        }

        // validate signup contact no.
        let validateContact = new RegExp('[0-9]+');
        if (contactNoReq === false && (validateContact.test(this.state.signupContactNo) === false || this.state.signupContactNo.length !== 10)) {
            this.setState({
                signupContactNoRequired: 'display-block',
                signupContactNoRequiredMsg: 'Contact No. must contain only numbers and must be 10 digits long'
            });
            return;
        }

        if (firstNameReq || emailReq || passwordReq || contactNoReq) {
            return;
        }

        let dataSignup = {
            'first_name': this.state.firstName,
            'last_name': this.state.lastName,
            'email_address': this.state.email,
            'password': this.state.signupPassword,
            'contact_number': this.state.signupContactNo,
        };
        let xhrSignup = new XMLHttpRequest();
        let that = this;
        xhrSignup.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);

                if (responseText.code === 'SGR-001') {
                    that.setState({
                        signupContactNoRequired: 'display-block',
                        signupContactNoRequiredMsg: responseText.message
                    });
                    return;
                }

                that.setState({
                    value: 0,
                    openSignupSuccessMsg: true,
                });
            }
        })
        xhrSignup.open('POST', 'http://localhost:8080/api/customer/signup');
        xhrSignup.setRequestHeader('Content-Type', 'application/json');
        xhrSignup.send(JSON.stringify(dataSignup));
    }

    loginSuccessMsgOnCloseHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openLoginSuccessMsg: false });
    }

    signupSuccessMsgOnCloseHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSignupSuccessMsg: false });
    }

    userMenuOnClickHandler = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    userMenuOnCloseHandler = () => {
        this.setState({ anchorEl: null });
    }

    myProfileOnClickHandler = () => {
        this.setState({ anchorEl: null });
    }

    logoutOnClickHandler = () => {
        sessionStorage.removeItem('access-token');
        sessionStorage.removeItem('user-uuid');
        sessionStorage.removeItem('user-first-name');
        sessionStorage.removeItem('customer-cart');
        this.setState({
            anchorEl: null,
            loggedIn: false
        });
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        return (
            <div>
                <header className='app-header'>

                    {/* header app logo */}
                    <div className='app-logo'>
                        <FastFoodIcon id='fast-food-icon' fontSize='large' />
                    </div>

                    {/* header search box */}
                    {this.props.showSearchBox ?
                        <div className='search-box'>
                            <Input
                                id='search-box-input'
                                classes={{
                                    underline: classes.searchUnderline,
                                }}
                                type='text'
                                placeholder='Search by Restaurant Name'
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <SearchIcon id='search-box-icon' />
                                    </InputAdornment>
                                }
                                onChange={this.props.searchHandler}
                            />
                        </div>
                        : ''
                    }

                    {/* header app login */}
                    {!this.state.loggedIn ?
                        <div className={this.props.showSearchBox ? 'app-login-1' : 'app-login-2'}>
                            <Button
                                size='medium'
                                variant='contained'
                                color='default'
                                onClick={this.openLoginModalHandler}
                            >
                                <AccountCircleIcon id='login-btn-icon' />
                                LOGIN
                                </Button>
                        </div>
                        :
                        <div className={this.props.showSearchBox ? 'app-login-1' : 'app-login-2'}>
                            <Button
                                id='user-btn'
                                size='medium'
                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup='true'
                                onClick={this.userMenuOnClickHandler}
                            >
                                <AccountCircleIcon id='user-btn-icon' />
                                {sessionStorage.getItem('user-first-name')}
                            </Button>
                            <Menu
                                id='user-menu'
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.userMenuOnCloseHandler}
                            >
                                <MenuItem onClick={this.myProfileOnClickHandler}>
                                    <Link to='/profile' style={{ textDecoration: 'none' }}>
                                        My Profile
                                        </Link>
                                </MenuItem>
                                <MenuItem onClick={this.logoutOnClickHandler}>Logout</MenuItem>
                            </Menu>
                        </div>
                    }

                </header>

                {/* login and signup modal */}
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel='Login'
                    onRequestClose={this.closeLoginModalHandler}
                    style={loginModalStyle}
                >

                    {/* tabs */}
                    <Tabs className='login-signup-tabs' value={this.state.value} onChange={this.loginModalTabChangeHandler}>
                        <Tab label='LOGIN' />
                        <Tab label='SIGNUP' />
                    </Tabs>

                    {/* login tab container */}
                    {this.state.value === 0 &&
                        <TabContainer>

                            {/* login contanct no */}
                            <FormControl required>
                                <InputLabel htmlFor='loginContactNo'>Contact No.</InputLabel>
                                <Input
                                    id='loginContactNo'
                                    type='text'
                                    logincontactno={this.state.loginContactNo}
                                    value={this.state.loginContactNo}
                                    onChange={this.inputLoginContactNoChangeHandler}
                                />
                                <FormHelperText className={this.state.loginContactNoRequired} error={true}>
                                    <span>{this.state.loginContactNoRequiredMsg}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />

                            {/* login password */}
                            {/* form is used to overcome - [DOM] Password field is not contained in a form: (More info: https://goo.gl/9p2vKq) */}
                            <form>
                                <FormControl required>
                                    <InputLabel htmlFor='loginPassword'>Password</InputLabel>
                                    <Input
                                        id='loginPassword'
                                        type='password'
                                        loginpassword={this.state.loginPassword}
                                        value={this.state.loginPassword}
                                        onChange={this.inputLoginPasswordChangeHandler}
                                        autoComplete='off'
                                    />
                                    <FormHelperText className={this.state.loginPasswordRequired} error={true}>
                                        <span>{this.state.loginPasswordRequiredMsg}</span>
                                    </FormHelperText>
                                </FormControl>
                            </form>
                            <br /><br />

                            <Button id='modal-login-btn' variant='contained' color='primary' onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>
                    }

                    {/* signup tab container */}
                    {this.state.value === 1 &&
                        <TabContainer>

                            {/* signup first name */}
                            <FormControl required>
                                <InputLabel htmlFor='firstName'>First Name</InputLabel>
                                <Input
                                    id='firstName'
                                    type='text'
                                    firstname={this.state.firstName}
                                    value={this.state.firstName}
                                    onChange={this.inputFirstNameChangeHandler}
                                />
                                <FormHelperText className={this.state.firstNameRequired} error={true}>
                                    <span>required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />

                            {/* signup last name */}
                            <FormControl>
                                <InputLabel htmlFor='lastName'>Last Name</InputLabel>
                                <Input
                                    id='lastName'
                                    type='text'
                                    lastname={this.state.lastName}
                                    value={this.state.lastName}
                                    onChange={this.inputLastNameChangeHandler}
                                />
                            </FormControl>
                            <br /><br />

                            {/* signup email */}
                            <FormControl required>
                                <InputLabel htmlFor='email'>Email</InputLabel>
                                <Input
                                    id='email'
                                    type='text'
                                    email={this.state.email}
                                    value={this.state.email}
                                    onChange={this.inputEmailChangeHandler}
                                />
                                <FormHelperText className={this.state.emailRequired} error={true}>
                                    <span>{this.state.emailRequiredMsg}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />

                            {/* signup password */}
                            {/* form is used to overcome - [DOM] Password field is not contained in a form: (More info: https://goo.gl/9p2vKq) */}
                            <form>
                                <FormControl required>
                                    <InputLabel htmlFor='signupPassword'>Password</InputLabel>
                                    <Input
                                        id='signupPassword'
                                        type='password'
                                        signuppassword={this.state.signupPassword}
                                        value={this.state.signupPassword}
                                        onChange={this.inputSignupPasswordChangeHandler}
                                        autoComplete='off'
                                    />
                                    <FormHelperText className={this.state.signupPasswordRequired} error={true}>
                                        <span>{this.state.signupPasswordRequiredMsg}</span>
                                    </FormHelperText>
                                </FormControl>
                            </form>
                            <br />

                            {/* signup contact no */}
                            <FormControl required>
                                <InputLabel htmlFor='signupContactNo'>Contact No</InputLabel>
                                <Input
                                    id='signupContactNo'
                                    type='text'
                                    signupcontactno={this.state.signupContactNo}
                                    value={this.state.signupContactNo}
                                    onChange={this.inputSignupContactNoChangeHandler}
                                />
                                <FormHelperText className={this.state.signupContactNoRequired} error={true}>
                                    <span>{this.state.signupContactNoRequiredMsg}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />

                            <Button id='modal-signup-btn' variant='contained' color='primary' onClick={this.singupClickHandler}>SIGNUP</Button>
                        </TabContainer>
                    }
                </Modal>

                {/* login snackbar */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openLoginSuccessMsg}
                    autoHideDuration={4000}
                    onClose={this.loginSuccessMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>Logged in successfully!</span>}
                />

                {/* signup snackbar */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSignupSuccessMsg}
                    autoHideDuration={4000}
                    onClose={this.signupSuccessMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>Registered successfully! Please login now!</span>}
                />

            </div>
        )
    }
}

export default withStyles(styles)(Header);
