import React, { useState, useEffect } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

const FormCensistas =  (props) => {
    const {eliminar, idProp} = props;
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(0);
    const [prevProps, setPrevProps] = useState({id: idProp})
    const [cen, setCen] = useState({
        id: 0,
        dni: "", 
        nombre: "",
        apellido: "",
        foto: "default.png",
        direccion: "",
        email: "",
        telefono: ""
    });
    const [msg, setMsg] = useState({
        visible: false,
        body: "",
        tipo: 0
    });

  const okDelete = () => {
    setMsg({
        visible: false,
        body: "",
        tipo: 0
    })
    eliminar(cen.id);    
  }

  const saveData = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("dni", cen.dni);
    data.append("nombre", cen.nombre);
    data.append("apellido", cen.apellido);
    data.append("direccion", cen.direccion);
    data.append("email", cen.email);
    data.append("telefono", cen.telefono);

    var img_uno = document.getElementById("upl-nov-uno").files[0];
    if (img_uno) { 
      data.append("foto", img_uno, img_uno.name);
    }

    fetch(`${process.env.REACT_APP_API_HOST}/censista/update/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            setMsg({
                tipo: 0,
                visible: true,
                body: "Los datos se guardaron correctamente"
            })
          } else {
            setMsg({
                tipo: 0,
                visible: true,
                body: result.errMsgs
            })
          }
        },
        error => {
          //???
          console.log(error);
        }
      );
  }

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name == "dni"){
        setCen({...cen, dni: value})
    }else if(name == "nombre"){
        setCen({...cen, nombre: value})
    }else if (name == "apellido"){
        setCen({...cen, apellido: value})
    }else if (name == "direccion"){
        setCen({...cen, direccion: value})
    }else if (name == "email"){
        setCen({...cen, email: value})
    }else if (name == "telefono"){
        setCen({...cen, telefono: value})
    }
  }

  const handleImgChange = (event) => {
    let disparador = event.target.id.split("-");
    let id = `img-${disparador[1]}-${disparador[2]}`;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  const setData = () => {
        setId(idProp)
        fetch(
          `${process.env.REACT_APP_API_HOST}/censista/${idProp}`,
          {
            method: "GET",
            headers: {
              Authorization: "token"
              //"Content-Type": "application/json"
            }
          }
        )
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                    setCen(result.data.registros[0])
                    setLoading(false)
                } else {
                  console.log("No hay registro: " + idProp);
                }
              } else {
                  setMsg({
                    visible: true,
                    body: result.errMsg
                  })
              }
            },
            error => {
              setMsg({
                visible: true,
                body: error
              })
            }
          );
      }

  useEffect(() => {
    setData();
  }, [])

  useEffect(() => {
    if(idProp !== prevProps.id ){
        setData()
    }
  }, [idProp])

    return (
      <React.Fragment>
        {loading ? (
          <h1>Cargando...</h1>
        ) : (
          <form method="post" onSubmit={saveData} id="frm-novedades">
            <div className="row border p-2 mb-3">
              <div className="col-sm-12 col-md-3">
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-1-${cen.id}`}
                    id={`file-1-${cen.id}`}
                    accept="image/*"
                    onChange={handleImgChange}
                  />
                  <img
                    id={`img-1-${cen.id}`}
                    className="img-fluid"
                    style={{
                      width: "250px",
                      height: "200px",
                      objectFit: "cover"
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_CENSISTAS_FOTOS
                    }/${cen.foto}`}
                    alt="Foto"
                    onClick={e => {
                      document
                        .getElementById(`file-1-${cen.id}`)
                        .click();
                    }}
                  />
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="dni">DNI</label>
                      <input
                          type="text"
                          name="dni"
                          id="dni"
                          className="form-control"
                          value={cen.dni}
                          onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-9">
                    <div className="form-group">
                     <label htmlFor="nombre">Nombre</label>
                      <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      className="form-control"
                      value={cen.nombre}
                      onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="apellido">Apellido</label>
                      <input
                          type="text"
                          name="apellido"
                          id="apellido"
                          className="form-control"
                          value={cen.apellido}
                          onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="direccion">Direccion</label>
                      <input
                          type="text"
                          name="direccion"
                          id="direccion"
                          className="form-control"
                          value={cen.direccion}
                          onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      value={cen.email}
                      onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                        <label htmlFor="telefono">Telefono</label>
                        <input
                        type="number"
                        name="telefono"
                        id="telefono"
                        className="form-control"
                        value={cen.telefono}
                        onChange={handleInputChange}
                        />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={e =>
                          eliminar(cen.id)
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
            <hr className="mt-5 mb-5" />
          </form>
        )}
        <Msg
          visible={msg.visible}
          okAceptar={okDelete}
          okClose={() =>
            setMsg({ ...msg, visible: false, tipo: 0 })
          }
          tipo={msg.tipo}
        >
          {msg.body}
        </Msg>
      </React.Fragment>
    );
}

FormCensistas.contextType = Consumer;

export default FormCensistas;
