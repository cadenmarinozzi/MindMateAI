import Footer from 'Components/containers/Footer';
import Navbar from 'Components/containers/Navbar';
import Home from 'Components/pages/Home';
import SignUp from 'Components/pages/User/SignUp';
import InformationSecurity from 'Components/pages/InformationSecurity';
import Login from 'Components/pages/User/Login';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import web from 'modules/web/web';
import cookies from 'modules/cookies';
import UserHome from 'Components/pages/User/UserHome';
import UserSettings from 'Components/pages/User/UserSettings';
import UserEdit from 'Components/pages/User/UserSettings/UserEdit';
import './App.scss';
import TermsOfUse from 'Components/pages/TermsOfUse/TermsOfUse';
import PrivacyPolicy from 'Components/pages/PrivacyPolicy/PrivacyPolicy';

class App extends Component {
	constructor() {
		super();

		this.state = {};
	}

	async login() {
		const email = cookies.get('email');
		const password = cookies.get('password');

		if (!email || !password) {
			this.setState({ loggedIn: false, loaded: true });

			return;
		}

		const user = await web.login({
			email,
			password,
		});

		this.setState({ loggedIn: user, loaded: true });
	}

	componentDidMount() {
		this.login();
	}

	render() {
		const { loggedIn, loaded } = this.state;

		return (
			loaded && (
				<HashRouter>
					<Navbar loggedIn={loggedIn} />
					<Routes>
						<Route path='/terms-of-use' element={<TermsOfUse />} />
						<Route
							path='/privacy-policy'
							element={<PrivacyPolicy />}
						/>
						{loggedIn ? (
							<>
								<Route
									path='*'
									element={<Home loggedIn={loggedIn} />}
								/>
								<Route
									path='/user'
									element={<UserSettings />}
								/>
								<Route
									path='/information-security'
									element={<InformationSecurity />}
								/>
								<Route
									path='/user-home'
									element={<UserHome />}
								/>
								<Route
									path='/user-edit'
									element={<UserEdit />}
								/>
							</>
						) : (
							<>
								<Route
									path='*'
									element={<Home loggedIn={loggedIn} />}
								/>
								<Route path='/login' element={<Login />} />
								<Route path='/sign-up' element={<SignUp />} />
								<Route
									path='/information-security'
									element={<InformationSecurity />}
								/>
							</>
						)}
					</Routes>
					<Footer />
				</HashRouter>
			)
		);
	}
}

export default App;
