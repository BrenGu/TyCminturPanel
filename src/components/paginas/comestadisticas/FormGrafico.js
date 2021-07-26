import React, { Component } from "react";
import Msg from "../../utiles/Msg";

class FormGrafico extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          tipos: [],
          grafico: {
            idTipo: 0,
            idReporte: 0
          },
          msg: {
            visible: false,
            body: "",
          },
        };
        this.validate = this.validate.bind(this)
        this.getData = this.getData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFromReportSubmit = this.handleFromReportSubmit.bind(this);
      }
    
      validate(event){
        event.preventDefault();
        
        if(this.state.grafico.idTipo == 0){
          this.setState(
            {
                msg: {
                visible: true,
                body: "Debe seleccionar una opcion valida",
                },
            });
        }else{
            this.handleFromReportSubmit();
        }
      }

      handleFromReportSubmit() {
        //event.preventDefault();
        const data = new FormData();
        data.append("idTipo", this.state.grafico.idTipo);

        fetch(`${process.env.REACT_APP_API_HOST}/reporte/ultimo`, {
            method: "GET",
            headers: {
              Authorization: "",
            }
        })
        .then((res) => res.json())
        .then(
            (result) => {             
                this.setState({
                    grafico: {
                        ...this.state.grafico,
                        idReporte: result.data.registros[0].id,
                    },
                }, () => {
                    data.append("idReporte", this.state.grafico.idReporte);
                    console.log(data)
                    fetch(`${process.env.REACT_APP_API_HOST}/grafico/addNew`, {
                        method: "POST",
                        headers: {
                          Authorization: "",
                        },
                        body: data,
                      })
                    .then((res) => res.json())
                    .then(
                        (result) => {
                        if (!result.err) {
                            this.setState(
                            {
                                msg: {
                                visible: true,
                                body: "Los datos se agregaron correctamente",
                                },
                            }, () => {
                              this.props.actualizarComponente();
                            });
                        } else {
                            this.setState({
                                msg: {
                                    visible: true,
                                    body: result.errMsgs,
                                },
                            });
                        }
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                })
            },
            (error) => {
            console.log(error);
            }
        );     
      }
  
      handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
          grafico: {
            ...this.state.grafico,
            [name]: value,
          },
        });
    }

    getData (){
        fetch(`${process.env.REACT_APP_API_HOST}/tiposgraficos/all`, {
            method: "GET",
            headers: {
              Authorization: "",
            }
        })
        .then((res) => res.json())
        .then(
            (result) => {
                result.data.registros.unshift({
                    id: 0,
                    tipo: "Seleccione un tipo",
                    nombre: ""
                });
                this.setState({
                 tipos: result.data.registros
                })
            },
            (error) => {
            console.log(error);
            }
        );      
    }

    componentDidMount(){
        this.getData();
    }

  render() {
    const tipos = this.state.tipos.map((tipo) => {
        return(<option key={`tipo-${tipo.id}`} value={tipo.id}>{tipo.id == 0? `${tipo.tipo}${tipo.nombre}`: `${tipo.tipo} / (${tipo.nombre})`} </option>);
    });
      return (
        <div>
          {/*this.state.loading*/ false ? (
            <div>Cargando</div>
          ) : (
            <React.Fragment>
              <h5 className="bg-dark text-white p-3 mb-3 rounded">
                Crear Graficos
              </h5>
              <form
                method="post"
                onSubmit={this.validate}
                id="frm-novedades"
              >
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                        <label htmlFor="idTipo">Tipo de grafico</label>
                        <select id="idTipo" name="idTipo" className="form-control" value={this.state.grafico.idTipo} onChange={this.handleInputChange}>
                            {tipos}
                        </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-arrow-down" /> Agregar Grafico
                        </button>
                        </div>
                    </div>
                </div>    
              </form>
            </React.Fragment>
          )}
          <Msg
            visible={this.state.msg.visible}
            okClose={() =>
              this.setState({ msg: { ...this.state.msg, visible: false } })
            }
            tipo="0"
          >
            {this.state.msg.body}
          </Msg>
        </div>
      );
    }
}

export default FormGrafico;
