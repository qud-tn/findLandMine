import axios from 'axios';
import { useState } from 'react';
import './App.css';

function Welcome() {
	return (
		<div>
			<h1>지뢰찾기</h1>
		</div>
	);
}

function ChoiceMode({ mode, setMode, onStart }) {

	const handleModeChange = (event) => {
		setMode(event.target.value);
	};

	const handleStart = () => {
		if (mode !== null) {
			axios.post('/game/start', { mode })
				.then((response) => {
					console.log(response.data);
					onStart(response.data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		} else {
			alert("난이도를 선택하세요");
		}
	};

	return (
		<div>
			<input type="radio" id="초급" value="초급" name="mode" onChange={handleModeChange} />초급
			<input type="radio" id="중급" value="중급" name="mode" onChange={handleModeChange} />중급
			<input type="radio" id="고급" value="고급" name="mode" onChange={handleModeChange} />고급
			<br />
			<input type="button" value="시작하기" onClick={handleStart} />
		</div>
	);
}

function ModeCheck({ mode }) {
	const selectedMode = mode;

	return (
		<div>
			{selectedMode !== null && (
				<p>{selectedMode}으로 선택되었습니다.
					지뢰 개수 :
					{selectedMode === "초급" && " 9"}
					{selectedMode === "중급" && " 40"}
					{selectedMode === "고급" && " 99"}
				</p>)}
		</div>
	);
}

function GameBoard({ game, clicked, option, setClicked, optionArray, setOptionArray }) {

	const cellStyle = {
		width: '20px', // 셀 가로 크기
		height: '20px', // 셀 세로 크기
		border: '1px solid black', // 셀 테두리 스타일 (옵션)
	};

	const putOption = (xIndex, yIndex) => {
		const newOptionArray = [...optionArray];
		console.log('옵션', option);
		console.log({ optionArray });
		newOptionArray[xIndex] = newOptionArray[xIndex] || [];
		newOptionArray[xIndex][yIndex] = option;
		setOptionArray(newOptionArray);
	};

	const checkClicked = (xIndex, yIndex) => {
		const newClicked = [...clicked];
		console.log('좌표:', xIndex, yIndex, '클릭 됨');
		console.log({ clicked });
		newClicked[xIndex] = newClicked[xIndex] || [];
		newClicked[xIndex][yIndex] = game[xIndex][yIndex];
		setClicked(newClicked);
	};

	const handleButtonClick = (xIndex, yIndex) => {
		checkClicked(xIndex, yIndex);
		putOption(xIndex, yIndex);
	};

	return (
		<div>
			{game.map((x, xIndex) => (
				<div key={xIndex}>
					<table className='table'>
						<tbody>
							<tr>
								{x.map((y, yIndex) => (
									<td key={yIndex} style={cellStyle}>
										<button
											onClick={() => handleButtonClick(xIndex, yIndex)}
											className={`button-${optionArray[xIndex][yIndex]}`}
										>
											{clicked[xIndex][yIndex]}
										</button>

									</td>

								))}
							</tr>
						</tbody>
					</table>
				</div>
			))}
		</div>
	);
}

function ClickOption({ setOption }) {
	const handleClickOption = (event) => {
		setOption(Number(event.target.value));
	}

	return (
		<div>
			<div className='div-0'><input type="radio" value="0" name="clickOption" onChange={handleClickOption} />일반</div>
			<div className='div-1'><input type="radio" value="1" name="clickOption" onChange={handleClickOption} />확정</div>
			<div className='div-2'><input type="radio" value="2" name="clickOption" onChange={handleClickOption} />의심</div>
			<br />
		</div>
	);
}

function App() {
	const [mode, setMode] = useState(null);
	const [game, setGame] = useState(null);
	const [clicked, setClicked] = useState([]);
	const [option, setOption] = useState(0);
	const [optionArray, setOptionArray] = useState([]);

	const handleGameStart = (game) => {
		setGame(game);

		const initialClicked = Array.from({ length: game.length }, () =>
			Array.from({ length: game[0].length }, () => 0));
		setClicked(initialClicked);

		const initialOptionArray = Array.from({ length: game.length }, () =>
			Array.from({ length: game[0].length }, () => 3));
		setOptionArray(initialOptionArray);
	};

	const checkClicked = (xIndex, yIndex) => {
		const newClicked = [...clicked];
		console.log('좌표:', xIndex, yIndex, '클릭 됨');
		console.log({ clicked });
		newClicked[xIndex] = newClicked[xIndex] || [];
		newClicked[xIndex][yIndex] = game[xIndex][yIndex];
		setClicked(newClicked);
	};

	return (
		<div className="App">
			<Welcome />
			<ChoiceMode mode={mode} setMode={setMode} onStart={handleGameStart} />
			<ModeCheck mode={mode} />
			{game && <GameBoard game={game} checkClicked={checkClicked} clicked={clicked} optionArray={optionArray} setOptionArray={setOptionArray} option={option} setClicked={setClicked} />}
			{game && <ClickOption setOption={setOption} />}
		</div>
	);
}

export default App;
