import { findResultFor } from 'awesome-typescript-loader/dist/helpers';
import * as React from "react";

import ListItem from "../list-item";
import "./style.scss";

//import models
import ListModel from "../../models/ListModel";
import ListItemModel from "../../models/ListItemModel";

interface ListState {
    wikiItem : ListItemModel
}

interface ListProps {
    data : ListModel
}

export default class List extends React.Component<ListProps,ListState>{
    constructor(props:ListProps){
        super(props);
    }

    getItems() {
        return this.props.data.items.map((item)=>{
            return <ListItem data={item} />
        })
    }

    getClasses():string{

        return this.props.data.show === true ? "list-view active" : "list-view";
    }

    render() {
        return (
            <div className={this.getClasses()}>
                <ul>
                    {this.getItems()}
                </ul>
            </div>
        );
    }
}