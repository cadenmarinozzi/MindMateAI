import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Button.scss';

function Button({
	label,
	icon,
	iconRight,
	round,
	cta,
	big,
	bigText,
	className,
	danger,
	hoverArrow,
	...rest
}) {
	return (
		<button
			className={`button ${bigText && 'button-big-text'} ${
				round && 'button-round'
			} ${(icon || iconRight || hoverArrow) && 'button-icon'} ${
				big && 'button-big'
			} ${
				cta ? 'button-cta' : danger ? 'button-danger' : 'button-default'
			} ${className}`}
			{...rest}>
			{icon && <FontAwesomeIcon icon={icon} />}
			<span>{label}</span>
			{iconRight && <FontAwesomeIcon icon={iconRight} />}
			{hoverArrow && (
				<svg
					className='hover-arrow'
					width='20'
					height='15'
					viewBox='0 0 10 10'>
					<g fillRule='evenodd'>
						<path className='hover-arrow__line-path' d='M0 5h7' />
						<path
							className='hover-arrow__tip-path'
							d='M1 1l4 4-4 4'
						/>
					</g>
				</svg>
			)}
		</button>
	);
}

export default Button;
