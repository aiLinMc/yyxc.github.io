// 创建漂浮的99数字
function createFloatingNumber() {
    const number = document.createElement('div');
    number.className = 'floating-number';
    number.textContent = '99';
    
    // 随机大小和透明度
    const size = Math.floor(Math.random() * 30) + 15;
    const opacity = Math.random() * 0.7 + 0.3;
    const duration = Math.random() * 10 + 10;
    
    number.style.fontSize = `${size}px`;
    number.style.opacity = opacity;
    
    // 随机起始位置
    const startPosition = Math.random() * window.innerWidth;
    number.style.left = `${startPosition}px`;
    number.style.top = `${window.innerHeight}px`;
    
    document.body.appendChild(number);
    
    // 获取数字元素的实际高度
    const numberHeight = number.offsetHeight;
    
    // 设置动画，终点是向上移动视口高度+数字自身高度
    number.style.animation = `floatUp ${duration}s linear forwards`;
    number.style.setProperty('--move-distance', `-${window.innerHeight + numberHeight}px`);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (number.parentNode) {
            number.remove();
        }
    }, duration * 1000);
}

// 创建爱心
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    // 随机颜色
    const colors = ['#ff2a6d', '#ff7eb3', '#ff4d94', '#ff6b6b', '#ff8ba0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    heart.style.color = randomColor;
    
    // 随机大小
    const size = Math.floor(Math.random() * 20) + 20;
    heart.style.fontSize = `${size}px`;
    
    document.body.appendChild(heart);
    
    // 动画结束后移除元素
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// 创建星星背景
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const starsCount = 200;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        const opacity = Math.random() * 0.7 + 0.3;
        const duration = Math.random() * 5 + 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = opacity;
        star.style.animationDuration = `${duration}s`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }
}

// 显示全局消息提示
function showGlobalMessage(message, isSuccess) {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.global-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const messageEl = document.createElement('div');
    messageEl.className = `global-message ${isSuccess ? 'success' : 'error'}`;
    messageEl.textContent = message;
    
    // 添加样式
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    `;
    
    if (isSuccess) {
        messageEl.style.background = 'linear-gradient(45deg, #00c853, #64dd17)';
    } else {
        messageEl.style.background = 'linear-gradient(45deg, #ff5252, #ff1744)';
    }
    
    document.body.appendChild(messageEl);
    
    // 3秒后消失
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 300);
    }, 3000);
}

// 模态窗口功能
const messageBoardBtn = document.getElementById('messageBoardBtn');
const aiChatBtn = document.getElementById('aiChatBtn');
const messageModal = document.getElementById('messageModal');
const aiModal = document.getElementById('aiModal');
const closeMessageModal = document.getElementById('closeMessageModal');
const closeAiModal = document.getElementById('closeAiModal');
const messageForm = document.getElementById('messageForm');
const aiForm = document.getElementById('aiForm');
const formMessage = document.getElementById('formMessage');
const aiResponse = document.getElementById('aiResponse');

// 打开留言板
messageBoardBtn.addEventListener('click', () => {
    messageModal.classList.add('active');
});

// 打开AI对话
aiChatBtn.addEventListener('click', () => {
    aiModal.classList.add('active');
});

// 关闭留言板
closeMessageModal.addEventListener('click', () => {
    messageModal.classList.remove('active');
});

// 关闭AI对话
closeAiModal.addEventListener('click', () => {
    aiModal.classList.remove('active');
});

// 处理留言表单提交
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(messageForm);
    
    // 显示加载状态
    const submitBtn = messageForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 使用Fetch API提交表单
    fetch('https://getform.io/f/bolzkepa', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            // 提交成功
            showGlobalMessage('留言提交成功！感谢您的反馈。', true);
            messageModal.classList.remove('active'); // 关闭留言窗口
            messageForm.reset();
        } else {
            throw new Error('提交失败');
        }
    })
    .catch(error => {
        showGlobalMessage('留言提交失败，请稍后再试。', false);
        messageModal.classList.remove('active'); // 关闭留言窗口
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// 处理AI表单提交
aiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const questionInput = document.getElementById('question');
    const question = questionInput.value.trim();
    
    if (!question) return;
    
    // 显示加载状态
    const submitBtn = aiForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '思考中...';
    submitBtn.disabled = true;
    
    // 清空之前的回答
    aiResponse.innerHTML = '<p>AI正在思考，请稍候...</p>';
    
    try {
        // 使用Pollinations AI API
        const encodedQuestion = encodeURIComponent(question);
        const apiUrl = `https://text.pollinations.ai/你是一个基于DeepSeek-v2的AI，用户给你以下提示词：${encodedQuestion}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.text();
        
        // 显示AI的回答
        aiResponse.innerHTML = `<p><strong>AI助手:</strong> ${data}</p>`;
    } catch (error) {
        console.error('AI请求错误:', error);
        aiResponse.innerHTML = `<p class="error">抱歉，AI暂时无法回答您的问题。请稍后再试。</p>`;
    } finally {
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 清空输入框
        questionInput.value = '';
    }
});

// 初始创建一些漂浮数字
for (let i = 0; i < 20; i++) {
    setTimeout(() => {
        createFloatingNumber();
    }, i * 300);
}

// 持续创建漂浮数字
setInterval(createFloatingNumber, 500);

// 点击事件监听
document.body.addEventListener('click', (e) => {
    // 只在没有打开任何模态窗口时创建爱心
    if (!messageModal.classList.contains('active') && !aiModal.classList.contains('active')) {
        createHeart(e.clientX, e.clientY);
    }
});

// 触摸事件支持（移动设备）
document.body.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    // 只在没有打开任何模态窗口时创建爱心
    if (!messageModal.classList.contains('active') && !aiModal.classList.contains('active')) {
        createHeart(touch.clientX, touch.clientY);
    }
});

// 创建星星背景
createStars();

// 文字切换功能
document.addEventListener('DOMContentLoaded', function() {
    const mainText = document.getElementById('mainText');
    const texts = ['遥遥星辰', '284999', '广告位招租'];
    let currentIndex = 0;
    
    mainText.addEventListener('click', function() {
        // 切换到下一个文本
        currentIndex = (currentIndex + 1) % texts.length;
        mainText.textContent = texts[currentIndex];
        
        // 添加一个简单的动画效果
        mainText.style.transform = 'scale(1.1)';
        setTimeout(() => {
            mainText.style.transform = 'scale(1)';
        }, 200);
    });
});