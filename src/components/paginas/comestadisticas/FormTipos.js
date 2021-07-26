import React, { Component } from "react";
import Msg from "../../utiles/Msg";

class FormTipos extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          visible: false,
          tipos: [],
          tipoPost: {
            tipo: "",
            nombre: ""
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
    
      handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
          tipoPost: {
            ...this.state.tipoPost,
            [name]: value,
          },
        });
     }

     validate(event){
      event.preventDefault();
      
      if(this.state.tipoPost.tipo == "Seleccione un tipo"){
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
      data.append("tipo", this.state.tipoPost.tipo);
      data.append("nombre", this.state.tipoPost.nombre);

      fetch(`${process.env.REACT_APP_API_HOST}/tipografico/addNew`, {
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

    async getData() {
        fetch(`${process.env.REACT_APP_API_HOST}/tiposgraficos/soloTipo`, {
          method: "GET",
          headers: {
            Authorization: "",
          }
        })
        .then((res) => res.json())
        .then(
            (result) => {
                result.data.registros.unshift({
                    tipo: "Seleccione un tipo"
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

    componentDidUpdate(prevProps) {
      if(this.props.actualizarComponente !== prevProps.actualizarComponente) {
          this.getData();
      }
    }

  render() {
    const tipos = this.state.tipos.map((tipo) => {
        return(<option key={`tipo-${tipo.tipo}`} value={tipo.tipo}>{tipo.tipo} </option>);
    });
    return (
        <div>
          {/*this.state.loading*/ false ? (
            <div>Cargando</div>
          ) : (
            <React.Fragment>
              <div>
                <h5 className="bg-dark text-white p-3 mb-3 rounded">
                Crear Tipo de grafico
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
                        <select id="tipo" name="tipo" className="form-control" value={this.state.tipoPost.tipo} onChange={this.handleInputChange}>
                            {tipos}
                        </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del tipo</label>
                        <input id="nombre" name="nombre" className="form-control" value={this.state.tipoPost.nombre} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-arrow-down" /> Agregar Tipo
                        </button>
                        </div>
                    </div>
                </div>    
              </form>
              </div>
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

export default FormTipos;
