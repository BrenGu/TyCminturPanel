import React, { Component } from "react";
//import LocSelect from "../utiles/LocSelect";
import FormCajeros from "./comcajeros/FormCajeros";
import Msg from "../utiles/Msg";


class Cajeros extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            registro: {
                    id: 0,
                    idlocalidad: 0,
                    tpo_bco:0,
                    direccion: "",
                    latitud: 0,
                    longitud: 0,
                },
            cajeros:[],
            localidades:[],    
            tipo_bco:[],
            msg:{
                visible: false,
                body:""
            }
        };
        this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
        this.handleTpo_bco_loca_Change = this.handleTpo_bco_loca_Change.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFromNovSubmit = this.handleFromNovSubmit.bind(this);

    }
    
    handleTpo_bco_loca_Change(event) {
      this.setState({
        registro: {
          ...this.state.data,
          tpo_bco: event.target.value
        }
      });
    }

    handleLocalidadChange(event) {
        this.setState({
          registro: {
            ...this.state.data,
            idlocalidad: event.target.value
          }
        });
      }

      
      handleFromNovSubmit(event) {
        event.preventDefault();
        let registro = {
          "idlocalidad": this.state.registro.idlocalidad,
          "tpo_bco":this.state.registro.tpo_bco,
          "direccion": this.state.registro.direccion,
          "latitud": this.state.registro.latitud,
          "longitud": this.state.registro.longitud,
        };
      }
      handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
          data: {
            ...this.state.registro,
            [name]: value
          }
        });
      }


      getData() {
        fetch(`${process.env.REACT_APP_API_HOST}/gettirolesas`, {
          method: "GET",
          headers: {
            Authorization: ""
          }
        })
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                this.setState({
                  tirolesas: result.data.registros
                });
              } else {
                this.setState({
                  msg: {
                    visible: true,
                    body: result.errMsg
                  }
                });
              }
            },
            error => {
              //???
              console.log(error);
            }
          );
        this.setState({
          loading: false
        });
        //Localidades
        let ciudades = new Promise((resolve, reject) => {
          fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
            method: "GET",
            headers: {
              Authorization: ""
            }
          })
            .then(res => res.json())
            .then(
              result => {
                if (!result.err) {       
                      
                  this.setState(
                    {
                      localidades: result.data.registros
                    },
                    () => {
                      resolve("Ok Ciudades");
                    }
                  );
                } else {
                  this.setState(
                    {
                      msg: {
                        visible: true,
                        body: result.errMsg
                      }
                    },
                    () => {
                      reject("Error");
                    }
                  );
                }
              },
              error => {
                //???
                console.log(error);
                reject("Error");
              }
            );
        });

          // Tipo de Bancos 

        let tpo_bco = new Promise((resolve, reject)=>{
          //  fetch(`${process.env.REACT_APP_API_HOST}/cajeros/localidad/${this.state.tipo_bco}`,{
            fetch(`${process.env.REACT_APP_API_HOST}/getcajeros`,{ 
          method: "GET",
            headers: {
              Authorization: ""
            }
          })
            .then(res => res.json())
            .then(
              result => {
                if (!result.err) {       
                      
                  this.setState(
                    {
                      tipo_bco: result.data.registros
                    },
                    () => {
                      resolve("Ok Ciudades");
                     
                    }
                  );
                } else {
                  this.setState(
                    {
                      msg: {
                        visible: true,
                        body: result.errMsg
                      }
                    },
                    () => {
                      reject("Error");
                    }
                  );
                }
              },
              error => {
                //???
                console.log(error);
                reject("Error");
              }
            );
        });

        Promise.all([ciudades,tpo_bco]).then(values => {
          this.setState({
            loading: false
          });
        });
      }
    
      componentDidMount() {
        this.getData();
      }

    render() {
        const localidades = this.state.localidades.map(localidad => {
        
            return (
              <option key={`loc-${localidad.id}`} value={localidad.id}>
                {localidad.nombre}
              </option>
            );
          });
        const tipo_bco = this.state.tipo_bco.map(tipo_banco  =>{
          return(
            <option key={`tp-${tipo_banco.id}`} value={tipo_banco.id}>
              {tipo_banco.nombre}
            </option>
          )
        }

        );

          return(
            <div className="Novedades">
                {this.state.loading ? (
                    <div>Cargando</div>
                    ) : (
                        <React.Fragment>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 bg-primary text-white p-2 mb-3">
                                        <div style={{fontSize: "1.4rem"}}>Datos los Cajeros {""}</div>
                                  </div>
                                    </div>
                                    <form
                                      method="post"
                                      onSubmit={this.handleFromNovSubmit}
                                      id="frm-novedades"
                                    ></form>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6 m-auto">
                                        <div className="form-group">
                                        <label htmlFor="idlocalidad">Localidad</label>
                                        <select
                                            name="idlocalidad"
                                            id="idlocalidad"
                                            className="form-control"
                                            value={this.state.registro.idlocalidad}
                                            onChange={this.handleLocalidadChange}
                                        >
                                            {localidades}
                                        </select>
                                    </div>
                                            <div className="form-group">
                                                <label htmlFor="tpo_bco">Bancos </label>
                                                <select
                                                    name="tpo_bco"
                                                    id="tpo_bco"
                                                    className="form-control"
                                                    value={this.state.registro.tpo_bco}
                                                    onChange={this.handleTpo_bco_loca_Change}
                                                  >
                                                    {tipo_bco}
                                                  </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="telefono">Domicilio</label>
                                                <input type="text" name="telefono" id="telefono" className="form-control" value={this.state.registro.telefono} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 m-auto">
                                        <div className="form-group">
                                                <label htmlFor="latitud">Latitud</label>
                                                <input type="text" name="latitud" id="latitud" className="form-control" value={this.state.registro.latitud} onChange={this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="longitud">Longitud</label>
                                                <input type="text" name="longitud" id="longitud" className="form-control" value={this.state.registro.longitud} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                    
                                    </div>
                                    <div className="row mb-5">
                                        <div className="col">
                                            {
                                                "<" ?
                                                <div className="d-flex justify-content-between">
                                                    <button type="button" className="btn btn-danger" onClick={(e) => this.deleteData(this.state.registro.id, e)}>Eliminar</button>
                                                    <button type="button" className="btn btn-primary" onClick={this.saveData}>Guardar</button>
                                                </div>
                                                :
                                                <div className="d-flex justify-content-end">
                                                    <button type="button" className="btn btn-primary" onClick={this.saveData}>Guardar</button>
                                                </div>
                                            }
                                        </div>
                                    </div>                                 
                                </React.Fragment>                  
                )}
                    <Msg visible={this.state.msg.visible} 
                        okClose={() => this.setState({msg: {...this.state.msg, visible: false}})} 
                        tipo="0">
                        {this.state.msg.body}
                    </Msg>
                    <style jsx="true">{`
                    .grid-noveades {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-gap: 10px;
                    }
                    .noveades-span-row-2 {
                    grid-row: span 2 / auto;
                    }
                `}</style>
                     </div>
        );
    }
}

export default Cajeros;
