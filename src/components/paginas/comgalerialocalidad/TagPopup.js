import React, { Component, useState } from "react";
import { Consumer } from "../../../context";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// class TagPopup extends Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             id:0,
//             nombre: "",
//         };

//         this.saveTag = this.saveTag.bind(this);
//     }

//     saveTag(){
//         console.log("newTag");

//         let newTag = this.state.filtro;
//         // const data = new FormData();
//         // data.append("nombre", newTag);
//         let data = {
//           nombre: newTag,
//         };
//         //console.log(`${process.env.REACT_APP_API_HOST}/addtag`);
//         fetch(`${process.env.REACT_APP_API_HOST}/addtag`, {
//           method: "POST",
//           headers: {
//             Authorization: "asdssffsdff",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         })
//           .then((res) => res.json())
//           .then(
//             (result) => {
//               if (!result.err) {
//                 this.setState(
//                   {
//                     msg: {
//                       visible: true,
//                       body: "Tag agregado correctamente",
//                     },
//                   },
//                   () => {
//                     //this.getTags();
//                   }
//                 );
//               } else {
//                 this.setState({
//                   msg: {
//                     visible: true,
//                     body: result.errMsgs,
//                   },
//                 });
//               }
//             },
//             (error) => {
//               //???
//               console.log(error);
//             }
//           );

//         //this.getTags();
//         // this.setState({
//         //   filtro: "",
//         // });
//       }

//       render(){
//         return(
//             <>
//                 <form
//                     method="post"
//                     onSubmit={this.saveTag}
//                 >

//                 </form>
//             </>
//         );
//     }
// }

// TagPopup.contextType = Consumer;
// export default TagPopup;

export default function TagPopup(props) {
  const [nombre, setNombre] = useState("");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleClose = () => {
    setShow(false);
    setNombre("");
    //console.log("Saved: " + saved);
    //saved ? props.onClose(true) : props.onClose(false)
    props.onClose(saved);
  };

  //const handleSaved = () => setSaved(true);

  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    let name = nombre;

    let data = { nombre: name };
    let url = `${process.env.REACT_APP_API_HOST}/addtag`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "asdssffsdff",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.err) {
          setSaved(true, () => {
            console.log("Tag agregado correctamente: ");
          });
          //handleClose();
        } else {
          console.log("Error: " + result.err);
          setSaved("Error: " + result.err);
        }

        handleClose();
        //setNombre('');
      });
  };

  return (
    <>
      <button
        id="addtag"
        onClick={handleShow}
        className="btn btn-primary btntag"
      >
        Nuevo <i className="fas fa-plus" />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Crear nuevo tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <form
            onSubmit={(e) => {
              e.preventDefault();
              setNombre("");
              props.newTag(nombre);
            }}
            id="editmodal"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1"
                  for="nombre"
                >
                  Tag:
                </label>
              </div>
              <div className="md: w-2/3">
                <input
                  className="bggray-200 appearance-none borde-2 border-gray-200"
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                  }}
                  placeholder="Escriba el nombre del nuevo tag..."
                />
              </div>
            </div>
          </form> */}
          {/* <Form onSubmit={(e) => {
            e.preventDefault(); 
            setNombre();
            console.log(e.target.value);
          }}> */}
          <Form>
            <Form.Group className="mb-3" controID="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escriba el nombre del nuevo tag..."
                id="tag-nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
              />
              <Form.Text className="text-muted">
                El signo '#' sera agregado automaticamente
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setSaved(false);
              handleClose();
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
