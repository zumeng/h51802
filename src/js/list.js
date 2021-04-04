/* 读取列表json数据，渲染 */
$(function(){
	// 利用 ajax 来访问后端接口，获取数据
	$.ajax({
		type : "get",
		url : "../mock/list.json",
		dataType : "json",
		success : function(responseData){
			// 处理数据，渲染
			responseData.res_body.list.forEach(function(product){				
				$(".template").clone() // 克隆模板
							  .removeClass("template").addClass("buy") // 修改类名
							  .css({display:"inline-block"}) // 设置以行内块展示
							  .appendTo(".box") // 追加到 .box 内部
							  .children(".img").attr("src", product.img) // 修改图片路径
							  .next(".desc").text(product.desc) // 商品描述
							  .next().text(product.price) // 商品价格
							  .next().text(product.id); // 商品编号
			});
		}
	});
});

/* 为"加入购物车"绑定点击事件:事件委派 */
$(function(){
	// $(".box").delegate(".add", "click", function(){});
	$(".box").on("click", ".add", function(e){
		// 获取当前点击的“加入购物车”所在大盒子
		var box = $(this).parent();
		// 将当前选购商品信息保存到对象中
		var currentProduct = {
			id : box.children(".id").text(),
			price : box.children(".price").text(),
			desc : box.children(".desc").text(),
			img : box.children(".img").attr("src"),
			amount : 1
		};
		// 配置 cookie 使用，自动json转换
		$.cookie.json = true;
		// 先读取已有的购物车 cookie
		var products = $.cookie("products") || [];
		// 判断已有选购商品中是否当前商品被选购过
		var index = exist(currentProduct.id, products);
		if (index !== -1) {
			products[index].amount++;
		} else{
			products.push(currentProduct);
		}
		// 使用 cookie 保存购物车数据
		$.cookie("products", products, {expires:7, path:"/"});

		// 保存成功，则添加抛物线效果
		var flyer = $(`<img src="${currentProduct.img}">`),
			offset = $(".cart").offset();
		flyer.fly({
			start : {
				left : e.pageX,
				top : e.pageY
			},
			end : {
				left : offset.left,
				top : offset.top,
				width : 0,
				height : 0
			}
		});
	});

	// 判断某id商品是否已选购
	function exist(id, products) {
		for (var i = 0, len = products.length; i < len; i++) {
			if (products[i].id == id) {
				return i;
			}
		}
		return -1;
	}
});