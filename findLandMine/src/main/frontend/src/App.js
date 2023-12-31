import axios from 'axios';
import { useState, useEffect } from 'react';
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
			axios.post(`/game/start?mode=${mode}`, { mode })
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
	return (
		<div>
			{mode !== null && (
				<p>{mode}으로 선택되었습니다.
					지뢰 개수 :
					{mode === "초급" && " 10"}
					{mode === "중급" && " 40"}
					{mode === "고급" && " 99"}
				</p>)}
		</div>
	);
}

function GameBoard({ clicked, setClicked, game, optionArray, setOptionArray, setOption, option, visited, setVisited }) {


	const cellStyle = {
		width: '20px',
		height: '20px',
		border: '1px solid black',
	};

	const putOption = (xIndex, yIndex) => {
		const newOptionArray = [...optionArray];
		//		console.log('옵션', option);
		//		console.log({ optionArray });
		newOptionArray[xIndex] = newOptionArray[xIndex] || [];
		newOptionArray[xIndex][yIndex] = option;
		setOptionArray(newOptionArray);
	};

	const checkClicked = (xIndex, yIndex) => {
		const newClicked = [...clicked];
		//		console.log('좌표:', xIndex, yIndex, '클릭 됨');
		//		console.log({ clicked });
		newClicked[xIndex] = newClicked[xIndex] || [];
		newClicked[xIndex][yIndex] = game[xIndex][yIndex];
		setClicked(newClicked);
	};

	const turnVisited = (xIndex, yIndex) => {
		const newVisited = [...visited];
		//		console.log('좌표:', xIndex, yIndex, '클릭 됨');
		//		console.log({ clicked });
		newVisited[xIndex] = newVisited[xIndex] || [];
		newVisited[xIndex][yIndex] = true;
		setVisited(newVisited);
	};

	const handleButtonClick = (xIndex, yIndex) => {
		checkClicked(xIndex, yIndex);
		putOption(xIndex, yIndex);

		if (option === 1 || (option === 3 && game[xIndex][yIndex] === '◆')) {
			turnVisited(xIndex, yIndex);
		}
		//		console.log(visited);
	};

	const handleGamePlay = (xIndex, yIndex) => {
		const checkRange = (x, y) => x >= 0 && x < game.length && y >= 0 && y < game[0].length;

		const isMine = (x, y) => game[x][y] === '◆';

		if (isMine(xIndex, yIndex) && option === 1) {
			alert("지뢰를 밟았습니다! 게임오버");

			setOption(4);

			for (let i = 0; i < game.length; i++) {
				for (let j = 0; j < game[0].length; j++) {
					checkClicked(i, j);
				}
			}
		}

		const chainExplosion = (x, y, visited) => {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					const newX = x + i;
					const newY = y + j;

					if (i === 0 && j === 0) continue;

					if (checkRange(newX, newY) && game[newX][newY] === 0) {
						if (!visited[newX][newY]) {
							handleButtonClick(newX, newY);

							chainExplosion(newX, newY, visited);
						}
					} else if (checkRange(newX, newY)) {
						handleButtonClick(newX, newY);
					}
				}
			}
		};

		if (visited.every(row => row.every(cell => cell === true))) {
			alert("축하합니다! 게임을 클리어 하셨습니다.");
			setOption(5);
		}

		if (checkRange(xIndex, yIndex) && game[xIndex][yIndex] === 0 && option === 1) {

			handleButtonClick(xIndex, yIndex);

			chainExplosion(xIndex, yIndex, visited);

		} else if (checkRange(xIndex, yIndex)) {
			handleButtonClick(xIndex, yIndex);
		}

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
											onClick={() => handleGamePlay(xIndex, yIndex)}
											className={`button-${optionArray[xIndex][yIndex]}`}
											disabled={option === 4 || option === 5}
										>
											{optionArray[xIndex][yIndex] === 3 ? '√'
												: optionArray[xIndex][yIndex] === 2 ? '?'
													: clicked[xIndex][yIndex] !== -1 && optionArray[xIndex][yIndex] !== 2 && clicked[xIndex][yIndex]}
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
	};

	return (
		<div>
			<div className='div-1'><input type="radio" value="1" name="clickOption" onChange={handleClickOption} />일반</div>
			<div className='div-2'><input type="radio" value="2" name="clickOption" onChange={handleClickOption} />의심</div>
			<div className='div-3'><input type="radio" value="3" name="clickOption" onChange={handleClickOption} />확신</div>
			<br />
		</div>
	);
}

