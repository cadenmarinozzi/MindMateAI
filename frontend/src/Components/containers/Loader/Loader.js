import './Loader.scss';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Loader({ relative }) {
	return (
		<div className={`${relative ? 'loader-relative' : 'loader'}`}>
			{/* <FontAwesomeIcon icon={faSpinner} spin size='2xl' /> */}
		</div>
	);
}

export default Loader;
