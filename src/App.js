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
import nuevousuario from "./components/paginas/nuevousuario";
import Aeropuertos from "./components/paginas/Aeropuertos";
import AlquilerAutos from "./components/paginas/AlquilerAutos";
import CasaCambio from "./components/paginas/CasaCambio";
import Oficinas from "./components/paginas/Oficinas";
import Novedades from "./components/paginas/Novedades";
import Eventos from "./components/paginas/Eventos";
import Login from "./components/paginas/Login";
import GuiasTurismo from "./components/paginas/GuiasdeTurismo";
import Estadisticas from "./components/paginas/Estadisticas";
import Gastronomia from "./components/paginas/Gastronomia";
import CarruselHome from "./components/paginas/CarruselHome";
import AgenciaViajes from "./components/paginas/AgenciaViajes"
import FormAgenciasViajes from "./components/paginas/comguiasturisticos/FormAgenciasViajes"


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
			authorized: false
		};
		this.okLogin = this.okLogin.bind(this);
	}

	okLogin() {
		this.setState({
			authorized: true
		});
	}

	handleLogAuth = () => {
		this.setState({authorized: false});
	}

	componentDidMount() {
		if("WebTurToken" in localStorage) {
			if(localStorage.getItem("WebTurToken").length > 0) {
				this.setState({authorized: true});
			}
		}
	}

	render() {
		const authorized = this.state.authorized;
		return (
			<React.Fragment>
				{
					authorized ?
					<Router history={Router.hashHistory}>
						<React.Fragment>
							<Navbar />
							<Menu logout={this.handleLogAuth}/>
							<div className="container">
								<div className="row">
									<div className="col">
										<Switch>
											<Route exact path="/" component={Zonas} />
											<Route path="/localidades" component={Localidades} />
											<Route path="/atractivos" component={Atractivos} />
											<Route path="/gastronomia" component={Gastronomia} />
											<Route path="/nuevousuario" component={nuevousuario} />
											<Route path="/oficinas" component={Oficinas} />
											<Route path="/estadisticas" component={Estadisticas} />
											<Route path="/novedades" component={Novedades} />
											<Route path="/eventos" component={Eventos} />
											<Route path="/guiasturismo"component={GuiasTurismo} />
											<Route path="/aeropuertos"component={Aeropuertos} />
											<Route path="/alquilerautos"component={AlquilerAutos} />
											<Route path="/casacambio"component={CasaCambio} />
											<Route path="/carruselhome"component={CarruselHome} />
											<Route path="/agencias-viajes"component={AgenciaViajes} />
											<Route path="/form-agencia-viajes"component={FormAgenciasViajes} />
											<Route component={NoFound} />
										</Switch>
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
