$(function(){
	/*****************************************/
	/* 加载购物车数据，渲染 */
	/*****************************************/
	// 配置 cookie
	$.cookie.json = true;
	// 读取 cookie 中保存的购物车
	var _products = $.cookie("products") || [];
	if(_products.length === 0)
		return;
	// 利用 artTemplate 来渲染模板
	var html = template("cart_template", {products: _products});
	// 显示到表格中
	$(".tab_cart tbody").html(html);

	/*****************************************/
	/* 删除购物车商品:事件委派 */
	/*****************************************/
	$(".tab_cart").on("click", ".del", function(){
		// 当前删除商品所在行
		var row = $(this).parents("tr");
		// 获取当前删除商品的id
		var _id = row.data("id");
		// 查找该 _id 商品在数组中的下标
		var index = exist(_id, _products);
		// 从数组中删除
		_products.splice(index, 1);
		// 存回到cookie中
		$.cookie("products", _products, {expires:7, path:"/"});
		// 从DOM节点中删除行
		row.remove(); // row[0].parentNode.removeChild(row[0])

		// 计算合计
		calcTotalPrice();
	});

	/*****************************************/
	/* 修改数量 +/- */
	/*****************************************/
	$(".tab_cart").on("click", ".minus,.add", function(){
		// 获取行
		var row = $(this).parents("tr");
		// id
		var _id = row.data("id");
		// 在数组中下标
		var index = exist(_id, _products);
		// 使用变量暂存index索引处的商品对象
		var prod = _products[index];
		// 修改数量
		if ($(this).is(".add"))
			prod.amount++;
		else{
			if (prod.amount <= 1)
				return;
			prod.amount--;
		}
		// 修改cookie
		$.cookie("products", _products, {expires:7, path:"/"});
		// 显示修改后的数量与小计
		row.find(".amount").val(prod.amount);
		row.find(".sub").text((prod.price * prod.amount).toFixed(2));

		// 计算合计
		calcTotalPrice();
	});

	/* 修改数量：输入*/
	$(".tab_cart").on("blur", ".amount", function(){
		// 行
		var row = $(this).parents("tr");
		// id
		var _id = row.data("id");
		// index
		var index = exist(_id, _products);
		// 商品
		var prod = _products[index];
		// 获取输入值
		var inputAmount = $(this).val();
		// 判断输入值格式
		if (!/^[1-9]\d*$/.test(inputAmount)) {
			$(this).val(prod.amount);
			return;
		}
		// 将商品的数量属性值修改为当前输入值
		prod.amount = inputAmount;
		// 保存到 cookie中
		$.cookie("products", _products, {expires:7, path:"/"});
		// 显示小计
		row.find(".sub").text((prod.price * prod.amount).toFixed(2));

		// 计算合计
		calcTotalPrice();
	});

	/*****************************************/
	/* 全选、部分选中 */
	/*****************************************/
	$(".ck_all").click(function(){
		// 获取当前“全选”复选框选中状态
		var status = $(this).prop("checked");
		// 设置商品行前复选框与全选状态一致
		$(".ck_prod").prop("checked", status);
		// 计算合计
		calcTotalPrice();
	});
	$(".ck_prod").click(function(){
		// 判断已勾选的商品行前复选框个数与_products数组长度是否一致，确定是否全选
		var b = $(".ck_prod:checked").length === _products.length;
		$(".ck_all").prop("checked", b);
		// 计算合计
		calcTotalPrice();
	});

	// 判断指定id的商品在数组中的下标
	function exist(id, products) {
		for (var i = 0, len = products.length; i < len; i++) {
			if (products[i].id == id) {
				return i;
			}
		}
		return -1;
	}

	// 计算合计
	function calcTotalPrice() {
		var total = 0;
		// 遍历jQuery对象中的每个DOM元素
		$(".ck_prod:checked").each(function(index, element){
			total += Number($(this).parents("tr").find(".sub").text())
		});
		// 显示合计金额
		$(".total_pay").text(total.toFixed(2));
	}
});