// 단어 기록 리스트에 추가하는 함수
function addRecord(prev, next) {
    const recordList = document.getElementById('record-list');
    const box = document.createElement('div');
    box.className = 'record-box';
    box.textContent = prev ? `${prev} → ${next}` : next;
    recordList.appendChild(box);
    // 마지막 박스가 항상 가운데 오도록 스크롤 조정
    setTimeout(() => {
        const area = document.querySelector('.record-area');
        const recordList = document.getElementById('record-list');
        const boxes = recordList.querySelectorAll('.record-box');
        const lastBox = boxes[boxes.length - 1];
        if (!lastBox) return;
        const areaWidth = area.offsetWidth;
        const boxLeft = lastBox.offsetLeft;
        const boxWidth = lastBox.offsetWidth;
        let scrollTo = boxLeft - areaWidth / 2 + boxWidth / 2;
        // 스크롤 최대치 제한 (양쪽 끝까지 스크롤 가능)
        scrollTo = Math.max(0, Math.min(scrollTo, area.scrollWidth - areaWidth));
        area.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }, 10);
}


// 참가자 수 입력
const number = Number(prompt('참가자는 몇 명인가요??'));

// 참가자 이름 입력 및 배열 생성
let players = [];
for (let i = 1; i <= number; i++) {
    const name = prompt(`${i}번째 참가자 이름을 입력하세요`);
    players.push({ name, eliminated: false });
}

// DOM 요소 선택
const input = document.querySelector('input'); // 입력창
const button = document.querySelector('button'); // 입력 버튼
const wordEl = document.querySelector('#word'); // 제시어 표시 영역
const orderEl = document.querySelector('#order'); // 참가자 순서 표시 영역

// 제시어란 초기값
wordEl.textContent = '제시어 입력';

let newWord; // 사용자가 입력한 새 단어
let word;    // 현재 제시어(이전 단어)
let usedWords = []; // 입력된 단어 저장(중복 검사용)
let currentIdx = 0; // 현재 차례의 인덱스

// 플레이어 카드 렌더링 함수
function renderPlayerCards() {
    const playerListEl = document.getElementById('player-list');
    playerListEl.innerHTML = '';
    players.forEach((player, idx) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        if (player.eliminated) card.classList.add('eliminated');
        if (idx === currentIdx && !player.eliminated) card.classList.add('active');
        // 탈락 여부에 따라 아바타 이모지 변경
        const avatar = document.createElement('div');
        avatar.className = 'player-avatar';
        avatar.textContent = player.eliminated ? '😢' : '😀';
        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = player.name;
        card.appendChild(avatar);
        card.appendChild(name);
        playerListEl.appendChild(card);
    });
}

// 현재 참가자 이름 표시 함수
function updatePlayerDisplay() {
    // 탈락하지 않은 첫 번째 참가자 찾기
    while (players[currentIdx] && players[currentIdx].eliminated) {
        currentIdx = (currentIdx + 1) % players.length;
    }
    renderPlayerCards();
}

// 입력창에 값이 변경될 때마다 newWord에 저장
const onInput = function (event) {
  newWord = event.target.value;
}

// 우승자 체크 함수
function checkWinner() {
    const alive = players.filter(p => !p.eliminated);
    if (alive.length === 1) {
        // winner.html로 이동, 우승자 이름 전달
        location.href = `winner.html?winner=${encodeURIComponent(alive[0].name)}`;
        return true;
    }
    return false;
}

// 다음 참가자 차례로 이동
function nextPlayer() {
    const alive = players.filter(p => !p.eliminated);
    if (alive.length === 0) return; // 모든 플레이어 탈락 시 종료
    let tries = 0;
    do {
        currentIdx = (currentIdx + 1) % players.length;
        tries++;
        if (tries > players.length) break; // 무한 루프 방지
    } while (players[currentIdx].eliminated && players.some(p => !p.eliminated));
    updatePlayerDisplay();
}

// 버튼 클릭 시 실행되는 함수
const onClickButton = () => {
    // 이미 우승자가 결정되었으면 동작 중지
    if (checkWinner()) return;

    // 중복 단어 검사
    if (usedWords.includes(newWord)) {
        // 중복 메시지 1초간 빨간 글씨로 표시 후 복구
        wordEl.textContent = '중복된 단어입니다';
        wordEl.classList.add('word-wrong');
        setTimeout(() => {
            wordEl.classList.remove('word-wrong');
            wordEl.textContent = word ? word.at(-1) : '제시어 입력';
        }, 1000);
        players[currentIdx].eliminated = true;
        if (!checkWinner()) nextPlayer();
    } else if (!word || word.at(-1) === newWord[0]) {
        // 첫 단어이거나, 이전 단어의 마지막 글자와 새 단어의 첫 글자가 같으면
        addRecord(word, newWord); // 기록 추가
        word = newWord;
        wordEl.textContent = word;
        usedWords.push(newWord);
        // 1초 후 끝 글자만 표시, 순서 변경
        setTimeout(() => {
            wordEl.textContent = word.at(-1);
            nextPlayer();
        }, 1000);
    } else {
        // 끝말이 맞지 않을 때 원인 메시지 1초간 빨간 글씨로 표시 후 복구
        wordEl.textContent = '끝말이 맞지 않습니다';
        wordEl.classList.add('word-wrong');
        setTimeout(() => {
            wordEl.classList.remove('word-wrong');
            wordEl.textContent = word ? word.at(-1) : '제시어 입력';
        }, 1000);
        players[currentIdx].eliminated = true;
        if (!checkWinner()) nextPlayer();
    }
    input.value = '';
    input.focus();
};

// 이벤트 리스너 등록
input.addEventListener('input', onInput);
button.addEventListener('click', onClickButton);
// 엔터 키로도 입력 가능하게
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        button.click();
    }
});

// 게임 시작 시 첫 참가자 카드 표시
renderPlayerCards();