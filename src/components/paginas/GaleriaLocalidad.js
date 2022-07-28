import React, { Component } from "react";
import { Form } from "reactstrap";
//import { Consumer } from "../../context";
import Msg from "../utiles/Msg";

class GaleriaLocalidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadig: true,
      localidades: {
        data: [
          {
            id: 0,
            nombre: "Cargando...",
          },
        ],
      },
      ciudadSelected: 0,
      departamentoSelected: 0,
      foto: {
        image: "default.jpg",
      },
      tags: {
        data: [
          {
            id: 0,
            nombre: "Cargando...",
          },
        ],
      },
      tagsSelected: [],
      msg: {
        visible: false,
        body: "",
      },
    };

    this.getData = this.getData.bind(this);
    this.getTags = this.getTags.bind(this);
    this.getDepartamento = this.getDepartamento.bind(this);
    this.handleFromGalLocSubmit = this.handleFromGalLocSubmit.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.getDepto = this.getDepto.bind(this);
  }

  getTags() {
    fetch(`${process.env.REACT_APP_API_HOST}/tags`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            var setX = result.data.registros.map((v) => {
              return {
                ...v,
              };
            });
            this.setState({
              tags: {
                data: setX,
              },
            });
          } else {
            this.setState({
              msg: {
                visible: true,
                body: result.errMsg,
              },
            });
          }
        },
        (error) => {
          //???
          console.log(error);
        }
      );
    this.setState({
      loading: false,
    });
  }

  //Obtiene el departamento a traves del id de ciudad
  getDepto = () => {
    const idDepto = new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_HOST}/departamentos/ciudad/${this.state.ciudadSelected}`, {
        method: "GET",
        headers: {
          Authorization: "",
        },
      }).then((res) => {
        if (res.ok && res.status === 200) {
          res.json().then((data) => {
            let departamento = data.data.registros[0].id;
            this.setState(
              {
                departamentoSelected: departamento,
              }, () => {
                resolve("Ok");
              }
            );
          });
        } else {
          reject("Error")
          // this.setState({
          //   MsgVisible: true,
          //   MsgBody: res.errMsg,
          // });
        }
      });
    });

    Promise.all([idDepto]).then(values => {
      

    })
    
  };

  //Obtiene el departamento a traves del id de ciudad
  getDepartamento(id) {
    //console.log(id + " GET DPTO");
    fetch(`${process.env.REACT_APP_API_HOST}/departamentos/ciudad/${id}`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.data.count > 0) {
            //console.log("PASE");
            //console.log(result.data.registros[0].id);

            if (!result.err) {
              this.setState({
                departamentoSelected: result.data.registros[0].id,
              });
            } else {
              this.setState({
                msg: {
                  visible: true,
                  body: result.errMsg,
                },
              });
            }
          } else console.log("NO PASE");
        },
        (error) => {
          //???
          console.log(error);
        }
      );
    this.setState({
      loading: false,
    });
  }

  getData() {
    //Lista de Localidades
    fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
      method: "GET",
      headers: {
        Authorization: "asdssffsdff",
        //"Content-Type": "application/json"
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            var setX = result.data.registros.map((v) => {
              return {
                ...v,
              };
            });
            this.setState({
              localidades: {
                data: setX,
              },
            });
          } else {
            this.setState({
              MsgVisible: true,
              MsgBody: result.errMsg,
            });
          }
        },
        (error) => {
          //???
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  handleLocalidadChange(event) {
    this.setState({
      ciudadSelected: event.target.value,
    });
    this.getDepartamento(this.state.ciudadSelected);

    console.log(event.target.value);
  }

  handleImgChange(event) {
    let id = "img-" + event.target.id;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    console.log(event.target.id);
  }

  handleTagClick(id) {
    this.setState((previousState) => ({
      tagsSelected: [...previousState.tagsSelected, id],
    }));
  }

  handleFromGalLocSubmit(event) {

    this.getDepartamento(this.state.ciudadSelected);

    event.preventDefault();
    const data = new FormData();

    var imagen = document.getElementById("upl-foto").files[0];
    if (imagen) {
      data.append("imagen", imagen, imagen.name);
    }

    data.append("idloc", this.state.departamentoSelected);
    data.append("idciudad", this.state.ciudadSelected);

    //data.forEach((e) => console.log(e));
    fetch(`${process.env.REACT_APP_API_HOST}/addfotoloc`, {
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
              },
              () => {
                this.resetForm();
                this.getData();
                this.getTags();
              }
            );
          } else {
            this.setState({
              msg: {
                visible: true,
                body: result.errMsg,
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

  resetForm() {
    this.setState({
      foto: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        image: "default.jpg",
      },
    });
    document.getElementById("frm-foto").reset();
    document
      .getElementById("img-upl-foto")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_GALERIA_LOCALIDADES
        }/default.jpg`
      );
  }

  componentDidUpdate() {}

  componentDidMount() {
    this.getTags();
    this.getData();
  }

  render() {
    const localidades = this.state.localidades.data.map((ciudades) => {
      return (
        <option key={`loc-${ciudades.id}`} value={ciudades.id}>
          {ciudades.nombre}
        </option>
      );
    });

    const tags = this.state.tags.data.map((tag) => {
      return (
        <span
          className={`spanloc ${
            tag.id === this.state.tagsSelected ? "active" : ""
          }`}
          key={`tag-${tag.id}`}
          onClick={(e) => this.handleTagClick(tag.id)}
        >
          {tag.nombre}{" "}
        </span>
      );
    });

    return (
      <div className="Arboles">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-newspaper" /> Galeria de Imagenes por
              Localidad
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromGalLocSubmit}
              id="frm-foto"
            >
              <div className="grid-gakerialocalidad">
                <div className="noveades-span-row-2">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="idlocalidad">Localidad</label>
                        <select
                          name="idlocalidad"
                          id="idlocalidad"
                          className="form-control"
                          //   value={this.state.foto.idlocalidad}
                          onChange={this.handleLocalidadChange}
                        >
                          {localidades}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="buscar">Tags</label>
                        <input
                          type="text"
                          name="buscar"
                          id="buscar"
                          className="form-control"
                          value={this.state.filtro}
                          onChange={this.handleBusquedaChange}
                          autoComplete="off"
                        />
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <div className="d-flex justify-content-center flex-wrap">
                              {tags}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-foto"
                          id="upl-foto"
                          accept="image/*"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-foto"
                          className="img-fluid img-novedad"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env
                              .REACT_APP_API_DIRECTORY_GALERIA_LOCALIDADES
                          }/${this.state.foto.image}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-foto").click();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div>
                      <div className="row">
                        
                        <div className="d-flex">
                          
                        </div>
                      </div>
                    </div> */}
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={this.resetForm}
                    >
                      <i className="far fa-window-restore" />
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Agregar Imagen
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

        <style jsx="true">{`
          .grid-Images {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
          }
          .images-span-row-2 {
            grid-row: span 2 / auto;
          }
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

          .spanloc:hover {
            background-color: #007bff;
            color: #fff;
          }
          .spanloc.active:hover {
            background-color: #ccc;
          }
        `}</style>
      </div>
    );
  }
}

export default GaleriaLocalidad;
