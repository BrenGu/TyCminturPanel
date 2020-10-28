import React, { Component } from "react";
import ddToDms from "../../../gm";

/*
    Parámetros:
    id: Id de la Ciudad (Localidad)
    error: Función para el manejo de errores (tiene que poder manejar un string o un array)
    ok: Función para el manejo de ok (tiene que manejar registro)
    cancel: Función para el manejo de cancel
*/

class FormLoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            combo_departamentos: [{
                id: 0,
                nombre: "Cargando..."
            }],
            registro: {
                id: 0,
                idprovincia: 1,
                iddepartamento: 0,
                nombre: "",
                caracteristica: "",
                cp: "",
                latitud: 0,
                longitud: 0,
                latitudg: 0,
                longitudg: 0,
                descripcion: "",
                video: "",
                mdireccion: "",
                mtelefono: "",
                minterno: "",
                mweb: "",
                mmail: "",
                mresponsable: "",
                fiestas: "",
                departamento: "",
                color: ""
            }
        };
        this.setData = this.setData.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        //this.handleFormError = this.handleFormError.bind(this);
        this.setLatLng = this.setLatLng.bind(this);
    }

    setLatLng() {
        let LatLng = ddToDms(this.state.registro.latitud, this.state.registro.longitud);
        this.setState({
            registro: {
                ...this.state.registro,
                latitudg: LatLng.lat,
                longitudg: LatLng.lng
            }
        });
    }

    handleSave() {
        this.props.ok(JSON.stringify(this.state.registro));
    }

    handleCancel() {
        this.props.cancel();
    }

    setData() {
        fetch(`${process.env.REACT_APP_API_HOST}/departamentos`, {
            method: 'GET',
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    combo_departamentos: result.data.registros
                }, () => {
                    if(this.props.id === 0) {
                        this.setState({
                            registro: {
                                id: 0,
                                idprovincia: 1,
                                iddepartamento: this.state.combo_departamentos[0].id,
                                nombre: "",
                                caracteristica: "",
                                cp: "",
                                latitud: 0,
                                longitud: 0,
                                latitudg: 0,
                                longitudg: 0,
                                descripcion: "",
                                video: "",
                                mdireccion: "",
                                mtelefono: "",
                                minterno: "",
                                mweb: "",
                                mmail: "",
                                mresponsable: "",
                                odireccion: "",
                                otelefono: "",
                                ointerno: "",
                                oweb: "",
                                omail: "",
                                oresponsable: "",
                                fiestas: "",
                                departamento: "",
                                color: ""
                            }
                        });
                    } else {
                        fetch(`${process.env.REACT_APP_API_HOST}/ciudad/${this.props.id}`, {
                            method: 'GET',
                            headers: {
                                "Authorization": "asdssffsdff",
                                //"Content-Type": "application/json"
                            }
                        })
                        .then(res => res.json())
                        .then((result) => {
                            if(!result.err) {
                                this.setState({registro: result.data.registros[0]});
                            } else {
                                this.props.error(result.errMsg);
                            }
                        }, (error) => { //???
                            this.props.error(error);
                        });
                    }

                });
            } else {
                this.props.error(result.errMsg);
            }
        }, (error) => { //???
            this.props.error(error);
        });
        
    }

    componentDidMount() {
        this.setData();
    }

    componentDidUpdate(prevProps) {
        if(this.props.id !== prevProps.id) {
            this.setData();
        }
    }

    render() {
        const departamentos = this.state.combo_departamentos.map((d) => {
            return (<option key={`departamento-opt-${d.id}`} value={d.id}>{d.nombre}</option>);
        });
        const FormOptions = (props) => {
            if(props.id === 0) {
                return(
                    <div className="col">
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-dark" onClick={this.handleCancel}>Cancelar</button>
                            <button className="btn btn-primary" onClick={this.handleSave}>Guardar</button>
                        </div>
                    </div>
                )
            } else {
                return(
                    <div className="col">
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={this.handleSave}>Guardar</button>
                        </div>
                    </div>
                )
            }
        };
        return(
            <React.Fragment>
            {
                this.state.isLoaded
                ?
                <React.Fragment>
                    <div className="col-sm-12 col-md-12 bg-primary text-white p-2 mb-3">
                        <div style={{fontSize: "1.4rem"}}>{this.state.registro.nombre}</div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="iddepartamento">Departamento</label>
                                    <select name="iddepartamento" id="iddepartamento" className="form-control" value={this.state.registro.iddepartamento} onChange={(e) => this.setState({registro: {...this.state.registro, iddepartamento: e.target.value}})}>
                                        {departamentos}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="nombre">Localidad</label>
                                    <input type="text" name="nombre" id="nombre" className="form-control" value={this.state.registro.nombre} onChange={(e) => this.setState({registro: {...this.state.registro, nombre: e.target.value}})} maxLength="50" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="caracteristica">Característica</label>
                                    <input type="text" name="caracteristica" id="caracteristica" className="form-control" value={this.state.registro.caracteristica} onChange={(e) => this.setState({registro: {...this.state.registro, caracteristica: e.target.value}})} maxLength="15" autoComplete="off" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="cp">Código Postal</label>
                                    <input type="text" name="cp" id="cp" className="form-control" value={this.state.registro.cp} onChange={(e) => this.setState({registro: {...this.state.registro, cp: e.target.value}})} maxLength="10" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="latitud" style={{cursor: "pointer"}} onClick={this.setLatLng}>Latitud</label>
                                    <input type="text" name="latitud" id="latitud" className="form-control" value={this.state.registro.latitud} onChange={(e) => this.setState({registro: {...this.state.registro, latitud: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="longitud" style={{cursor: "pointer"}} onClick={this.setLatLng}>Longitud</label>
                                    <input type="text" name="longitud" id="longitud" className="form-control" value={this.state.registro.longitud} onChange={(e) => this.setState({registro: {...this.state.registro, longitud: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="latitudg">Latitud º</label>
                                    <input type="text" name="latitudg" id="latitudg" className="form-control" value={this.state.registro.latitudg} onChange={(e) => this.setState({registro: {...this.state.registro, latitudg: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="longitudg">Longitud º</label>
                                    <input type="text" name="longitudg" id="longitudg" className="form-control" value={this.state.registro.longitudg} onChange={(e) => this.setState({registro: {...this.state.registro, longitudg: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea rows="8" name="descripcion" id="descripcion" className="form-control" value={this.state.registro.descripcion} onChange={(e) => this.setState({registro: {...this.state.registro, descripcion: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="video">URL Video (embed ?autoplay=1)</label>
                                    <input type="text" name="video" id="video" className="form-control" value={this.state.registro.video} onChange={(e) => this.setState({registro: {...this.state.registro, video: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        {
                            this.state.registro.video.length ?
                            <div className="row">
                                <div className="col mb-3">
                                    <iframe title={`preview-${this.state.registro.id}`} src={this.state.registro.video} width="100%" height="315" frameBorder="0" allowFullScreen></iframe>
                                </div>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="row mb-3">
                            <div className="col">
                                <span className="bg-dark text-white p-2 rounded d-block">Datos del Municipio</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="mdireccion">Dirección</label>
                                    <input type="text" name="mdireccion" id="mdireccion" className="form-control" value={this.state.registro.mdireccion} onChange={(e) => this.setState({registro: {...this.state.registro, mdireccion: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="mtelefono">Teléfono</label>
                                    <input type="text" name="mtelefono" id="mtelefono" className="form-control" value={this.state.registro.mtelefono} onChange={(e) => this.setState({registro: {...this.state.registro, mtelefono: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="minterno">Interno</label>
                                    <input type="text" name="minterno" id="minterno" className="form-control" value={this.state.registro.minterno} onChange={(e) => this.setState({registro: {...this.state.registro, minterno: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="mmail">Email</label>
                                    <input type="text" name="mmail" id="mmail" className="form-control" value={this.state.registro.mmail} onChange={(e) => this.setState({registro: {...this.state.registro, mmail: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="mweb">Web</label>
                                    <input type="text" name="mweb" id="mweb" className="form-control" value={this.state.registro.mweb} onChange={(e) => this.setState({registro: {...this.state.registro, mweb: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="mresponsable">Responsable</label>
                                    <input type="text" name="mresponsable" id="mresponsable" className="form-control" value={this.state.registro.mresponsable} onChange={(e) => this.setState({registro: {...this.state.registro, mresponsable: e.target.value}})} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="fiestas">Festejos</label>
                                    <textarea rows="15" name="fiestas" id="fiestas" className="form-control" value={this.state.registro.fiestas} onChange={(e) => this.setState({registro: {...this.state.registro, fiestas: e.target.value}})} autoComplete="off" placeholder="Festejos/Eventos que generalmente se dan en la localidad cada año (solo para tener en cuenta)" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <FormOptions id={this.state.registro.id} />
                        </div>
                    </div>
                </React.Fragment>
                :
                <h1>Cargando...</h1>
            }
            </React.Fragment>
        );
    }
}

export default FormLoc;