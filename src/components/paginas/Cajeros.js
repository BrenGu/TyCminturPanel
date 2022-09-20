import React, { Component } from "react";
import LocSelect from "../utiles/LocSelect";
import FormCajeros from "./comcajeros/FormCajeros";

class Cajeros extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localidadSelect: 0
        }
        this.handleFClick = this.handleFClick.bind(this);
    }

    handleFClick(localidad) {
        if(localidad) {
            this.setState({
                //localidadSelect: localidad.id
                localidadSelect: localidad
            });
        } else {
            this.setState({
                localidadSelect: 0
            });
        }
    }


    render() {
        const localidadSelect = this.state.localidadSelect;
        return (
            <div className="container">
                <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s"><i className="far fa-building"></i> Cajeros</h4>
                <LocSelect handleFiltroClick={this.handleFClick} />
                {
                    localidadSelect === 0 ?
                    <div>Espertando Selección</div>
                    :
                    <FormCajeros localidad={localidadSelect} />
                }
                <style jsx="true">{`
                `}</style>
            </div>
        );
    }
}

export default Cajeros;