function Timer({ option, count, setCount }) {
	useEffect(() => {
		let timer;

		if (option !== 4 && option !== 5) {
			timer = setInterval(() => {
				setCount((prevCount) => prevCount + 1);
			}, 10); // 0.01초 단위로 증가
		}
		return () => clearInterval(timer);
	}, [option, setCount]);

	const formatTime = (time) => {
		const minutes = Math.floor(time / 6000); // 1분 = 6000밀리초
		const seconds = ((time % 6000) / 100).toFixed(2); // 초, 소수점 두 자리까지

		return `${String(minutes).padStart(2, '0')}분${String(seconds).padStart(5, '0')}초`;
	};

	return (
		<div>
			<h2>경과 시간: {formatTime(count)}</h2>
		</div>
	);
}

function Save({ game, mode, count }) {
	const [id, setId] = useState('');

	const changeId = (event) => {
		setId(event.target.value);
	};

	const handleSave = () => {
		if (mode !== null) {
			axios.post(`/game/id/${id}?game=${game}&mode=${mode}&count=${count}`, { game, mode, count, id })
				.then((response) => {
					console.log(response.data);

					const storedRank = localStorage.getItem('rank');
					let existingRank = storedRank ? JSON.parse(storedRank) : null;

					const thisRank = response.data;

					if (existingRank) {
						//						console.log(existingRank.count);
						//						console.log(thisRank.count);
						console.log(existingRank.count - thisRank.count);
						if (parseInt(existingRank.count) > parseInt(thisRank.count)) {
							existingRank = { ...thisRank };
							//							console.log(localStorage);
						}
					} else {
						existingRank = { ...thisRank };
					}

					const modifiedRank = JSON.stringify(existingRank);

					localStorage.setItem('rank', modifiedRank);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
	};

	return (
		<div>
			<input type="text" onChange={changeId} placeholder='이름을 입력하세요' />
			<input type="button" value="저장하기" onClick={handleSave} />
			<p style={{ fontWeight: 'bold' }}>서버에 데이터를 직접 저장하지 않습니다. 로컬에만 저장됩니다</p>
		</div>
	);
}

function Top1(mode) {
	const rank = localStorage.length !== 0 ? JSON.parse(localStorage.getItem('rank')) : [];
	const rankArray = [rank];
	const filteredRankArray = rankArray.filter((idx) => idx.mode === mode.mode);
	//		console.log(mode.mode);
	//		console.log(localStorage);
	//		console.log(rankArray[0].mode);

	const formatTime = (time) => {
		const minutes = Math.floor(time / 6000); // 1분 = 6000밀리초
		const seconds = ((time % 6000) / 100).toFixed(2); // 초, 소수점 두 자리까지

		return `${String(minutes).padStart(2, '0')}분${String(seconds).padStart(5, '0')}초`;
	};

	return (
		<div>
			{filteredRankArray.length > 0 && <table className='table'>
				<tbody>
					<tr>
						<td colSpan="2">
							최고기록
						</td>
					</tr>
					<tr>
						<td>
							이름
						</td>
						<td>
							소요 시간
						</td>
					</tr>
					{filteredRankArray.map((i, Index) => (
						<tr key={Index}>
							<td>
								{i.id}
							</td>
							<td>
								{formatTime(i.count)}
							</td>
						</tr>
					))}
				</tbody>
			</table>}
		</div>
	);
}

function App() {
	const [mode, setMode] = useState(null);
	const [game, setGame] = useState(null);
	const [clicked, setClicked] = useState([]);
	const [optionArray, setOptionArray] = useState([]);
	const [option, setOption] = useState(1);
	const [count, setCount] = useState(0);
	const [visited, setVisited] = useState([]);

	const handleGameStart = (data) => {
		setGame(data);

		const initialClicked = Array.from({ length: data.length }, () =>
			Array.from({ length: data[0].length }, () => '#'));
		setClicked(initialClicked);

		const initialOptionArray = Array.from({ length: data.length }, () =>
			Array.from({ length: data[0].length }, () => 0));
		setOptionArray(initialOptionArray);

		setOption(1);
		setCount(0);

		const initialVisited = Array.from({ length: data.length }, () =>
			Array.from({ length: data[0].length }, () => false));
		setVisited(initialVisited);
	};


	return (
		<div className="App">
			<Welcome />
			<ChoiceMode mode={mode} setMode={setMode} onStart={handleGameStart} />
			{mode && <ModeCheck mode={mode} />}
			{game && <GameBoard clicked={clicked} setClicked={setClicked} game={game} optionArray={optionArray} setOptionArray={setOptionArray} setOption={setOption} option={option} visited={visited} setVisited={setVisited} />}
			{game && <ClickOption setOption={setOption} />}
			{game && <Timer option={option} count={count} setCount={setCount} />}
			{option === 5 && <Save game={game} mode={mode} count={count} />}
			{mode && <Top1 mode={mode} />}
		</div>
	);
}

export default App;
