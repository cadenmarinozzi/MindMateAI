import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
	return (
		<div className='footer'>
			<span>@MindMateAI 2023</span>
			<Link to='/terms-of-use'>Terms of Use</Link>
			<Link to='/privacy-policy'>Privacy Policy</Link>
		</div>
	);
}

export default Footer;
