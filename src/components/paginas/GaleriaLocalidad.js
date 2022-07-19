import React, { Component } from "react";
import { Consumer } from "../../context";
import FormGaleriaLocalidad from "./comgalerialocalidad/FormGaleriaLocalidad";

import Msg from "../utiles/Msg";

class GaleriaLocalidad extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          foto: {
            id: 1,          
            idlocalidad: 6, //Ciudad de San Luis por defecto        
            image: "default.jpg"
          },
          localidades: [],
          //tags: [],
          galeria: [],
          tags:[{id:0, descripcion: "S/Datos", visible: false}],
          tagSelected:0,
          
          fotoTag: [],
          msg: {
            visible: false,
            body: "",
          },
        };
        this.getData = this.getData.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.handleFromGalLocSubmit = this.handleFromGalLocSubmit.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.procesar = this.procesar.bind(this);
        this.handleDeleteTag = this.handleDeleteTag.bind(this);

      }
    
      handleDeleteTag = (id) => {
        this.setState({
            loading: true
        }, () => {
            fetch(`${process.env.REACT_APP_URL_API_SERVER_2}/guia/servicio/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": localStorage.getItem("WebTurToken")
                }
            })
            .then(res => {
                this.findServicios();
            });
        });
    }
    
      handleFromGalLocSubmit(event) {
        event.preventDefault();    
        const data ={
          "idlocalidad": this.state.data.idlocalidad,
          "image": this.state.data.foto
        };
       
         
        const formData = new FormData();
        Object.keys(data).forEach((key) =>
          formData.append(key, data[key])
        );
        //Imágenes
        var img_uno = document.getElementById("upl-nov-uno").files[0];
        if (img_uno) {
         formData.append("img-uno", img_uno, img_uno.name);
        }
    
        formData.forEach(e => console.log(e))
        fetch(`${process.env.REACT_APP_API_HOST}/addfotoloc`, {
          method: "POST",
          headers: {
            "Authorization": "asdssffsdff"
          },
          body: formData
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
                  }
                );
              } else {
                console.log(result);
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
        document.getElementById("frm-carrusel").reset();
        document
          .getElementById("img-upl-nov-uno")
          .setAttribute(
            "src",
            `${process.env.REACT_APP_API_HOST}/${
              process.env.REACT_APP_API_DIRECTORY_GALERIA_LOCALIDADES
            }/default.jpg`
          );
      }
    
    handleInputChange(event) {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;
      this.setState({
        evento: {
          ...this.state.evento,
          [name]: value,
        },
      });
    }

    handleTagsChange= (event) => {
      this.setState({
        tagSelected: event.target.value
      });
    }
      
    procesar = () => {

      let alltag = Object.assign([], this.state.tags);
      let firstOK = 0;
      alltag = alltag.map((valor) => {
          let x = this.state.fotoTag.findIndex((e) => {
              if(valor.id === e.idtag) {
                  return true;
              } else {
                  return false;
              }
          });
          if(x > -1) {
              return {...valor, visible: false}
          } else {
              if(firstOK === 0) {
                  firstOK = valor.id;
              }
              return valor;
          }
      });
      if(firstOK === 0) {
          this.setState({
              menu_opt_sistema: false,
              tags: [{id: 0, descripcion: "S/Datos", visible: false}],
              tagSelected: 0,
              loading: false
          });
      } else {
          this.setState({
              menu_opt_sistema: true,
              tags: alltag,
              tagSelected: firstOK,
              loading: false
          });
      }
  }
      
      getData() {
        fetch(`${process.env.REACT_APP_API_HOST}/fotos`, {
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
                  galeria: result.data.registros,
                });
                console.log(this.state.galeria);
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
       
          
        let tags = new Promise((resolve, reject) => {
          fetch(`${process.env.REACT_APP_API_HOST}/tags`, {
            method: "GET",
            headers: {
              "Authorization": localStorage.getItem("WebTurToken")
            }
          })
          .then(res => {
            if(res.ok && res.status === 200) {
                res.json().then((data) => {
                    let res = data.data.registros.map((s) => {
                        return({
                            id: s.id,
                            nombre: s.nombre,
                            visible: true
                        });
                    });
                    this.setState({
                        tags: res
                    }, () => {
                        resolve("Ok");
                    });
                });
            } else {
                reject("Error al obtener todos los servicios");
            }
        });
        });
        ///  para el buscador de imagenes .. pendiente 
        let TagsPorImagen = new Promise((resolve, reject) => {
          fetch(`${process.env.REACT_APP_URL_API_SERVER_2}/foto/${this.state.foto.id}/tag`, {
              method: "GET",
              headers: {
                  "Authorization": localStorage.getItem("WebTurToken")
              }
          })
          .then(res => {
              if(res.ok && res.status === 200) {
                  res.json().then((data) => {
                      this.setState({
                        fotoTag: data.data.registros
                      }, () => {
                          resolve("Ok");
                      });
                  });
              } else {
                  reject("Error al obtener todos los servicios de la guia");
              }
          });
      });
        Promise.all([ciudades, tags,TagsPorImagen ]).then(values => {
          this.setState({
            loading: false,
            tagSelected: this.state.tags[0].id
          });
          this.procesar();
        });
      }
    

    
      componentDidMount() {
        this.getData();
      }
    
      render() {
    
        const localidades = this.state.localidades.map((localidad) => {
          return (
            <option key={`loc-${localidad.id}`} value={localidad.id}>
              {localidad.nombre}
            </option>
          );
        });

        const tags = this.state.tags.map((tag)=>{
          return(
            <option key={`tag-${tag.id}`} value={tag.id}>
              {tag.nombre}
            </option>
          );
        });
        const fotos = this.state.galeria.map((foto) => {
          return (
            <FormGaleriaLocalidad
              key={`foto-${foto.id}`}
              id={foto.id}
             // eliminar={this.eliminarNovedad}
            />
          );
        });
      
        const tagers = this.state.fotoTag.map((ftag) => {
          return(
              <span key={`Serv-${ftag.id}`} className="badge badge-pill badge-primary d-flex align-items-center">
                  <strong className="mr-2">{ftag.nombre}</strong>
                
                      <i className="fas fa-times-circle" onClick={this.handleDeleteTag.bind(this, ftag.id)}></i>
                  
              </span>
          );
      });

    
        return (
          <div className="GaleriaLocalidad">
            {this.state.loading ? (
              <div>Cargando</div>
            ) : (
              <React.Fragment>
                <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
                    <i className="fas fa-camera" /> Galeria de Imagenes por Localidad
                </h4>
                <form
                  method="post"
                  onSubmit={this.handleFromGalLocSubmit}
                  id="frm-carrusel"
                >
                  <div className="grid-gakerialocalidad">
                    <div className="noveades-span-row-2">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                          
                          <label htmlFor="idtag">Tag</label>
                            <select
                            name="idtag"
                            id="idtag"
                            className="form-control"
                            value={this.state.tagSelected}
                            onChange={this.handleTagsChange}
                            >
                          {tags}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                          <label htmlFor="idlocalidad">Localidad</label>
                        <select
                          name="idlocalidad"
                          id="idlocalidad"
                          className="form-control"
                          value={this.state.foto.idlocalidad}
                          onChange={this.handleLocalidadChange}
                        >
                          {localidades}
                        </select>
                          </div>
                        </div>
                      
                      </div>
                    </div>
                    <div>
                      <div className="row">
                        <div className="col mb-2">
                        </div>
                        <div className="d-flex">
                          <div className="col">
                            <input
                              type="file"
                              className="d-none"
                              name="upl-nov-uno"
                              id="upl-nov-uno"
                              accept="image/*"
                              onChange={this.handleImgChange}
                            />
                            <img
                              id="img-upl-nov-uno"
                              className="img-fluid img-novedad"
                              src={`${process.env.REACT_APP_API_HOST}/${
                                process.env.REACT_APP_API_DIRECTORY_CARRUSEL
                              }/${this.state.foto.image}`}
                              alt="Foto"
                              onClick={(e) => {
                                document.getElementById("upl-nov-uno").click();
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                <hr />
                <h5 className="bg-dark text-white p-3 mb-3 rounded">
                  Galerias 
                </h5>
                <div className="row">
                  <div className="col">
                    <span>Buscador </span>
                    <hr />
                    {fotos}
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
    
GaleriaLocalidad.contextType = Consumer;

export default GaleriaLocalidad;
