
// 참가자 수를 입력받음
const number = Number(prompt('참가자는 몇 명인가요??'));

// DOM 요소 선택
const input = document.querySelector('input'); // 입력창
const button = document.querySelector('button'); // 입력 버튼
const wordEl = document.querySelector('#word'); // 제시어 표시 영역
const orderEl = document.querySelector('#order'); // 참가자 순서 표시 영역

let newWord; // 사용자가 입력한 새 단어
let word;    // 현재 제시어(이전 단어)
let usedWords = []; // 입력된 단어 저장(중복 검사용)

// 입력창에 값이 변경될 때마다 newWord에 저장
const onInput = function (event) {
  newWord = event.target.value;
}

// 버튼 클릭 시 실행되는 함수
const onClickButton = () => {
    // 중복 단어 검사
    if (usedWords.includes(newWord)) {
        alert('중복된 단어입니다!'); // 중복이면 경고
    } else if (!word || word.at(-1) === newWord[0]) {
        // 첫 단어이거나, 이전 단어의 마지막 글자와 새 단어의 첫 글자가 같으면
        word = newWord; // 입력한 단어를 제시어로 저장
        wordEl.textContent = word; // 화면에 제시어 표시
        usedWords.push(newWord); // 중복 리스트에 단어 추가
        const order = Number(orderEl.textContent); // 현재 참가자 번호
        // 참가자 순서 증가 (마지막 참가자면 1로 초기화)
        if(order + 1 > number) {
            orderEl.textContent = 1;
        }
        else {
            orderEl.textContent = order + 1;
        }
    } else {
        alert('틀린 단어입니다!'); // 조건이 맞지 않으면 경고
    }
    input.value = ''; // 입력창 초기화
    input.focus();    // 입력창에 포커스
};

// 이벤트 리스너 등록
input.addEventListener('input', onInput); // 입력창 값 변경 시
button.addEventListener('click', onClickButton); // 버튼 클릭 시