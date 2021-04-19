import React, { Component } from "react";
import Msg from "../../utiles/Msg";

class FormReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          reporte: {
            nombre: "",
            fechaDesde: "",
            fechaHasta: ""
          },
          msg: {
            visible: false,
            body: "",
          },
        };
        this.validate = this.validate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFromReportSubmit = this.handleFromReportSubmit.bind(this);
      }

      validate(event){
        event.preventDefault();
        
        if(this.state.reporte.nombre == "" || this.state.reporte.fechaDesde == "" || this.state.reporte.fechaHasta == ""){
          this.setState(
            {
                msg: {
                visible: true,
                body: "Debe completar todos los campos",
                },
            });
        }else{
            this.handleFromReportSubmit();
        }
      }

      handleFromReportSubmit() {
        //event.preventDefault();

        const data = new FormData();
        data.append("fechaDesde", this.state.reporte.fechaDesde);
        data.append("fechaHasta", this.state.reporte.fechaHasta);
        data.append("nombre", this.state.reporte.nombre);

        fetch(`${process.env.REACT_APP_API_HOST}/addreporte`, {
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
                      body: "El reporte se agrego correctamente",
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
              //???
              console.log(error);
            }
          );
      }

      handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
          reporte: {
            ...this.state.reporte,
            [name]: value,
          },
        });
      }

  render() {
      return (
        <div>
          {/*this.state.loading*/ false ? (
            <div>Cargando</div>
          ) : (
            <React.Fragment>
              <h5 className="bg-dark text-white p-3 mb-3 rounded">
                Crear Reporte
              </h5>
              <form
                method="post"
                onSubmit={this.validate}
                id="frm-novedades"
              >
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="form-control"
                        //value={this.state.novedad.localidad}
                        onChange={this.handleInputChange}
                        maxLength="50"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="fechaDesde">Fecha desde: </label>
                      <input
                        type="date"
                        name="fechaDesde"
                        id="fechaDesde"
                        className="form-control"
                        //value={this.state.novedad.localidad}
                        onChange={this.handleInputChange}
                        maxLength="50"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="fechaHasta">Fecha hasta: </label>
                      <input
                        type="date"
                        name="fechaHasta"
                        id="fechaHasta"
                        className="form-control"
                        //value={this.state.novedad.localidad}
                        onChange={this.handleInputChange}
                        maxLength="50"
                      />
                    </div>
                  </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col">
                      <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-arrow-down" /> Agregar Reporte
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

export default FormReport;
