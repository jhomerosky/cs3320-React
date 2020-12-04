import React from 'react';
import axios from 'axios';
import './Store.css';
import ScrollArea from 'react-scrollbar';
//var ScrollArea = require('react-scrollbar');

class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeItems: ''
        }
        this.populateStore = this.populateStore.bind(this);
        this.viewStoreItem = this.viewStoreItem.bind(this);
        this.addStoreItem = this.addStoreItem.bind(this);
    }

    async viewStoreItem(event){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = (await axios.get(`http://localhost:8080/StoreItems`, {headers})).data;

        } catch (err) {
            console.log(err);
        }
        event.preventDefault();
    }

    async addStoreItem(event){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = 1;

        } catch (err) {
            console.log(err);
        }
        event.preventDefault();
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
                    <button onClick={this.viewStoreItem}>View</button>
                    {storeItem.itemName}
                    <button onClick={this.addStoreItem}>Add</button>
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


    render() {
        return (
            <div className="storeArea">
                {this.displayStoreRefreshButton()}
                {this.displayStore()}
            </div>
        )
    }
}

export default Store