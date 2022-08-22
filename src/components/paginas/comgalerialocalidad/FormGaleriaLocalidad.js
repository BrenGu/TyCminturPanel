import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

class FormGaleriaLocalidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      registro: {
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
      localidadSelected: 0,
      ciudadSelected: 0,
      filtro: "",
      msg: {
        visible: false,
        body: "",
        tipo: 0,
      },
    };
    this.setData = this.setData.bind(this);
    //this.setTags = this.setTags.bind(this);
    this.getTags = this.getTags.bind(this);
    this.getCiudades = this.getCiudades.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
    this.handleCiudadChange = this.handleCiudadChange.bind(this);
    this.handleBusquedaChange = this.handleBusquedaChange.bind(this);
    this.handleActivoChange = this.handleActivoChange.bind(this);
  }

  handleActivoChange = (e) =>{

    //const checked = e.target.checked;

    if(this.state.registro.activo){
      this.setState({
        registro: {
          ...this.state.registro,
          activo: 0
        }
      });
    }
    else{
      this.setState({
        registro: {
          ...this.state.registro,
          activo: 1
        }
      });
    }
   //console.log("Activo: " + this.state.registro.activo);
  }

  handleBusquedaChange = (event) => {
    //this.handleValue(event.target.value);
    //let cont = 0;
    //console.log("BusquedaChange");
    let valor = "";
    if (event) {
      valor = event.target.value;
    } else {
      valor = "";
    }

    this.setState({ filtro: valor }, () => {
      var copy = Object.assign([], this.state.tags.data);
      copy = copy.map((d) => {
        if (d.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1) {
          d.visible = true;
        } else {
          d.visible = false;
          //cont++;
        }
        return d;
      });
      //Si todos los tags estan ocultos
      // if(cont == this.state.tags.data.length){
      //   document.getElementById("addtag").disabled = false;
      // }
      // else{
      //   document.getElementById("addtag").disabled = true;
      // }

      this.setState({
        tags: {
          ...this.state.tags,
          data: copy,
        },
      });
    });
  };

  handleCiudadChange(event) {
    const target = event.target;
    this.setState({
      registro: {
        ...this.state.registro,
        idciudad: target.value,
      },
      ciudadSelected: target.value,
    });
    //console.log("HandleCiudadChange registro: " + this.state.registro.idciudad);
    //console.log("HandleCiudadChange selected: " + this.state.ciudadSelected);
  }

  askDelete(titulo) {
    this.setState({
      msg: {
        visible: true,
        body: `Seguro de eliminar "${titulo}"`,
        tipo: 1,
      },
    });
  }

  okDelete() {
    this.setState(
      {
        msg: {
          visible: false,
          body: "",
          tipo: 0,
        },
      },
      () => {
        this.props.eliminar(this.state.registro.id);
      }
    );
  }

  handleSaveData(event) {
    event.preventDefault();

    new Promise((resolve, reject) => {
      fetch(
        `${process.env.REACT_APP_API_HOST}/departamentos/ciudad/${
          this.state.registro.idciudad
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
              registro: {
                ...this.state.registro,
                idloc: data.data.registros[0].id,
              },
              localidadSelected: data.data.registros[0].id,
            });
            //console.log("Localidad obtenida idLoc: " + this.state.registro.idloc);
            //console.log("Localidad obtenida selected: " + this.state.localidadSelected);
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
    //console.log(this.state.registro);

    Object.keys(this.state.registro).forEach((key) =>
      formData.append(key, this.state.registro[key])
    );

    let concatTags = this.state.tagsSelected.toString();
    formData.set("tags", concatTags);
    //Imágen
    let imagen = document.getElementById(`file-1-${this.state.registro.id}`)
      .files[0];
    if (imagen) {//Si la imagen fue modificada
      formData.append("imagen", imagen, imagen.name);
    }

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
    // for (let [name, value] of formData) {
    //   console.log(`${name} = ${value}`); // key1 = value1, luego key2 = value2
    // }

    //Guardar los cambios
    let token = this.context.token;
    
    fetch(`${process.env.REACT_APP_API_HOST}/altfotoloc/${this.state.id}`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    })
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
            //this.setData();
          } else {
            this.setState(
              {
              msg: {
                tipo: 0,
                visible: true,
                body: result.errMsgs,
              },
            },
            () => {
              this.setData();
            }
            );
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

  //Formatea el campo tags para que se guarden en forma de array en tagsSelected.
  // setTags() {
  //   let splitedtags = this.state.registro.tags.split(",");
  //   if (splitedtags) {
  //     this.setState({
  //       tagsSelected: splitedtags,
  //     });
  //   } else {
  //     console.log("No hay tags.");
  //   }
  // }

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
                    registro: result.data.registros[0],
                    loading: false,
                    tagsSelected: result.data.registros[0].tags.split(","),
                  });
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
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
    //this.setTags();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.id !== prevProps.id) {
  //     this.setData();
  //     //Falta actulizar el estado al hacer cambios
  //   }
  // }

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
            onSubmit={this.handleSaveData}
            id="frm-galerialocalidad"
          >
            <div className="row border p-2 mb-3">
              <div className="col-sm-12 col-md-3">
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-1-${this.state.registro.id}`}
                    id={`file-1-${this.state.registro.id}`}
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <img
                    id={`img-1-${this.state.registro.id}`}
                    className="img-fluid"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_GALERIA_LOCALIDADES
                    }/${this.state.registro.imagen}`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-1-${this.state.registro.id}`)
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
                        value={this.state.registro.idciudad}
                        onChange={this.handleCiudadChange}
                      >
                        {localidades}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
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
                              placeholder="Buscar tag..."
                            />
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
                          this.props.eliminar(this.state.registro.id)
                        }
                      >
                        <i className="fas fa-trash" /> Eliminar
                      </button>
                      <div>
                      <label class="switch">
                        <input type="checkbox"
                        value={this.state.registro.activo}
                        onChange={this.handleActivoChange}
                        />
                        <span class="slider round"></span>
                       
                      </label>   Activo
                      </div>
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
        <Msg
          visible={this.state.msg.visible}
          okAceptar={this.okDelete}
          okClose={() =>
            this.setState({
              msg: { ...this.state.msg, visible: false, tipo: 0 },
            })
          }
          tipo={this.state.msg.tipo}
        >
          {this.state.msg.body}
        </Msg>

        <style jsx="true">{`
          .switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
          }
          
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
          }
          
          .slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
          }
          
          input:checked + .slider {
            background-color: #2196F3;
          }
          
          input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
          }
          
          input:checked + .slider:before {
            -webkit-transform: translateX(13px);
            -ms-transform: translateX(13px);
            transform: translateX(13px);
          }
          
          .slider.round {
            border-radius: 17px;
          }
          
          .slider.round:before {
            border-radius: 50%;
          }
        `}</style>
      </React.Fragment>
    );
  }
}

FormGaleriaLocalidad.contextType = Consumer;
export default FormGaleriaLocalidad;