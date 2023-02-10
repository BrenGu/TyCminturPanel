import React, { Component } from "react";
import { Consumer } from "./context";
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Menu from "./components/layout/Menu";
import ToTop from "./components/utiles/ToTop";
import Zonas from "./components/paginas/Zonas";
import Localidades from "./components/paginas/Localidades";
import Atractivos from "./components/paginas/Atractivos";
import PanelAdmin from "./components/paginas/PanelAdmin";
import Aeropuertos from "./components/paginas/Aeropuertos";
import AlquilerAutos from "./components/paginas/AlquilerAutos";
import Tirolesas from "./components/paginas/Tirolesas";
import Cajeros from "./components/paginas/Cajeros";
import Oficinas from "./components/paginas/Oficinas";
import Novedades from "./components/paginas/Novedades";
import Eventos from "./components/paginas/Eventos";
import Login from "./components/paginas/Login";
import GuiasTurismo from "./components/paginas/GuiasdeTurismo";
import Estadisticas from "./components/paginas/Estadisticas";
import Gastronomia from "./components/paginas/Gastronomia";
import CarruselHome from "./components/paginas/CarruselHome";
import GaleriaHome from "./components/paginas/GaleriaHome";
import AgenciaViajes from "./components/paginas/AgenciaViajes"
import FormAgenciasViajes from "./components/paginas/comguiasturisticos/FormAgenciasViajes"
import Censistas from "./components/paginas/Censistas";
import Arboles from "./components/paginas/Arboles";
import GaleriaLocalidad from "./components/paginas/GaleriaLocalidad"
import Terminales from "./components/paginas/Terminales";
import Estacionamiento from "./components/paginas/Estacionamiento";
import Vehiculos from "./components/paginas/Vehiculos";

//<Router basename={`/${process.env.REACT_APP_BASENAME}`} history={Router.hashHistory}>

const NoFound = () => {
	return(<div>
		<p><h1>Error 404</h1></p>
		<p>Página no encontrada</p>
	</div>);
}

class App extends Component {
	constructor(props) {
        super(props);
        this.state = {
			loading: true,
			authorized: false,
			permiso: 1
		};
		this.okLogin = this.okLogin.bind(this);
	}

	okLogin() {
		this.setState({
			authorized: true,
			permiso: localStorage.getItem("WebTurPermiso").valueOf()
		});
	}

	handleLogAuth = () => {
		this.setState({authorized: false});
	}

	componentDidMount() {
		if("WebTurToken" in localStorage) {
			if(localStorage.getItem("WebTurToken").length > 0) {
				this.setState({authorized: true}, () => {
					if("WebTurPermiso" in localStorage) {
						if(localStorage.getItem("WebTurPermiso").length > 0) {
							this.setState({
								permiso: localStorage.getItem("WebTurPermiso").valueOf()
							});
						}
					}
				});
			}
		}
	}

	render() {
		const authorized = this.state.authorized;
		const permiso = this.state.permiso;

		return (
			<React.Fragment>
				{
					authorized ?
					<Router history={Router.hashHistory}>
						<React.Fragment>
							<Navbar />
							<Menu logout={this.handleLogAuth} permiso={permiso}/>
							<div className="container">
								<div className="row">
									<div className="col">
										{
											permiso == 1 ? (
												<Switch>
													<Route exact path="/" component={Zonas} />
													<Route path="/localidades" component={Localidades} />
													<Route path="/censistas" component={Censistas} />
													<Route path="/arboles" component={Arboles} />
													<Route path="/galerialocalidad" component={GaleriaLocalidad} />
													<Route path="/atractivos" component={Atractivos} />
													<Route path="/gastronomia" component={Gastronomia} />
													<Route path="/paneladmin" component={PanelAdmin} />
													<Route path="/oficinas" component={Oficinas} />
													<Route path="/terminales" component={Terminales} />
													<Route path="/estadisticas" component={Estadisticas} />
													<Route path="/prensa" component={Novedades} />
													<Route path="/eventos" component={Eventos} />
													<Route path="/guiasturismo"component={GuiasTurismo} />
													<Route path="/aeropuertos"component={Aeropuertos} />
													<Route path="/alquilerautos"component={AlquilerAutos} />
													<Route path="/tirolesas"component={Tirolesas} />
													<Route path="/cajeros" component={Cajeros}/>
													<Route path="/estacionamiento" component={Estacionamiento}/>
													<Route path="/vehiculos" component={Vehiculos}/>
													<Route path="/carruselhome"component={CarruselHome} />
													<Route path="/galeriahome" component={GaleriaHome}/>
													<Route path="/agencias-viajes"component={AgenciaViajes} />
													<Route path="/form-agencia-viajes"component={FormAgenciasViajes} />
													<Route component={NoFound} />
												</Switch>	
											): permiso == 2 ? (
												<Switch>
													<Route exact path="/" component={Eventos} />
													<Route component={NoFound} />
												</Switch>	
											) : (
												<Switch>
													<Route exact path="/" component={GuiasTurismo} />
													<Route component={NoFound} />
												</Switch>	
											)
										}
										
									</div>
								</div>
							</div>
							<ToTop showAt={400} />
						</React.Fragment>
					</Router>
					:
					<Login okLogin={this.okLogin} />
				}
			</React.Fragment>
		);
	}
}

App.contextType = Consumer;

export default App;
