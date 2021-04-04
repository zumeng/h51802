;
(function($){
	/* 轮播图构造函数 */
	function Carousel({imgs, width, height, duration, addPrevNextBtn}) {
		this.imgs = imgs;
		this.width = width;
		this.height = height;
		this.duration = duration || 3000; // 轮播切换时间
		this.addPrevNextBtn = addPrevNextBtn; // 是否添加向前/后翻页按钮

		this.container = null; // 放置轮播图的容器
		this.lis = null; // 所有轮播图片的li盒子
		this.circles = null; // 所有小圆点
		this.len = imgs.length; // 所有轮播图片的张数
		this.currentIndex = 0; // 当前显示图片的索引
		this.nextIndex = 1; // 即将显示图片的索引
		this.timer = null; // 自动轮播计时器id
		this.prev = null; // 向前翻页盒子
		this.next = null; // 向后翻页盒子
	}

	// 向 Carousel.prototype 中添加属性
	$.extend(Carousel.prototype, {
		// 布局，创建DOM
		createDom : function(container){
			// 保存当前布局结构放置的容器
			this.container = $(container);
			// 为放置轮播图的容器添加自定义的类名
			this.container.addClass("xm-container");

			// 图片 li 布局
			var lis = "", circles = "";
			for (var i = 0, len = this.imgs.length; i < len; i++) {
				lis += `<li ${ i==0 ? 'style="display:block;"' : ''}>
							<a href="${this.imgs[i].href}">
								<img src="${this.imgs[i].src}">
							</a>
						</li>`;
				circles += `<i ${ i == 0 ? 'class="current"' : ''}></i>`;
			}

			// 向前/后翻页DOM结构
			var prevNext = "";
			if (this.addPrevNextBtn) {
				prevNext = `<div class="prev">&lt;</div>
							<div class="next">&gt;</div>`;
			}

			// 完整布局
			var html = `<ul class="imgs">${lis}</ul>
			<div class="pages">${circles}</div>
			${prevNext}`;

			// 添加到容器中
			this.container.html(html);

			// 设置 css
			this.container.css({
				width : this.width,
				height : this.height
			});
			$(".imgs, li", this.container).css({
				width : this.width,
				height : this.height
			});
			$(".pages", this.container).css("width", this.width);

			// 保存属性
			this.lis = $("li", this.container); // 所有轮播图片的li盒子
			this.circles = $("i", this.container); // 所有小圆点
			this.prev = $(".prev", this.container); // 向前
			this.next = $(".next", this.container); // 向后

			// 注册事件监听
			this.registerEventListener();
		},
		// 自动轮播
		autoPlay : function(){
			this.timer = setInterval($.proxy(this.move, this), this.duration);
		},
		// 轮播切换图片
		move : function(){
			// 当前淡出
			this.lis.eq(this.currentIndex).stop().fadeOut();
			// 即将淡入
			this.lis.eq(this.nextIndex).stop().fadeIn();
			// 小圆点变换
			this.circles.eq(this.currentIndex).removeClass("current");
			this.circles.eq(this.nextIndex).addClass("current");

			// 修改索引
			this.currentIndex = this.nextIndex;
			this.nextIndex++;
			if(this.nextIndex >= this.len)
				this.nextIndex = 0;
		},
		// 注册事件监听
		registerEventListener : function(){
			// 鼠标移入/移出容器范围，停止/重启自动轮播
			this.container.hover($.proxy(this.stopPlay, this), $.proxy(this.autoPlay, this));
			// 鼠标移入小点，向对应的图片切换
			this.circles.mouseover($.proxy(this.over, this));
			// 点击向前/后切换
			this.prev.on("click", $.proxy(this.previous, this));
			this.next.on("click", $.proxy(this.move, this));
		},
		// 停止自动轮播
		stopPlay : function(){
			clearInterval(this.timer);
		},
		// 鼠标移入小点轮播切换图片
		over : function(e){
			// 获取小点在同辈元素中的索引
			var _index = $(e.target).index();
			if (this.currentIndex == _index)
				return;
			this.nextIndex = _index;
			this.move();
		},
		// 向前翻页
		previous : function(){
			console.log("in")
			this.nextIndex = this.currentIndex - 1;
			if (this.nextIndex < 0)
				this.nextIndex = this.len - 1;
			this.move();
		}
	});

	// 插件
	// 向 jQuery.prototype 中扩展添加 carousel 方法
	$.fn.carousel = function(options){
		this.each(function(index, element){
			var c = new Carousel(options);
			c.createDom(element);
			c.autoPlay();
		});
	}
})(jQuery);