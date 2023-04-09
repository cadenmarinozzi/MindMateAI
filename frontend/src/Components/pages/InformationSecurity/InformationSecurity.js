import './InformationSecurity.scss';

function InformationSecurity() {
	return (
		<div className='information-security'>
			<h1>Information Security</h1>
			<h3>Password Security</h3>
			<span>
				Your passwords are secured using salt-hash encryption. All
				passwords are stored in the database using the SCRYPT hash
				function, along with a salt used to hash the password. This
				means that in the case of a data breach, passwords are secured.
			</span>
			<h3>Database Rules</h3>
			<span>
				The database is secured using a restrictive rule system that
				disallows certain user actions, such as deleting other users'
				data. This allows us to ensure that your data is secure.
			</span>
		</div>
	);
}

export default InformationSecurity;
