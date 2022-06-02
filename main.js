// 원리는 li를 들어서 옮겼을때 li 인덱스과 data-index의 숫자를 비교해서 모두가 일치할때 게임을 종료시킨다.

const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;

let tiles = [];
const dragged = {
  el: null,
  class: null,
  index: null,
};
let isPlaying = false;
let timeInterval = null;
let time = 0;

//  function

function checkStatus() {
  const currenList = [...container.children];
  const unMatchedList = currenList.filter(
    (child, index) => Number(child.getAttribute("data-index")) !== index
  ); //필터는 제시하는 특저한 조건에 만족하는 el만 리턴을시킴
  //만약 매치를 다 시켰으면 게임피니시
  if (unMatchedList.length === 0) {
    gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timeInterval);
  }
}

function setGame() {
  isPlaying = true;
  time = 0;
  container.innerHTML = "";
  gameText.style.display = "none";
  clearInterval(timeInterval);

  tiles = creatImageTiles();
  // 매서드 호출하면  함수가 실행되고 결과물이 리턴이 되면서 그값이 tiles에 담김
  // 랜덤하게 뒤섞인 타일즈 생성
  tiles.forEach((tile) => container.appendChild(tile));
  setTimeout(() => {
    container.innerHTML = "";
    shuffle(tiles).forEach((tile) => container.appendChild(tile));
    timeInterval = setInterval(() => {
      playTime.innerText = time;
      time++;
    }, 1000);
  }, 5000);
  // 인자를 하나만 사용하면 괄호를 생략할 수 있고 한줄인 경우엔 중괄호도 생략가능
}
// 타일 16개 생성
function creatImageTiles() {
  const tempArray = [];
  Array(tileCount)
    .fill()
    .forEach((_, i) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", i);
      li.setAttribute("draggable", "true"); //드래그 계속하면 씹히는거 방지
      li.classList.add(`list${i}`); //` 같이쓰면 변수랑 문자열 같이쓸수있음

      tempArray.push(li);
      // 새성된 li가 하나씩 tempArray라는 배열 안에 담기도록 해줌
    });
  return tempArray;
  // 다 담겨진 배열을 반환해주는 함수 생성
}

// 순서섞기
// 인자를 배열로 하나 넘겨받고 넘겨받은 배열을 index를 먼저 구해서 array.length - 1 하면 제일 마지막 인덱스가 선택이된다. 마지막인덱스로 부터 1씩 감소하면서 0보다 큰동안 반복을 한다. math.floor 을 사용해서 소수점 다 자름
function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    // 2개의 배열원소를 선택해 순서를 바꾼다.
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
  // 이제 suffle을 호출하면 뒤섞인 배열을 사용가능하다.
}

// events

// 드래그를 했을때의 이벤트를 e에 담아서 가져올것임
container.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;
  const obj = e.target;
  dragged.el = obj;
  dragged.class = obj.className;
  //인덱스는 확인이 불가하기 떄문에 배열을통해 몇번째에 있는지 확인해야함
  dragged.index = [...obj.parentNode.children].indexOf(obj); //...하면 가지고있는 기본 원소가 불러짐
});
container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  if (!isPlaying) return;
  // 옮겨놓았을때 바뀌는 로직
  const obj = e.target;

  if (obj.className !== dragged.class) {
    let originPlace;
    let isLast = false;
    if (dragged.el.nextSibling) {
      //  땡겨온 곳의 시점의 그 위치를 저장
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }

    // 떨어뜨린 인덱스가 droppedIndex에 담기게된다
    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    //droppedIndex가 index보다 뒤에있던 element이면 objbefore을 통해 앞으로 넣고 그게 아니라면 after을 통해 뒤로 보내라
    dragged.index > droppedIndex
      ? obj.before(dragged.el)
      : obj.after(dragged.el);
    // drop된 element를 drag한 element의 원래 있던 자리에 집어넣고   drop된 element를 원래있던 자리에 넘겨주는 로직?????뭔말
    isLast ? originPlace.after(obj) : originPlace.before(obj);
  }
  // 맞는위치에 가있는지 확인
  checkStatus();
});

// 놓은 element와 index를 비교해서 순서를 바꿔주고 앞에 집어넣고 집어넣게 된 element는 다시 뒤로 빼는 작업 진행

// 게임스타트버튼
startButton.addEventListener("click", () => {
  setGame();
});
