import { Component, createRef } from 'react';
import './ProblemSelector.scss';

const problems = [
	'Addiction',
	'Anxiety',
	'Depression',
	'Relationships',
	'Family',
	'Loss',
];

class ProblemSelector extends Component {
	constructor() {
		super();

		this.state = {};
		this.problemSelectorRef = createRef();
	}

	selectProblem(problem) {
		const { onSelect } = this.props;

		if (onSelect) onSelect(problem);

		this.setState({ selectedProblem: problem });

		this.problemSelectorRef.current.style.transform = 'scaleY(0%)';
		this.problemSelectorRef.current.style.height = '0px';
	}

	render() {
		return (
			<div className='problem-selector' ref={this.problemSelectorRef}>
				<span>What's on your mind?</span>
				<div className='problems'>
					{problems.map((problem, index) => {
						return (
							<div
								className='problem'
								onClick={this.selectProblem.bind(this, problem)}
								key={index}>
								{problem}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default ProblemSelector;
