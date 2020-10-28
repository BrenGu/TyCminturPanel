import React, { Component } from "react";

/*
    <Msg visible={true/false} okClose={funcion} okAceptar={funcion} tipo="0">
        Asdad
    </Msg>
*/
class Msg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            tipo: 0
        };
    }

    componentDidMount() {
        this.setState({
            visible: this.props.visible,
            tipo: parseInt(this.props.tipo, 10)
        });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if(this.props.visible !== prevProps.visible || this.props.tipo !== prevProps.tipo) {
            this.setState({
                visible: this.props.visible,
                tipo: parseInt(this.props.tipo, 10)
            });
        }
    }

    render() {
        return (
            <div className="modal fade show" style={{display: this.state.visible ? "block" : "none"}} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">SisTur</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.okClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{this.props.children}</p>
                        </div>
                        <div className="modal-footer">
                            {
                                this.state.tipo === 0
                                ?
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.okClose}>Aceptar</button>
                                :
                                <React.Fragment>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.okAceptar}>Aceptar</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.okClose}>Cancelar</button>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

export default Msg;