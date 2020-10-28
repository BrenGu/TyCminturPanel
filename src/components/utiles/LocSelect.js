import React, { Component } from "react";

class LocSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errMsg: "",
            localidades: {
                data: [{
                    id: 0,
                    nombre: "Cargando...",
                    visible: true
                }],
                selected: {
                    id: 0,
                    nombre: "Cargando...",
                    visible: true
                }
            },
            filtro: "",
        };
        this.handleBusquedaChange = this.handleBusquedaChange.bind(this);
    }

    handleBusquedaChange(event) {
        let valor = event.target.value;
        this.setState({filtro: valor}, () => {
            var copy = Object.assign([], this.state.localidades.data);
            var firstVisible = 0;
            copy = copy.map((d) => {
                if(d.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1) {
                    d.visible = true;
                    if(firstVisible === 0) {
                        firstVisible = d;
                    }
                } else {
                    d.visible = false;
                }
                return d;
            });
            this.setState({
                localidades: {
                    //...this.state.localidades,
                    data: copy,
                    selected: firstVisible
                }
            }, () => {
                this.handleFiltroClick(firstVisible)
            });
        });
    }

    handleFiltroClick(selected) {
       this.setState({
            localidades: {
                ...this.state.localidades,
                selected: selected
            }
        }, () => {
            this.props.handleFiltroClick(selected);
            /*
            if(window.scrollY > 350) {
                window.scrollTo(0, 140);
            }
            */
        });
    }

    componentDidMount() {
        //Lista de Localidades
        fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
            method: 'GET',
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                var setX = result.data.registros.map((v) => {
                    return {
                        ...v,
                        visible: true
                    }
                });
                this.setState({
                    localidades: {
                        data: setX,
                        selected: setX[0]
                    }
                }, () => {
                    this.handleFiltroClick(this.state.localidades.selected);
                    this.setState({
                        loading: false
                    });
                });
            } else {
                this.setState({
                    loading: false,
                    error: true,
                    errMsg: result.errMsg
                });
            }
        }, (error) => { //???
            this.setState({
                loading: false,
                error: true,
                errMsg: error
            });
        });
    }

    render() {
        const filtro = this.state.localidades.data.map((lf) => {
            return (
                // active
                <span className={`spanloc ${(lf === this.state.localidades.selected) ? "active" : ""}${lf.visible ? " d-block" : " d-none"}`} key={`lloc-${lf.id}`} onClick={(e) => this.handleFiltroClick(lf)}>{lf.nombre}</span>
            );
        });
        //const localidad_selected = this.state.localidades.selected;
        return (
            <React.Fragment>
                {
                    this.state.error
                    ?
                    <div>Error! {this.state.errMsg}</div>
                    :
                    this.state.loading
                    ?
                    <div>Cargando...</div>
                    :
                    <div className="LocSelect">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="buscar">Buscar Localidad</label>
                                    <input type="text" name="buscar" id="buscar" className="form-control" value={this.state.filtro} onChange={this.handleBusquedaChange} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <div className="d-flex justify-content-center flex-wrap">
                                        {filtro}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <style jsx="true">{`
                    .spanloc {
                        padding: 4px 8px;
                        margin: 8px 8px;
                        background-color: #ccc;
                        -webkit-border-radius: 4px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .spanloc.active {
                        background-color: #007bff;
                        color: #fff;
                    }
                `}</style>
            </React.Fragment>
        );
    }
    
}

export default LocSelect;