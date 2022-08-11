import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";
import MyEditor from "../../paginas/subcomponentes/MyEditor";

class FormGaleriaLocalidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      registros: {
        id: 0,
        imagen: "default.jpg",
        idloc: 0,
        idciudad: 0,
        tags: "",
        activo: 1,
      },
      localidades: {
        data: [
          {
            id: 0,
            nombre: "Cargando...",
          },
        ],
      },
      tags: {
        data: [
          {
            id: 0,
            nombre: "Cargando...",
            visible: true,
          },
        ],
      },
      tagsSelected: [],
      ciudadSelected: 0,
      departamentoSelected: 0,
      msg: {
        visible: false,
        body: "",
        tipo: 0,
      },
    };
    this.setData = this.setData.bind(this);
    this.setTags = this.setTags.bind(this);
    this.getTags = this.getTags.bind(this);
    this.getCiudades = this.getCiudades.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
  }

  handleSaveData(event) {
    event.preventDefault();

    new Promise((resolve, reject) => {
      fetch(
        `${process.env.REACT_APP_API_HOST}/departamentos/ciudad/${
          this.state.ciudadSelected
        }`,
        {
          method: "GET",
          headers: {
            Authorization: "",
          },
        }
      )
        .then((res) => {
          res.json().then((data) => {
            this.setState({
              departamentoSelected: data.data.registros[0].id,
            });
            //console.log(data);
            this.saveData(event);
          });
        })
        .catch((err) => {
          this.setState({
            MsgVisible: true,
            MsgBody: err.errMsg,
          });
        });
    });
  }

  saveData(event) {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(this.state.registros).forEach((key) =>
      formData.append(key, this.state.registros[key])
    );
    //Imágenes
    let imagen = document.getElementById(`file-1-${this.state.registros.id}`)
      .files[0];
    if (imagen) {
      formData.append("imagen", imagen, imagen.name);
    }
    let concatTags = this.state.tagsSelected.toString();

    formData.append("idcuidad", this.state.ciudadSelected);
    formData.append("idloc", this.state.departamentoSelected);
    formData.append("tags", concatTags);

    //Verificar tamaño de las imágenes no mas de 4MB
    if (formData.has("imagen")) {
      if (formData.get("imagen").size > 500000) {
        this.setState({
          msg: {
            tipo: 0,
            visible: true,
            body: "El tamaño de la primer imágen supera los 4MB.",
          },
        });
        return false;
      }
    }
    //Guardar los cambios
    let token = this.context.token;
    fetch(
      //console.log(this.)
      `${process.env.REACT_APP_API_HOST}/altfotoloc/${this.state.id}`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: "Los datos se guardaron correctamente",
              },
            });
          } else {
            this.setState({
              msg: {
                tipo: 0,
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

  handleTagClick(id) {
    if (this.state.tagsSelected.includes(id)) {
      //let index = this.state.tagsSelected.indexOf(id);
      //console.log("estoy en " + index);
      //this.state.tagsSelected.splice(index);
      // this.setState({
      // tagsSelected: this.tagsSelected.filter(function(tag){
      //   return tag !== id;
      // })
      this.setState((previousState) => ({
        tagsSelected: previousState.tagsSelected.filter((tag) => tag !== id),
      }));
      // });
    } else {
      this.setState((previousState) => ({
        tagsSelected: [...previousState.tagsSelected, id],
      }));
    }
    console.log(this.state.tagsSelected);

    //console.log(this.state.tagsSelected);
  }
  //Trae todas las ciudades
  getCiudades() {
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
  setTags() {
    let splitedtags = this.state.registros.tags.split(",");
    //console.log(splitedtags[1]);
    if (splitedtags) {
      this.setState({
        tagsSelected: splitedtags,
      });
      console.log("tengo " + splitedtags.length + " tags.");
      console.log(splitedtags.indexOf(0));
    } else {
      console.log("estoy vacio");
    }
  }
  //Trae todos los tags
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

            //console.log(this.state.tags);
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
  //Trae todas las fotos
  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id,
      },

      () => {
        fetch(
          `${process.env.REACT_APP_API_HOST}/galerialocalidad/${this.state.id}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              //"Content-Type": "application/json"
            },
          }
        )
          .then((res) => res.json())
          .then(
            (result) => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    registros: result.data.registros[0],
                    loading: false,
                    tagsSelected: result.data.registros[0].tags.split(","),
                  });
                  console.log(this.state.tagsSelected);
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
                //console.log(this.state.registros);
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
              this.setState({
                msg: {
                  visible: true,
                  body: error,
                },
              });
            }
          );
      }
    );
  }

  handleImgChange(event) {
    //disparador ej: file-1-${this.state.registro.id
    //imagen ej: img-1-${this.state.registro.id
    let disparador = event.target.id.split("-");
    let id = `img-${disparador[1]}-${disparador[2]}`;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  componentDidMount() {
    this.setData();
    this.getCiudades();
    this.getTags();
    this.setTags();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setData();
    }
  }

  render() {
    const tags = this.state.tags.data.map((tag) => {
      return (
        <span
          className={`spanloc ${
            this.state.tagsSelected.includes(tag.id) ? " active" : ""
          }${tag.visible ? " d-block" : " d-none"}`}
          key={`tag-${tag.id}`}
          onClick={(e) => this.handleTagClick(tag.id)}
        >
          #{tag.nombre}
        </span>
      );
    });
    const localidades = this.state.localidades.data.map((d) => {
      return (
        <option key={`loc-opt-${d.id}`} value={d.id}>
          {" "}
          {d.nombre}
        </option>
      );
    });

    return (
      <React.Fragment>
        {this.state.loading ? (
          <h1>Cargando...</h1>
        ) : (
          <form
            method="post"
            onSubmit={this.saveData}
            id="frm-galerialocalidad"
          >
            <div className="row border p-2 mb-3">
              <div className="col-sm-12 col-md-3">
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-1-${this.state.registros.id}`}
                    id={`file-1-${this.state.registros.id}`}
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <img
                    id={`img-1-${this.state.registros.id}`}
                    className="img-fluid"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_GALERIA_LOCALIDADES
                    }/${this.state.registros.imagen}`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-1-${this.state.registros.id}`)
                        .click();
                    }}
                  />
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="localidad">Localidad</label>
                      <select
                        name="idloc"
                        id="idloc"
                        className="form-control"
                        value={this.state.registros.idciudad}
                        onChange={(e) =>
                          this.setState({
                            registros: {
                              ...this.state.registros,
                              idciudad: e.target.value,
                            },
                          })
                        }
                      >
                        {localidades}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="tags">Tags</label>
                      <div className="d-flex justify-content-center flex-wrap">
                        {tags}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(e) =>
                          this.props.eliminar(this.state.registros.id)
                        }
                      >
                        <i className="fas fa-trash" />
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save" /> Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </React.Fragment>
    );
  }
}

FormGaleriaLocalidad.contextType = Consumer;
export default FormGaleriaLocalidad;
