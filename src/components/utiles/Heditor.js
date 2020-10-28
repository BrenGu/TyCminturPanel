import React, { Component } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

class Heditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this._onBoldClick = this._onBoldClick.bind(this);
    }

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    _onBoldClick = () => {
        RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
    }

    render() {
        return (
            <div style={{border: "1px solid #444"}}>
                <button onClick={this._onBoldClick}>Bold</button>
                <Editor
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default Heditor;