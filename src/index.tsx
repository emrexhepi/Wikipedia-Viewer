import * as React from "react";
import * as ReactDOM from "react-dom";

import "./style/style.scss";

import SearchBox from "./components/searchbox";
import WikiList from "./components/list";

//import models
import ListModel from "./models/ListModel";
import ListItemModel from "./models/ListItemModel";


interface AppState {
    wikiList :ListModel,
    message : string
}

class App extends React.Component<undefined, AppState> {
    constructor(){
        super();

        this.state = {
            wikiList : {
                show : false,
                items : [],
            },
            message : ""
        }
    }

    handleSearch(query:string) {
        let list = this.state.wikiList;
        list.items = [];
        list.show = false;
        this.setState({
            wikiList: list,
            message : "Searching..."
        });

        let api = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=15&namespace=0&format=json&search=';
        //let api = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
        api += query;
        //api += "&callback=JSON_CALLBACK";

        $.ajax({
            type: "GET",
            url: api,
            contentType: "application/jsonp; charset=utf-8",
            async: false,
            dataType: "jsonp",
            success: (data, textStatus, jqXHR) => {
                let list = this.state.wikiList;
                list.items = [];
                list.show = true;

                console.log(data);

                for(var i = 0; i < data[1].length; i++) {
                    console.log(data[1][i]);
                    let title = data[1][i].length > 25 ? data[1][i].substring(0, 24)+"..." : data[1][i];
                    //let desctiption = data[2][i].length > 40 ? data[2][i].substring(0, 39)+"..." : data[2][i];
                    list.items[i] = {
                        title : title,
                        description: data[2][i],
                        url: data[3][i]
                    };
                }

                if(list.items.length>0){
                    this.setState({
                        wikiList: list,
                        message: ""
                    })
                } else {
                    list.show = false;
                    this.setState({
                        wikiList: list,
                        message: "No results found!!!"
                    })
                }

            },
            error: function (errorMessage) {
                console.log(errorMessage);
            }
        });
    }

    exitSearch() {
        var list = this.state.wikiList;
        list.show = false;

        this.setState({
            wikiList: list
        })
    }

    render(){
        return (
            <div className="app-container">
                <SearchBox message={this.state.message} handleSearch={(str:string)=>(this.handleSearch(str))} exitSearch={()=>(this.exitSearch())}/>
                <WikiList data={this.state.wikiList} />
            </div>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById("app"));
