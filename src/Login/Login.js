import React from 'react';
import axios from 'axios';
import UserCart from '../UserCart/UserCart.js';
import Store from '../Store/Store.js';
import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login:'',
            password:'',
            jwt:'',
            user:'',
            cartItems:[]
        }
        this.loginEventHandler = this.loginEventHandler.bind(this);
        this.loginInputHandler = this.loginInputHandler.bind(this);
        this.passwordInputHandler = this.passwordInputHandler.bind(this);
    }

    loginInputHandler(event) {
        this.setState({login:event.target.value});
    }

    passwordInputHandler(event){
        this.setState({password:event.target.value})
    }

    async loginEventHandler(event){
        try {
            const loginBody = {
                login: this.state.login,
                password: this.state.password
            }
            const response = (await axios.post('http://localhost:8080/user/login', loginBody)).data;
            this.setState({jwt: response.jwt, user: response.user});
        } catch (err) {
            console.log(err);
        }
        event.preventDefault();
    }

    welcomeUser(){
        if (this.state.user){
            return (
                <div>
                    <UserCart user={this.state.user} accessToken={this.state.jwt}/>
                    <Store accessToken={this.state.jwt}/>
                </div>
            )
        }
    }

    getLoginForm(){
        if (!this.state.user){
            return (
                <div>
                    <input className="loginName" onBlur={this.loginInputHandler}></input>
                    <input type="password" className="loginPass" onBlur={this.passwordInputHandler}></input>
                    <button className="loginButton" onClick={this.loginEventHandler}>Log in!</button>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="Login">
                {this.getLoginForm()}
                {this.welcomeUser()}
            </div>
        );
    };
}

export default Login