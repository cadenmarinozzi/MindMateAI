import { Component } from 'react';
import utils from 'modules/utils';
import './Input.scss';

class Input extends Component {
	constructor({ value }) {
		super();

		this.state = {
			value,
		};
	}

	handleChange(e) {
		const { onChange, type, label, required } = this.props;
		const value = e.target.value;

		this.setState({
			error: value ? null : required && `${label} is required!`,
			value,
		});

		if (onChange) {
			onChange(value);
		}

		if (type === 'password') {
			this.handlePasswordStrength(value);
		}
	}

	handlePasswordStrength(value) {
		const passwordStrength = utils.calculatePasswordStrength(value);

		this.setState({ passwordStrength });
	}

	render() {
		const {
			label,
			icon,
			className,
			required,
			type,
			hideStrengthMeter,
			...rest
		} = this.props;
		const { passwordStrength, value, error } = this.state;

		const isPassword = type === 'password';

		return (
			<>
				<div className={`input-container ${error && 'input-error'}`}>
					<label className={`label ${!value && 'label-empty'}`}>
						{label}
						{required && <span className='required'> *</span>}
						<div className='line-container'>
							<div className='line'></div>
						</div>
					</label>
					<input
						className={`input ${className}`}
						type={type}
						{...rest}
						onChange={this.handleChange.bind(this)}
					/>
					{isPassword && !hideStrengthMeter && value && (
						<div
							className={`password-meter meter-${passwordStrength}`}>
							{passwordStrength}
						</div>
					)}
				</div>
				{isPassword && !hideStrengthMeter && value && (
					<div className='password-strength'>
						<div
							className={`password-strength-bar password-${passwordStrength}`}
						/>
					</div>
				)}
			</>
		);
	}
}

export default Input;
