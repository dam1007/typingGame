const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');
const GAME_TIME = 10;

let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

//사용하는 변수들을 화면이 렌더링 됐을 때 바로 선언되게 하기
init();

function init(){
    buttonChange('Loading...');
    getWords();
    wordInput.addEventListener('input', checkMatch);
}

// 게임 실행
function run(){
    //게임 실행 중엔 버튼 클릭 안 되게
    if (isPlaying) {
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    //게임 시작 시 input에 focus
    wordInput.focus();
    //점수 초기화
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    //계속 상태 체크
    checkInterval = setInterval(checkStatus, 50);
    //버튼 체인지
    buttonChange('Playing...');
}


//작동하는지 실시간으로 상태 확인
function checkStatus(){
    if(!isPlaying && time === 0) {
        buttonChange('Play');
        clearInterval(checkInterval);
    }
}

//단어 불러오기 - wordDisplay
function getWords(){
    //배열 만들기
    axios.get('https://random-word-api.herokuapp.com/word?number=100')
    .then(function (response) {
        // handle success
        //console.log(response.data);
        //words = response.data;

        //긴 단어 제외
        response.data.forEach(word => {
            if(word.length < 11){
                words.push(word);
            }
        });
        //console.log(words);
        buttonChange('Play');
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })

    //words = ['Hello', 'Banana', 'Apple', 'Cherry'];
    //getWords() 실행되면 게임시작
    //buttonChange('게임시작');
}


//단어일치 체크
//input에 글자 입력 시 값 받아오기 - input 이벤트 사용
function checkMatch(){
    if(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        //입력창 초기화
        wordInput.value = '';

        //게임 중이 아닐 때 입력하면 점수 올려주지 않고 return 시키고 값은 초기화
        if(!isPlaying) {
            return;
        }
        score++;
        scoreDisplay.innerText = score;
        time = GAME_TIME;

        //랜덤으로 단어 보이게
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}
/* wordInput.addEventListener('input', () => {
    //console.log(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase());

    //글자 입력 시 wordDisplay의 값과 일치하면 점수 1씩 올리기
    if(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        score++;
        scoreDisplay.innerText = score;
        //입력창 초기화
        wordInput.value = '';
    }
}); */

//countDown()을 1초마다 실행시켜주는 interVal 만들기
//setInterval(countDown, 1000);

//게임시작 버튼 클릭 시 초 세기
function countDown(){
    //시간이 0보다 크면 감소, 0이면 게임 정지
    time > 0 ? time-- : isPlaying = false;
    if(!isPlaying) {
        clearInterval(timeInterval);
    }
    timeDisplay.innerText = time; //시간 출력
}

/* buttonChange('게임시작'); */

//시작 버튼 - 안에 글씨가 '게임시작'이면 loading 클래스 지우기(버튼 활성화)
function buttonChange(text){
    button.innerText = text;
    text === 'Play' ? button.classList.remove('loading') : button.classList.add('loading');
}



