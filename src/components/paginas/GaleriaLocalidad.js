import React, { Component } from "react";
import { Form } from "reactstrap";
//import { Consumer } from "../../context";
import Msg from "../utiles/Msg";
import FormGaleriaLocalidad from "./comgalerialocalidad/FormGaleriaLocalidad";
import TagPopup from "./comgalerialocalidad/TagPopup";

class GaleriaLocalidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
      fotos: [],
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
      filtro: "",
      msg: {
        visible: false,
        body: "",
      },
      noresult: "",
    };

    this.getData = this.getData.bind(this);
    this.getTags = this.getTags.bind(this);
    this.getFotos = this.getFotos.bind(this);
    this.handleFromGalLocSubmit = this.handleFromGalLocSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    //this.addNewTag = this.addNewTag.bind(this);
    this.handleBusquedaChange = this.handleBusquedaChange.bind(this);
    this.eliminarFoto = this.eliminarFoto.bind(this);
    //this.handleBuscadorTagChange = this.handleBuscadorTagChange.bind(this);
    this.tagClose = this.tagClose.bind(this);
  }

  //Elimitar una foto de la galeria
  eliminarFoto(id) {
    //console.log("Id a eliminar: " + id)

    fetch(`${process.env.REACT_APP_API_HOST}/delfotoloc/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: "Los datos se eliminaron correctamente.",
                },
              },
              () => {
                this.getData();
                this.getFotos();
                this.getTags();
              }
            );
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
    //}
    //);
  }

  getFotos() {
    fetch(`${process.env.REACT_APP_API_HOST}/listfotos/12`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState({
              fotos: result.data.registros,
            });
            //console.log(this.state.fotos);
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
  //Trae todas las ciudades
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
  //Guarda id de localidadad selected
  handleLocalidadChange(event) {
    event.preventDefault();
    this.setState({
      ciudadSelected: event.target.value,
    });
  }
  //Filtro de tags dinamico
  handleBusquedaChange = (event) => {
    //this.handleValue(event.target.value);
    //let cont = 0;
    //console.log("BusquedaChange");
    event.preventDefault();
    //console.log(this.state.filtro);
    let valor = "";
    if (event) valor = event.target.value;

    this.setState({ filtro: valor }, () => {
      var copy = Object.assign([], this.state.tags.data);
      let cont = 0;
      copy = copy.map((d) => {
        if (d.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1) {
          d.visible = true;
        } else {
          d.visible = false;
          cont++;
        }
        return d;
      });
      //Si todos los tags estan ocultos
      if (cont == this.state.tags.data.length) {
        //document.getElementById("addtag").disabled = false;
        this.setState({
          noresult:
            'Sin resultados... Agreguelo a la lista a través el botón "Crear Tag".',
        });
      } else {
        //document.getElementById("addtag").disabled = true;
        this.setState({
          noresult: "",
        });
      }

      this.setState({
        tags: {
          ...this.state.tags,
          data: copy,
        },
      });
    });
  };

  // handleBuscadorTagChange(event) {
  //   this.setState({
  //     filtro: event.target.value,
  //   });

  //   let valor = event.target.value;

  //   this.setState({ filtro: valor }, () => {
  //     var copy = Object.assign([], this.state.tags.data);
  //     copy = copy.map((d) => {
  //       if (d.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1) {
  //         d.visible = true;
  //         return d;
  //       } else {
  //         d.visible = false;
  //       }
  //       return d;
  //     });
  //     this.setState({
  //       tags: {
  //         ...this.state.tags,
  //         data: copy
  //       }
  //     });
  //   });
  // }

  handleImgChange(event) {
    event.preventDefault();
    let id = "img-" + event.target.id;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    //console.log(event.target.id);
  }

  // addNewTag() {
  //   //event.preventDefault();
  //   console.log("newTag");

  //   let newTag = this.state.filtro;
  //   // const data = new FormData();
  //   // data.append("nombre", newTag);
  //   let data = {
  //     nombre: newTag,
  //   };
  //   console.log(`${process.env.REACT_APP_API_HOST}/addtag`);
  //   fetch(`${process.env.REACT_APP_API_HOST}/addtag`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: "asdssffsdff",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         if (!result.err) {
  //           this.setState(
  //             {
  //               msg: {
  //                 visible: true,
  //                 body: "Tag agregado correctamente",
  //               },
  //             },
  //             () => {
  //               this.getTags();
  //             }
  //           );
  //         } else {
  //           this.setState({
  //             msg: {
  //               visible: true,
  //               body: result.errMsgs,
  //             },
  //           });
  //         }
  //       },
  //       (error) => {
  //         //???
  //         console.log(error);
  //       }
  //     );

  //   this.getTags();
  //   // this.setState({
  //   //   filtro: "",
  //   // });
  // }

  tagClose(guardo) {
    console.log(guardo);
    this.getTags();
    // if(guardo === "OK"){
    //   this.setState(
    //     {
    //       msg: {
    //         visible: true,
    //         body:  "Tag guardado correctamente",
    //       },
    //     },
    //     () => {
    //       this.getTags();
    //     }
    //   );
    // }
    // else{
    //   //console.log(guardo)
    // }
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

  handleSave() {
    //event.preventDefault();
    const data = new FormData();

    let concatTags = this.state.tagsSelected.toString();

    var imagen = document.getElementById("upl-foto").files[0];

    if (imagen) {
      data.append("imagen", imagen, imagen.name);
    } else {
      data.append("imagen", "default.jpg");
    }

    data.append("idloc", this.state.departamentoSelected);
    data.append("idciudad", this.state.ciudadSelected);
    data.append("tags", concatTags);
    data.append("activo", 1);

    data.forEach((e) => console.log(e));
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
          console.log(result);
          if (!result.err) {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: "La foto se agregó correctamente a la galería",
                },
              },
              () => {
                this.resetForm();
                //this.getData();
                this.getTags();
                this.getFotos();
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

  handleFromGalLocSubmit() {
    //event.preventDefault();

    if (this.state.ciudadSelected) {
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
              this.handleSave();
            });
          })
          .catch((err) => {
            this.setState({
              MsgVisible: true,
              MsgBody: err.errMsg,
            });
          });
      });
    } else {
      this.setState({
        msg: {
          visible: true,
          body:
            "Primero debe seleccionar la localidad a la que pertenece la foto",
        },
      });
    }
  }

  resetForm() {
    this.setState({
      foto: {
        image: "default.jpg",
      },
      ciudadSelected: 0,
      tagsSelected: [],
      filtro: "",
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
    this.getTags();
  }

  componentDidMount() {
    this.getTags();
    this.getData();
    this.getFotos();
  }

  render() {
    const lista_galeria = this.state.fotos.map((foto) => {
      return (
        <FormGaleriaLocalidad
          key={`foto-${foto.id}`}
          id={foto.id}
          eliminar={this.eliminarFoto}
        />
      );
    });

    const localidades = this.state.localidades.data.map((ciudades) => {
      return (
        <option key={`loc-${ciudades.id}`} value={ciudades.id}>
          {ciudades.nombre}
        </option>
      );
    });

    const filtro = this.state.tags.data.map((tag) => {
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

    return (
      <div className="Galeria">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-newspaper" /> Galeria de Imagenes por
              Localidad
            </h4>
            <form
              //method="post"
              //onSubmit={this.handleFromGalLocSubmit}
              id="frm-foto"
            >
              <div className="grid-galerialocalidad">
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
                          <option value="0">Seleccione una localidad...</option>
                          {localidades}
                        </select>
                      </div>

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-9">
                            <label htmlFor="buscar">Tags</label>
                            <input
                              type="text"
                              name="buscar"
                              id="buscar"
                              className="form-control"
                              value={this.state.filtro}
                              onChange={this.handleBusquedaChange}
                              autoComplete="off"
                              placeholder="Busqueda de tags...."
                            />
                          </div>
                          <div className="col">
                            {/* <button
                              id="addtag"
                              className="btn btn-primary btntag"
                              disabled
                              onClick={this.addNewTag}
                            >
                              <i className="fas fa-plus" /> Crear tag
                            </button> */}
                            <TagPopup onClose={this.tagClose} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <div className="d-flex justify-content-center flex-wrap">
                              {filtro}
                              {this.state.noresult}
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
                    <button
                      type="button"
                      onClick={this.handleFromGalLocSubmit}
                      className="btn btn-primary"
                    >
                      {/* <i className="fas fa-plus" />*/} <i className="fas fa-save" /> Guardar Imagen
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Lista de Fotos
            </h5>
            <div className="row">
              <div className="col">
                <span>Últimas 12 fotos cargadas</span>
                <hr />
                {lista_galeria}
              </div>
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
            color: #000;
          }
          .btntag {
            position: absolute;

            bottom: 0;
          }
        `}</style>
      </div>
    );
  }
}

export default GaleriaLocalidad;
