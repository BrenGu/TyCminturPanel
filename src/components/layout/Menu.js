import { CompositeDecorator } from "draft-js";
import React, { Component } from "react";
import { Link } from "react-router-dom";


class Menu extends Component {
    constructor(props) {
        super(props);
        this.handleLogOut = this.handleLogOut.bind(this);
	}

    handleLogOut = () => {
		localStorage.clear();
		this.props.logout();
		//window.location.replace(`${process.env.REACT_APP_URL_HOST}/${process.env.REACT_APP_BASENAME}`);
    }

    render(){
        return (
            <div className="">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <ul className="d-flex flex-direction-row justify-content-center h-menu">
                                <li><Link to="/carruselhome">Carrusel Home</Link></li>
                                <li><Link to="/">Zonas</Link></li>
                                <li className="nav-item dropdown">
                                    <button className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Localidades</button>
                                    <div className="dropdown-menu">
                                        <Link className="dropdown-item" to="/localidades">Registros</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/atractivos">Atractivos</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/gastronomia">Gastronomía</Link>
                                    </div>
                                </li>
                                <li><Link to="/novedades">Novedades</Link></li>
                                <li><Link to="/eventos">Eventos</Link></li>
                                <li className="nav-item dropdown">
                                    <button className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Extras</button>
                                    <div className="dropdown-menu">
                                        <Link className="dropdown-item" to="/oficinas">Oficinas de Turísmo</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/guiasturismo">Guías de Turismo</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/agencias-viajes">Agencias de Viaje</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/aeropuertos">Aeropuertos</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/alquilerautos">Alquiler de autos</Link>
                                        <div className="dropdown-divider"></div>
                                        <Link className="dropdown-item" to="/casacambio">Casas de cambio</Link>
                                        {/*<a className="dropdown-item" href={`${process.env.REACT_APP_API_HOST}/exportmails`}>Exportar Mails</a>
                                        <div className="dropdown-divider"></div>
        <a className="dropdown-item" href={`${process.env.REACT_APP_API_HOST}/exportguias`}>Exportar Alojamientos</a>*/}
                                    </div>
                                </li>
                                <li>{
                                  <a href="" onClick={this.handleLogOut}>Cerrar sesión</a>
                                }
                                </li>
                                {/*
                                <li><a href="#">Alojamientos</a></li>
                                <li><a href="#">Gastronomía</a></li>
                                <li><a href="#">Notas</a></li>
                                <li className="nav-item dropdown">
                                    <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Servicios</a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#">Agencias de Viaje</a>
                                        <a className="dropdown-item" href="#">Guías de Turismo</a>
                                        <a className="dropdown-item" href="#">Turismo Estudiantíl</a>
                                        <a className="dropdown-item" href="#">Oficinas de Informes</a>
                                        <a className="dropdown-item" href="#">Terminales de Omnibus</a>
                                        <a className="dropdown-item" href="#">Horarios de Colectivos</a>
                                        <a className="dropdown-item" href="#">Cajeros Automáticos</a>
                                        <a className="dropdown-item" href="#">Estaciones de GNC</a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="#">Separated link</a>
                                    </div>
                                </li>
                                */}
                            </ul>
                            <style jsx="true">{`
                                .dropdown-toggle {
                                    cursor: pointer;
                                }
                                .h-menu {
                                    list-style-type: none;
                                    padding-left: 0px;
                                }
    
                                .h-menu > li {
                                    display: inline-block;
                                    position: relative;
                                    padding-bottom: 3px;
                                    margin-right: 20px;
                                }
    
                                .h-menu > li:last-child {
                                    margin-right: 0;
                                }
    
                                .h-menu > li:after {
                                    content: '';
                                    display: block;
                                    margin: auto;
                                    height: 3px;
                                    width: 0px;
                                    background: transparent;
                                    transition: width .5s ease, background-color .5s ease;
                                }
    
                                .h-menu > li:hover:after {
                                    width: 100%;
                                    background: #007bff;
                                }
    
                                .h-menu > li > a {
                                    display: block;
                                    line-height: 50px;
                                    text-align: center;
                                    text-decoration: none;
                                    color: #343a40;
                                    font-size: 1.2rem;
                                }
    
                                .h-menu > li > button {
                                    background: none;
                                    color: inherit;
                                    border: none;
                                    padding: 0;
                                    font: inherit;
                                    cursor: pointer;
                                    outline: inherit;
                                    display: block;
                                    line-height: 50px;
                                    text-align: center;
                                    text-decoration: none;
                                    color: #343a40;
                                    font-size: 1.2rem;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            </div>
        );
    }   
    
}

export default Menu;
