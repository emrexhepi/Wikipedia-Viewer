import * as React from "react";

//import models
import ListItemModel from "../../models/ListItemModel";
import "./style";

interface ListItemProps {
    data : ListItemModel
}

export default class ListItem extends React.Component<ListItemProps, undefined>{
    constructor(props:ListItemProps){
        super(props);
    }

    render() {
        return (
            <a className="list-item" href={this.props.data.url} target="_blank">
                <li>
                    <div className="title">
                        <h2>{this.props.data.title}</h2>
                    </div>
                    <div className="description">
                        <p>{this.props.data.description}</p>
                    </div>
                </li>
            </a>
        );
    }
}