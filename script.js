document.addEventListener("DOMContentLoaded", function () {
  const filterType = document.getElementById("filterType");
  const sortOption = document.getElementById("sortOption");
  const animalContainer = document.getElementById("animalContainer");
  const addBtn = document.getElementById("addAnimalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const formDiv = document.getElementById("addAnimalForm");
  const animalForm = document.getElementById("animalForm");
  const overlay = document.getElementById("overlay");
  const statuses = ["尚未領養", "預約領養"];
  const navbar = document.querySelector('.navbar');

  // nav透明效果
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { // 捲動超過50px就加透明class
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  

  // render動物卡片
  let animals = [
    { id: 1, name: "小花", species: "狗", age: 2, desc: "這是一個簡短描述", status: "尚未領養", img: "image/pig.jpg" },
    { id: 2, name: "小白", species: "貓", age: 3, desc: "旺旺旺旺旺", status: "預約領養", img: "image/pig.jpg" },
    { id: 3, name: "小黑", species: "貓", age: 1, desc: "123456778", status: "預約領養", img: "image/pig.jpg" },
    { id: 4, name: "小黃", species: "豬", age: 4, desc: "簡短好簡短", status: "尚未領養", img: "image/pig.jpg" },
    { id: 5, name: "小白", species: "豬", age: 4, desc: "嘿嘿嘿嘿嘿", status: "預約領養", img: "image/pig.jpg" },
    { id: 6, name: "小黑", species: "豬", age: 4, desc: "懶得打了", status: "預約領養", img: "image/pig.jpg" },
    { id: 7, name: "小黃", species: "豬", age: 4, desc: "這是一個簡短描述", status: "尚未領養", img: "image/pig.jpg" },
    { id: 8, name: "小白", species: "豬", age: 4, desc: "這是一個簡短描述", status: "預約領養", img: "image/pig.jpg" },
    { id: 9, name: "小黑", species: "豬", age: 4, desc: "這是一個簡短描述", status: "預約領養", img: "image/pig.jpg" },
  ];

  function generateId() {
    return animals.length ? Math.max(...animals.map(a => a.id)) + 1 : 1;
  }

  function renderCards(data) {
    animalContainer.innerHTML = "";
    data.forEach(animal => {
      const statuses = ["尚未領養", "預約領養"];
      const statusHtml = statuses.map(status => {
        const activeClass = (status === animal.status) ? "active" : "";
        return `<span class="status-${status} ${activeClass}">${status}</span>`;
      }).join("／");

      const col = document.createElement("div");
      col.className = "col-md-3 animal-card";
      col.dataset.id = animal.id;

      col.innerHTML = `
        <div class="card h-100 d-flex flex-column">
          <img src="${animal.img}" class="card-img-top" alt="${animal.name}">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h2 class="card-title">${animal.name}</h2>
              <p class="card-text">${animal.desc}</p>
              <p class="status-container">${statusHtml}</p>
            </div>
            <div>
              <a href="animal_detail.html?id=${animal.id}" class="btn btn-primary w-100 mb-2">詳細資訊</a>
            </div>
          </div>
        </div>
      `;
      animalContainer.appendChild(col);
    });

  }

  // 篩選排序功能
  function filterAndSort() {
    const type = filterType.value;
    const sort = sortOption.value;

    let filtered = animals;

    if (type) {
      filtered = filtered.filter(a => a.species === type);
    }

    filtered.sort((a, b) => {
      if (sort === "ageAsc") return a.age - b.age;
      if (sort === "ageDesc") return b.age - a.age;
      return 0;
    });

    renderCards(filtered);
  }



    // 動物園動畫區
    const pet = document.getElementById('pet-container');
    const frames = Array.from(pet.querySelectorAll('img.frame'));
    let walkFrames = frames.filter(f => f.dataset.state === 'walk');
    let currentWalkIndex = 0;
    let currentState = 'walk';
    let frameInterval = null;
    let moveAnimation = null;

    function switchWalkFrame(frameDuration = 200) {
      if (currentState !== 'walk') return;
      if (frameInterval) clearInterval(frameInterval);
      frameInterval = setInterval(() => {
        frames.forEach(f => f.classList.remove('active'));
        walkFrames[currentWalkIndex].classList.add('active');
        currentWalkIndex = (currentWalkIndex + 1) % walkFrames.length;
      }, frameDuration);
    }

    function randomMove() {
      console.log("randomMove started");
      if (currentState === 'idle' || currentState === 'happy') {
        // 靜止或快樂狀態不移動
        currentState = 'walk';
        return;
      }

      currentState = 'walk';

      if (!frameInterval) switchWalkFrame();

      if (moveAnimation) {
        moveAnimation.pause();
        moveAnimation = null;
      }

      const vw = window.innerWidth - pet.clientWidth;
      const vh = window.innerHeight - pet.clientHeight;
      const x = Math.random() * vw;
      const y = Math.random() * vh;
      const duration = 4500 + Math.random() * 7000; // 最少4.5秒，最多7秒

      const currentX = pet.offsetLeft;
      const currentY = pet.offsetTop;
      const distance = Math.hypot(x - currentX, y - currentY);
      const speed = distance / duration;

      const frameDuration = Math.max(100, Math.min(300, 200 / speed));

      switchWalkFrame(frameDuration);

      // 根據移動方向翻轉圖片
      if (x < currentX) {
        pet.style.transform = 'scaleX(-1)'; // 向左翻轉
      } else {
        pet.style.transform = 'scaleX(1)';  // 向右（預設）
      }

      moveAnimation = anime({
        targets: pet,
        left: x + 'px',
        top: y + 'px',
        duration: duration,
        easing: 'linear',
        complete: () => {
          const willRest = Math.random() < 0.7; //休息機率:70%
          if (willRest) {
            restState();
          } else {
            randomMove();
          }
        }
      });
    }

    function restState() {
      currentState = 'idle';

      if (frameInterval) {
        clearInterval(frameInterval);
        frameInterval = null;
      }
      if (moveAnimation) {
        moveAnimation.pause();
        moveAnimation = null;
      }

      frames.forEach(f => f.classList.remove('active'));
      const idleFrame = frames.find(f => f.dataset.state === 'idle');
      if (idleFrame) idleFrame.classList.add('active');

      const restDuration = 4000 + Math.random() * 6000;  //休息4到10秒

      setTimeout(() => {
        // 只有當前狀態仍是 idle，才繼續移動，避免狀態互相干擾
        if (currentState === 'idle') {
          currentState = "walk";
          randomMove();
        }
      }, restDuration);
    }

    function happyState() {
      currentState = 'happy';
      if (frameInterval) {
        clearInterval(frameInterval);
        frameInterval = null;
      }
      if (moveAnimation) {
        moveAnimation.pause();
        moveAnimation = null;
      }
      frames.forEach(f => f.classList.remove('active'));
      const happyFrame = frames.find(f => f.dataset.state === 'happy');
      if (happyFrame) happyFrame.classList.add('active');

      setTimeout(() => {
        // 快樂狀態結束後恢復移動
        if (currentState === 'happy') {
          currentState = "walk";
          randomMove();
        }
      }, 3000);
    }

    // 啟動動畫
    randomMove();

    // 拖曳事件
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    pet.addEventListener('mousedown', e => {
      isDragging = true;
      dragOffsetX = e.clientX - pet.offsetLeft;
      dragOffsetY = e.clientY - pet.offsetTop;
      pet.style.cursor = 'grabbing';
      if (moveAnimation) moveAnimation.pause();
      if (frameInterval) {
        clearInterval(frameInterval);
        frameInterval = null;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDragging) {
        isDragging = false;
        pet.style.cursor = 'grab';
        randomMove();
      }
    });

    window.addEventListener('mousemove', e => {
      if (isDragging) {
        let x = e.clientX - dragOffsetX;
        let y = e.clientY - dragOffsetY;

        x = Math.min(Math.max(0, x), window.innerWidth - pet.clientWidth);
        y = Math.min(Math.max(0, y), window.innerHeight - pet.clientHeight);

        pet.style.left = x + 'px';
        pet.style.top = y + 'px';
      }
    });

    pet.addEventListener('click', e => {
      e.preventDefault();
      if (currentState === 'walk') {
        happyState();
      }
    });

    
  // 新增動物按鈕
  addBtn.addEventListener("click", () => {
    formDiv.style.display = "block";
    overlay.style.display = "block";

    setTimeout(() => {
      formDiv.classList.add("show");
      overlay.classList.add("show"); // 讓遮罩也有動畫
    }, 10);
  });

  cancelBtn.addEventListener("click", closeForm);
  overlay.addEventListener("click", closeForm);

  function closeForm() {
    formDiv.classList.remove("show");
    overlay.classList.remove("show");

    formDiv.removeEventListener("transitionend", onFormTransitionEnd);
    formDiv.addEventListener("transitionend", onFormTransitionEnd, { once: true });

    overlay.removeEventListener("transitionend", onOverlayTransitionEnd);
    overlay.addEventListener("transitionend", onOverlayTransitionEnd, { once: true });
  }

  function onFormTransitionEnd() {
    if (!formDiv.classList.contains("show")) {
      formDiv.style.display = "none";
      animalForm.reset();
    }
  }

  function onOverlayTransitionEnd() {
    if (!overlay.classList.contains("show")) {
      overlay.style.display = "none";
    }
  }

  animalForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("animalName").value.trim();
    const species = document.getElementById("animalType").value.trim();
    const age = Number(document.getElementById("animalAge").value.trim());
    const gender = document.querySelector('input[name="animalGender"]:checked')?.value;
    const neutered = document.querySelector('input[name="animalNeutered"]:checked')?.value;
    const vaccine = document.getElementById("animalVaccine").value.trim();
    const feature = document.getElementById("animalFeature").value.trim();
    const desc = document.getElementById("animalDesc").value.trim();

    const imgInput = document.getElementById("animalImage");
    const img = imgInput.files[0] ? URL.createObjectURL(imgInput.files[0]) : "image/default.jpg";

    if (!name || !species || isNaN(age) || !gender || !neutered || !feature || !desc) {
      alert("請填寫所有必填欄位");
      return;
    }

    if (isNaN(age) || age < 0) {
      alert("年齡必須是 0 或以上的數字");
      return;
    }

    const newAnimal = {
      id: generateId(),
      name,
      species,
      age,
      gender,
      neutered,
      vaccine,
      feature: feature.slice(0, 10), // 保證不超過10字
      desc, // 留下完整說明但不在卡片顯示
      status: "尚未領養", // 固定值，不讓使用者輸入
      img,
    };

    animals.push(newAnimal);
    filterAndSort();

    showToast("新增成功！");
    closeForm();
  });



  function onTransitionEnd() {
    if (!formDiv.classList.contains("show")) {
      formDiv.style.display = "none";
      animalForm.reset();
    }
  }

  // 顯示小提示訊息
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000); // 2秒後自動消失
  }

  filterType.addEventListener("change", filterAndSort);
  sortOption.addEventListener("change", filterAndSort);

  filterAndSort();

  // 新增領養動物圖片預覽
  document.getElementById('animalImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('previewImage');

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove('d-none'); // 移除 d-none 類別來顯示圖片
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '';
      preview.classList.add('d-none'); // 若未選擇圖片，則隱藏預覽
    }
  });




    
});
    