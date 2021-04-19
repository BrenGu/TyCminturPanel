import React, { Component } from "react";
import Msg from "../../utiles/Msg";

class FormValores extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          graficos: [],
          valores: {
            etiqueta: "",
            valor: 0,
            idGrafico: 0
          },
          msg: {
            visible: false,
            body: "",
          },
        };
        this.validate = this.validate.bind(this);
        this.getData = this.getData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFromReportSubmit = this.handleFromReportSubmit.bind(this);
      }
    
      validate(event){
        event.preventDefault();
        
        if(this.state.valores.idGrafico == 0){
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
        data.append("etiqueta", this.state.valores.etiqueta);
        data.append("valor", this.state.valores.valor);
        data.append("idGrafico", this.state.valores.idGrafico);

        fetch(`${process.env.REACT_APP_API_HOST}/addvalores`, {
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
                  this.props.actualizarGraph();
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
      }
  
      handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
          valores: {
            ...this.state.valores,
            [name]: value,
          },
        });
    }

    getData (){
        fetch(`${process.env.REACT_APP_API_HOST}/graficos`, {
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
                    tipoGrafico: "Seleccione un grafico"
                });
                this.setState({
                 graficos: result.data.registros
                })
            },
            (error) => {
            console.log(error);
            }
        );      
    }

    componentDidUpdate(prevProps) {
      if(this.props.actualizarComponente !== prevProps.actualizarComponente) {
          this.getData();
      }
  }

    componentDidMount(){
        this.getData();
    }

  render() {
    const graficos = this.state.graficos.map((graficos) => {
        return(<option key={`tipo-${graficos.id}`} value={graficos.id}>{graficos.tipoGrafico}</option>);
    });
      return (
        <div>
          {/*this.state.loading*/ false ? (
            <div>Cargando</div>
          ) : (
            <React.Fragment>
              <h5 className="bg-dark text-white p-3 mb-3 rounded">
                Llenar Graficos
              </h5>
              <form
                method="post"
                onSubmit={this.validate}
                id="frm-novedades"
              >
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                        <label htmlFor="idTipo">Graficos</label>
                        <select id="idGrafico" name="idGrafico" className="form-control" value={this.state.valores.idGrafico} onChange={this.handleInputChange}>
                            {graficos}
                        </select>
                    </div>
                 </div>
                 <div className="col">
                    <div className="form-group">
                        <label htmlFor="etiqueta">Nombre</label>
                        <input id="etiqueta" name="etiqueta" className="form-control" value={this.state.valores.etiqueta} onChange={this.handleInputChange} />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                        <label htmlFor="valor">Valor</label>
                        <input id="valor" name="valor" className="form-control" value={this.state.valores.valor} onChange={this.handleInputChange} />
                    </div>
                 </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-arrow-down" /> Agregar Valor
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

export default FormValores;
