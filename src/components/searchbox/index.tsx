import * as React from "react";
import "./style.scss";

interface SearchBoxState {
    activeClass: string,
}

interface SearchBoxProps {
    handleSearch: (str:string)=>void,
    exitSearch : Function,
    message : string
}


export default class SearchBox extends React.Component<SearchBoxProps,SearchBoxState> {
    constructor(props:SearchBoxProps){
        super(props);
        
        this.state= {
            activeClass: "search-wrapper",
        };

    }

    handleSearchToggle(){
        let searchInput = document.getElementById("search-input") as HTMLInputElement;
        searchInput.focus();
        searchInput.select();

        if(this.state.activeClass !="search-wrapper active") {
            this.setState({
                activeClass: "search-wrapper active"
            });
            return;
        }
        //search
        if(searchInput.value !=""){
            this.props.handleSearch(searchInput.value);
        }
    }

    handleCloseClick(){
        
        let searchInput = document.getElementById("search-input") as HTMLInputElement;

        if(searchInput.value == "") {
            this.props.exitSearch();
            this.setState({
                activeClass: "search-wrapper"
            });
        }

        searchInput.value = "";
    }

    handleKeyPress (event: React.KeyboardEvent<any>):any {
        if(event.key === "Enter") {
            event.preventDefault();
            this.handleSearchToggle();
        }
        if(event.keyCode == 27) {
            event.preventDefault();
            this.handleCloseClick();
            
        }
    }

    render() {
        return (
            <div className={this.state.activeClass}>
                <div className="click-random">
                    <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" className="random-article">Click Here for Random!</a>
                </div>
                <div className="input-holder" >
                    <input type="text" id="search-input" onKeyDown={(event: React.KeyboardEvent<any>)=>{this.handleKeyPress(event)}} className="search-input" placeholder="Type to search"/>
                    <div className="close-icon" onClick={this.handleCloseClick.bind(this)}><span></span></div>
                    <div className="search-icon" onClick={this.handleSearchToggle.bind(this)}><span></span></div>
                </div>
                <div className="message">
                    {this.props.message !== "" ?<p>{this.props.message}</p> : "" }
                </div>
            </div>
        );
    }
}