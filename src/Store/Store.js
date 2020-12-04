import React from 'react';
import axios from 'axios';
import './Store.css';
import ScrollArea from 'react-scrollbar';

class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeItems: '',
            recent:[],
            search:''
        }

        this.populateStore = this.populateStore.bind(this);
        this.viewStoreItem = this.viewStoreItem.bind(this);
        this.addStoreItem = this.addStoreItem.bind(this);
        this.displayRecent = this.displayRecent.bind(this);
        this.searchInputHandler = this.searchInputHandler.bind(this);
        this.searchEventHandler = this.searchEventHandler.bind(this);
    }

    displayRecent(){
        if (this.state.recent){
            return (
                <ScrollArea speed={0.8} className="recentScrollArea" contentClassName="recentListArea" horizontal={false}>
                    <div>
                        <h1>Recently Viewed</h1>
                        {this.state.recent}
                    </div>
                </ScrollArea>
            );
        }
    }

    async viewStoreItem(storeItemId){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = (await axios.get(`http://localhost:8080/StoreItem/${storeItemId}`, {headers})).data;

            console.log("response:");
            console.log(response);

            const recent = (await axios.get(`http://localhost:8080/StoreItems/Recent?num=10`, {headers})).data;
            console.log("recent:");
            console.log(recent);

            const recentItemList = [];
            recent.forEach( (storeItem) => {
                recentItemList.push(
                    <li key={storeItem._id}>{storeItem.itemName}</li>);
            });
            this.setState({recent:recentItemList})

        } catch (err) {
            console.log(err);
        }
    }

    async addStoreItem(storeItemId){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const body = {
                'id': storeItemId,
                'quantity':1
            }
            const cartId = (await axios.get(`http://localhost:8080/user/${this.props.user._id}`, {headers})).data.cart._id;
            const response = (await axios.post(`http://localhost:8080/cart/${cartId}/cartItem`, body)).data;

        } catch (err) {
            console.log(err);
        }
    }

    async populateStore(event){
        try{
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = (await axios.get(`http://localhost:8080/StoreItems`, {headers})).data;
            const storeItemList = [];
            response.forEach(storeItem => {
                storeItemList.push(<li key={storeItem._id}>
                    <button onClick={() => {this.viewStoreItem(storeItem._id)}}>View</button>
                    {storeItem.itemName}
                    <button onClick={() => {this.addStoreItem(storeItem._id)}}>Add</button>
                </li>);
            });
            this.setState({storeItems:storeItemList})
        }
        catch (e){
            console.log(e);
        }
        event.preventDefault();
    }

    displayStore() {
        return (
            <div>
                <ScrollArea speed={0.8} className="storeScrollArea" contentClassName="storeListArea:" horizontal={true}>
                    <div>
                        <h1>Store</h1>
                        {this.state.storeItems}
                    </div>
                </ScrollArea>
            </div>
        );
    }

    displayStoreRefreshButton(){
        if (this.state.storeItems){
            return (
                <button className="storeRefresh" onClick={this.populateStore}>Refresh store!</button>
            )
        } else {
            return (
                <button className="storeRefresh" onClick={this.populateStore}>View store!</button>
            )
        }
    }

    searchInputHandler(event){
        this.setState({search:event.target.value});
    }

    async searchEventHandler(event){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }

            const response = (await axios.get(`http://localhost:8080/StoreItems?name=${this.state.search}`, {headers})).data;
            const storeItemList = [];
            response.forEach(storeItem => {
                storeItemList.push(<li key={storeItem._id}>
                    <button onClick={() => {this.viewStoreItem(storeItem._id)}}>View</button>
                    {storeItem.itemName}
                    <button onClick={() => {this.addStoreItem(storeItem._id)}}>Add</button>
                </li>);
            });
            this.setState({storeItems:storeItemList})
        } catch (err) {
            console.log(err);
        }
        event.preventDefault();
    }

    getSearchForm(){
        if (this.state.storeItems){
            return (
                <div>
                    <input type="search" className="searchFilter" onBlur={this.searchInputHandler}></input>
                    <button className="searchButton" onClick={this.searchEventHandler}>Search</button>
                </div>
            )
        }
    }


    render() {
        return (
            <div>
                <div className="recentArea">
                    {this.displayRecent()}
                </div>
                <div className="storeArea">
                    {this.displayStoreRefreshButton()}
                    {this.getSearchForm()}
                    {this.displayStore()}
                </div>
            </div>
        )
    }
}

export default Store