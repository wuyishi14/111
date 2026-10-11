/* 基础变量定义 */
const wrap = document.getElementById('cube');
const audio = document.getElementById('bgm');
let isAutoRotating = true;
let currentRotateX = 20;
let currentRotateY = 30;
let rotationInterval;

// 新增鼠标控制变量
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let scaledImage = null;
const SCALE_FACTOR = 2.5; // 图片放大倍数

/* 初始化自动旋转 */
function startAutoRotation() {
  if (rotationInterval) clearInterval(rotationInterval);
  
  rotationInterval = setInterval(() => {
    currentRotateX += 1;
    currentRotateY += 1;
    updateRotation();
  }, 50);
  
  isAutoRotating = true;
  wrap.style.animation = 'move 6s linear infinite';
  
  // 恢复图片缩放状态
  if (scaledImage) {
    scaledImage.style.transform = scaledImage.originalTransform;
    scaledImage = null;
  }
}

/* 停止自动旋转 */
function stopAutoRotation() {
  if (rotationInterval) clearInterval(rotationInterval);
  isAutoRotating = false;
  wrap.style.animation = 'none';
}

/* 更新旋转状态 */
function updateRotation() {
  wrap.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
}

/* 手动旋转控制 */
document.getElementById('rotateLeft').addEventListener('click', () => {
  stopAutoRotation();
  currentRotateY -= 15;
  updateRotation();
});

document.getElementById('rotateRight').addEventListener('click', () => {
  stopAutoRotation();
  currentRotateY += 15;
  updateRotation();
});

document.getElementById('rotateUp').addEventListener('click', () => {
  stopAutoRotation();
  currentRotateX -= 15;
  updateRotation();
});

document.getElementById('rotateDown').addEventListener('click', () => {
  stopAutoRotation();
  currentRotateX += 15;
  updateRotation();
});

document.getElementById('resetRotation').addEventListener('click', () => {
  currentRotateX = 20;
  currentRotateY = 30;
  updateRotation();
  // 恢复图片缩放状态
  if (scaledImage) {
    scaledImage.style.transform = scaledImage.originalTransform;
    scaledImage = null;
  }
  if (isAutoRotating) {
    startAutoRotation();
  }
});

document.getElementById('toggleAuto').addEventListener('click', () => {
  if (isAutoRotating) {
    stopAutoRotation();
  } else {
    startAutoRotation();
  }
});

/* 显示/隐藏手动控制按钮 */
document.getElementById('manualControlBtn').addEventListener('click', () => {
  const controls = document.querySelector('.manual-controls');
  controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
});

/* 音乐控制 */
document.getElementById('playMusic').addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(e => {
      console.log('播放失败:', e);
      alert('请允许音频播放以听取背景音乐');
    });
    document.getElementById('playMusic').textContent = '暂停音乐';
  } else {
    audio.pause();
    document.getElementById('playMusic').textContent = '播放音乐';
  }
});

/* 新增：鼠标拖拽控制旋转 */
wrap.addEventListener('mousedown', (e) => {
  if (!isAutoRotating) { // 仅在手动模式下生效
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    wrap.style.cursor = 'grabbing';
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDragging && !isAutoRotating) {
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    
    currentRotateY += deltaX * 0.5;
    currentRotateX -= deltaY * 0.5;
    
    updateRotation();
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  wrap.style.cursor = 'pointer';
});

document.addEventListener('mouseleave', () => {
  isDragging = false;
  wrap.style.cursor = 'pointer';
});

/* 新增：图片点击放大功能 */
document.querySelectorAll('.wrap img').forEach(img => {
  img.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止事件冒泡影响旋转
    if (!isAutoRotating) { // 仅在手动模式下生效
      // 恢复之前放大的图片
      if (scaledImage && scaledImage !== img) {
        scaledImage.style.transform = scaledImage.originalTransform;
      }
      
      // 处理当前点击的图片
      if (scaledImage === img) {
        // 恢复原始大小
        img.style.transform = img.originalTransform;
        scaledImage = null;
      } else {
        // 保存原始transform并放大
        img.originalTransform = img.style.transform;
        img.style.transform = img.originalTransform + ` scale(${SCALE_FACTOR})`;
        scaledImage = img;
      }
    }
  });
});

/* 彩蛋口令 STAR */
let seq = '';
window.addEventListener('keydown', e => {
  seq = (seq + e.key).toUpperCase().slice(-4);
  if (seq === 'STAR' && !document.body.classList.contains('explode')) {
    triggerExplode();
  }
});

function triggerExplode() {
  document.body.classList.add('explode');
  
  // 创建提示元素
  let hint = document.getElementById('hint');
  if (!hint) {
    hint = document.createElement('div');
    hint.id = 'hint';
    hint.textContent = '✨ 彩蛋效果 ✨';
    document.body.appendChild(hint);
  }
  hint.style.opacity = 1;
  
  // 停止自动旋转
  stopAutoRotation();
  
  // 保存原始角度用于爆炸效果
  [...wrap.children].forEach(el => {
    const style = getComputedStyle(el);
    const tf = style.transform;
    const rx = (tf.match(/rotateX\((.+?)deg\)/) || [0, 0])[1];
    const ry = (tf.match(/rotateY\((.+?)deg\)/) || [0, 0])[1];
    el.style.setProperty('--rx', rx + 'deg');
    el.style.setProperty('--ry', ry + 'deg');
  });
  
  // 恢复正常状态
  setTimeout(() => {
    document.body.classList.remove('explode');
    hint.style.opacity = 0;
    resetRotation();
  }, 4000);
}

// 初始化自动旋转
startAutoRotation();