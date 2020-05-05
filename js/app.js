var globalHistState = 0;

var APP = new SSAPP();
var dbg = /*HTMLDivElement*/{};

var lang =
{
	alert1:"Sorry, you can't add more items",
	alert2:"Don't add same item twice. Don't repeat yourself",
	alert3:"Please add more items to save set",
	alert4: "Please name set",
	alert5: "Please describe set",
	set: "Set",
	from: "from",
	money: "zł",
	product: "Product",
	nothing_found: "Sorry, we found nothing",
	more_info: "More info"
};

if([] == [])
	alert('yes');

var config =
{
	canvasWidth: 960,
	canvasHeight: 960,
	renderCanvasWidth: 960,
	renderCanvasHeight: 960,
	minRelItemSize: 0.1,
	maxHistoryLength: 12,
	maxItemsInSet: 15,
	minItemInSet: 2,
	//canvasBounds: 100,
	breakpoints: {
		mobile: 480
	},

	classes: {
		search_button: "search_button",
		search_button_image: "search_button_image",
		canvasItemImage: "canvasItemImage",
		canvasItem: "canvasItem",
		controlToggle: "controlToggle",
		currentCanvasItem: "currentItem",
		notCurrentItem: "notCurrentItem",
		inactive: "inactive",
		visible: "visible",
		productThumb: "productThumb",
		scaler: "scaler",
		topLeft: "tl",
		topRight: "tr",
		bottomLeft: "bl",
		bottomRight: "br",
		selectedItemGray: "selectedItem",
		productDesc: "productDesc",
		productPic: "productPic",
		pricetag: "pricetag",
		deskDrag: "deskDrag",
		loadingScreen: "loadingScreen",
		totallyHidden: "totallyHidden"
	},

	params: {
		itemsPerPage: 30,
		itemsPerLine: 0,
		maxPageHeight: 0,
		thumbSize: 5
	},

	ids: {
		canvas: "canvas",
		renderCanvas: "renderCanvas",
		canvasContainer: "canvasContainer",
		controlsContainer: "controlsContainer",
		currentControls: "currentControls",
		searchContainer: "searchContainer",
		appContainer: "appContainer",
		searchButtons: "searchButtons",
		pageContainer: "itempageContainer",
		itempageTrimmer: "itempageTrimmer",
		itemPage: "itemPage",
		reflect: "reflect",
		rotate: "toggleRot",
		rotateHandler: "rotHandler",
		move: "toggleMove",
		scaleUp: "moveDown",
		scaleDown: "moveUp",
		remove: "remove",
		save: "saveset",
		fullscreeen: "fullscr",
		close: "close",
		subcategory: "subcategory",
		brand: "brand",
		color: "color",
		price: "price",
		itemDesc: "itemDesc",
		itemDescPicture: "itemDescPicture",
		addItem: "addItem",
		searchsubmit: "searchsubmit",
		userID: "0",
		submitSet: "submitSet",
		handlers: "handlers",
		saveWindow: "saveSetWindow",
		undo: "undo",
		redo: "redo",
		descContainer: "descContainer",
		totalPrice: "totalPrice",
		curItemDesc: "curItemDesc"
	},
	paths: {
		icons: "img/icons_cl/",
		small: "http://setstyle.pl/img/products/small/",
		medium: "http://setstyle.pl/img/products/medium/",
		large: "http://setstyle.pl/img/products/large/",
		//large: "https://crossorigin.me/http://setstyle.pl/img/products/large/",
		preloader: "img/ui/loader.gif"
	},
	iconlist: [
		{src: "Bag Front View-100.svg", category: "Torebki", button: {}},
		{src: "Coat-100.svg", category: "Kurtki i Płaszcze", button: {}},
		{src: "Flip Flops-100.svg", category: "Odzież plażowa", button: {}},
		{src: "Glasses-100.svg", category: "", button: {}},
		{src: "Necklace-100.svg", category: "Biżuteria", button: {}},
		{src: "Purse Front View-100.svg", category: "Akcesoria damskie", button: {}},
		{src: "Shirt-100.svg", category: "Topy i Koszulki", button: {}},
		{src: "Skirt-100.svg", category: "Spódnice", button: {}},
		{src: "Trousers-100.svg", category: "Spodnie", button: {}},
		{src: "Wedding Dress-100.svg", category: "Sukienki", button: {}},
		{src: "Women_Shoe-100.svg", category: "Buty damskie", button: {}},
		{src: "Women_Underwear-100.svg", category: "", button: {}}]
};

// vanilla js equivalend of $.ready()
var domReady = function (callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
domReady(function () {
	init()
});

function init() {
	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function () {
			//FastClick.attach(document.body);
		}, false);
	}
	var preloader = document.getElementById("preloader");
	preloader.style.display = "none";

	APP.init();
	var setinfo = APP.loadPreviousSet();
	window.addEventListener("resize", APP.resized);

	LOG("ready!");
	//var dt = detect.parse(navigator.userAgent);
	//dbg = document.getElementById("debug");
	//dbg.innerText = dt.browser.family + "\n" + dt.browser.name;
}

/* SSAP methods */

function SSAPP() {
	this.ui = /*UI*/{};
	this.itemsOnCanvas = [];
	this.dragMode = null;
	this.currentItem = null;
	this.browsingItems = false;
	//this.latestCategory = null;
	this.loadedProducts = {};
	this.latestPage = /*PageResponse*/null;
	this.waitingForNewPage = false;
	this.mouseIsDown = false;
	this.showedProduct = /*ProductInfo*/{};
	this.hashItems = [];

	this.currentFilters = {
		brand: null,
		color: null,
		subcategory: null,
		price: null
	};

	this.init = function () {
		this.hideSaveWindow();
		this.ui = new UI();
		this.updateUI();
		this.loadCategories();
		//this.loadDummy();
		var that = this;

		window.addEventListener("hashchange", function () {
			var hash = window.location.hash;
			if (hash == "") {
				that.ui.toggleSearchPage(false);
			}
		});
		document.addEventListener("keydown", function (e) {
			var keyCode = e.keyCode;
			if(keyCode == 8 ) { //backspace
				if(that.currentItem != null) that.removeCanvasItem(that.currentItem, true);
			} else {
				//alert("Oh no you didn't.");
			}

		}, false);

		document.body.addEventListener("mousedown", function () {
			that.mouseIsDown = true;
		});
		document.body.addEventListener("mouseup", function () {
			that.mouseIsDown = false;
		});

		this.ui.controlButtons.scaleUp.addEventListener("click", function (e) {
			that.moveCurrentItem(1);
		});
		this.ui.controlButtons.scaleDown.addEventListener("click", function (e) {
			that.moveCurrentItem(-1);
		});

		this.ui.controlButtons.reflect.addEventListener("click", function () {
			that.reflectPicture();
		});
		/*		this.ui.controlButtons.move.addEventListener("click", function () {
		 that.toggleDragMode(config.ids.move);
		 });*/
		this.ui.controlButtons.remove.addEventListener("click", function () {
			that.removeCanvasItem(that.currentItem, true);
		});

		this.ui.fullscreeen.addEventListener("click", function () {
			toggleFullScreen();
		});

		if (navigator.userAgent.toLowerCase().indexOf("iphone") != -1)
		{
			this.ui.fullscreeen.style.display = "none";
		}

		if (navigator.userAgent.toLowerCase().indexOf("ipad") != -1)
		{
			this.ui.fullscreeen.style.display = "none";
		}

		this.ui.save.addEventListener("click", function () {
			that.showSaveWindow();
		});

		this.ui.undo.addEventListener("click", function () {
			that.undoAction();
		});

		this.ui.redo.addEventListener("click", function () {
			that.redoAction();
		});

		this.ui.close.addEventListener("click", function () {
			that.closeSearch();
		});

		this.ui.closeSaveWindow.addEventListener("click", function () {
			that.hideSaveWindow();
		});

		this.ui.addItemBtn.addEventListener("click", function () {
			that.placeShowedProduct();
		});

		this.ui.itemDesc.addEventListener('click', function (e) {
			if (e.target == that.ui.itemDesc) {
				that.ui.hideProductInfo();
			}
		});

		var closeButtonItemdesc = findClass(this.ui.itemDesc, "closeCross");

		closeButtonItemdesc.addEventListener("click", function (e) {
			that.ui.hideProductInfo();
		});

		this.ui.searchSubmit.addEventListener("click", function () {
			that.searchItems();
		});
		var searchInput = document.getElementsByName("searchInput")[0];
		searchInput.onkeypress = function (e) {
			if (!e) e = window.event;
			var keyCode = e.keyCode || e.which;
			if (keyCode == '13') {
				that.searchItems();
				return false;
			}
		};

		this.toggleDragMode(config.ids.move);

		this.clearCurrentItem();
		this.ui.pageTrimmer.onscroll = function (e) {
			var pagehei = that.ui.itemPage.clientHeight;
			var tobottom = pagehei - this.clientHeight - this.scrollTop;

			if (tobottom < 128) {
				that.bottomHit();

				//that.ui.itemPage.style.height = Math.min(that.ui.itemPage.clientHeight+100, config.params.maxPageHeight)+"px";
			}
		};
		this.ui.brand.onchange = function (e) {
			that.selChange(e);
		};

		this.ui.subcategory.onchange = function (e) {
			that.selChange(e);
		};

		this.ui.price.onchange = function (e) {
			that.selChange(e);
		};

		this.ui.color.onchange = function (e) {
			that.selChange(e);
		};

		this.ui.submitSet.addEventListener("click", function (e) {
			that.startSavingCurentSet();
		});

	};

	this.loadPreviousSet = function () {
		var setId = $_GET("set") || "";
		var infofromLink = $_GET("hash") || "";
		var infofromStorage = localStorage.getItem("history0");
		var infoToLoad = "";
		if (setId != "") {
			//start loading items from db and send them to loadItems func;
			this.loadSetById(setId);
			//localStorage.clear();
			return true;
		}
		if (infofromLink != "") {
			var state = base32.decode(infofromLink);
			this.loadState(state);
			localStorage.clear();
			return true;
		}
		if (infofromStorage != undefined) {
			//var hst = window.localStorage.getItem("history");
			//hst = JSON.decode();

			var hlist = [];
			for (var n = config.maxHistoryLength; n >= 0; n--) {
				var hstate = localStorage.getItem("history" + n);
				if (hstate != undefined) {
					hlist.unshift(hstate);
				}
			}


			var desers = hlist[hlist.length - 1];
			this.loadState(desers);
			localStorage.clear();
		}

	};

	this.loadSetById = function (setId) {
		var that = this;
		var setRequest = ajax({
			method: 'post',
			url: 'php/get_set_xml.php',
			data: {id:setId}
		});

		setRequest.then(function (response) {
			var parser = new DOMParser();
			var data = parser.parseFromString(response, "text/xml");
			var set = data.getElementsByTagName('set')[0];
			var hash = set.getAttribute("hash");
			hash = base32.decode(hash);
			that.loadState(hash);
			localStorage.clear();
		});
	};

	this.undoAction = function () {
		//for( var i = 0; i < this.itemsOnCanvas)
	};
	this.redoAction = function () {

	};

	this.loadState = function (state) {

		var desers = JSON.parse(state);
		if(desers.length == 0)
		{
			return false;
		}
		this.hashItems = desers;
		var ids = "";
		for (var i = 0; i < desers.length; i++) {
			var inf = desers[i];
			var itm = new CanvasItem();
			itm.set_id = inf.i;
			itm.m = inf.m;
			itm.bodywidth = inf.w;
			ids += inf.i + ",";
		}
		ids = ids.substring(0, ids.length - 1);
		//localStorage.clear();
		this.loadIds(ids);
	};

	this.pushStateToHistory = function () {

		var global_step = globalHistState;
		var setstring = this.serializeSet();

		if (global_step > 0) {
			var prevhist = window.localStorage.getItem("history" + (global_step - 1));
		}
		if (setstring == prevhist) {
			//this.clearCurrentItem();
		}
		else {
			window.localStorage.setItem("history" + (global_step), setstring);
			globalHistState = globalHistState + 1;

		}
	};

	this.placeShowedProduct = function () {

		window.scrollTo(0, 0);
		this.addItemById(this.showedProduct.product_id, true);
		this.ui.toggleSearchPage();

	};
	this.showProduct = function (id) {
		var prodinfo = this.loadedProducts[id];
		this.showedProduct = prodinfo;
		this.ui.showProductInfo(prodinfo);
	};

	this.selChange = function (e) {
		var sel = /*HTMLSelectElement*/e.target;

		if (sel.value == "none") {
			this.currentFilters[sel.id] = null;
			sel.classList.remove("selectedItem");
		}
		else {
			this.currentFilters[sel.id] = sel.value;
			var selOpt = sel.options.item(sel.selectedIndex);
			for (var i = 0; i < sel.options.length; i++) {
				var opt = sel.options.item(i);
				if (opt.value == selOpt.value) {
					continue;
				}
				else {
					sel.options.remove(i);
					i--;
				}
			}
			var allopt = new Option("all", "none");
			sel.options.add(allopt);
			sel.classList.add(config.classes.selectedItemGray);
		}
		this.ui.itemPage.innerHTML = "";
		this.loadPage(this.latestPage.category, 0);
	};

	this.searchItems = function () {
		var sinput = document.getElementsByName("searchInput")[0];
		var sstring = sinput.value;
		window.location.hash = "search";
		this.ui.itemPage.innerHTML = "";
		this.clearFilters();
		if (sstring != "") {
			this.currentFilters["search"] = sstring;
		}
		this.ui.toggleSearchPage();
		this.loadPage("", 0);
	};

	this.renderItems = function () {
		var node = document.getElementById(config.ids.renderCanvas);
		var that = this;
		var result = new Image();
		var timeout = setTimeout(function () {
			alert("That the cross-origin problem I mentioned before");
			result.src = "demo_img/ERROR.png";
		}, 5000);
		domtoimage.toPng(node, {width: config.canvasWidth, height: config.canvasHeight})
			.then(function (dataUrl) {
				clearTimeout(timeout);
				var img = new Image();
				img.src = dataUrl;
				var rescnv = document.createElement("canvas");
				rescnv.width = config.renderCanvasWidth;
				rescnv.height = config.renderCanvasHeight;
				img.width = config.renderCanvasWidth;
				img.height = config.renderCanvasHeight;
				var ctx = rescnv.getContext("2d");
				ctx.drawImage(img, 0, 0, config.renderCanvasWidth, config.renderCanvasHeight);

				result.src = rescnv.toDataURL();
				//document.body.appendChild(result);
				that.updateUI();
			})
			.catch(function (error) {
				alert("That the cross-origin problem I mentioned before");
				var img = new Image();
				var rescnv = document.createElement("canvas");
				rescnv.width = config.renderCanvasWidth;
				rescnv.height = config.renderCanvasHeight;
				img.width = config.renderCanvasWidth;
				img.height = config.renderCanvasHeight;

				img.onload = function () {
					var ctx = rescnv.getContext("2d");
					ctx.drawImage(img, 0, 0, config.renderCanvasWidth, config.renderCanvasHeight);
					result.src = rescnv.toDataURL();
				};
				img.src = "demo_img/ERROR.png";

			});

		return result;
	};

	this.reflectPicture = function () {
		var body = this.currentItem.body;
		if (body._gsTransform.scaleX > 0) {
			TweenLite.to(body, 0.5, {scaleX: -1});
		}
		else {
			TweenLite.to(body, 0.5, {scaleX: 1});
		}
	};

	this.moveCurrentItem = function (direction) {
		var bd = this.currentItem.body;
		if (direction == 1) {
			if (bd.nextSibling != null) {
				bd.parentNode.insertBefore(bd, bd.nextSibling.nextSibling);
				TweenLite.from(bd, 0.2, {scaleX: 1.05, scaleY: 1.05});
			}
		}
		else {
			if (bd.previousSibling != null) {
				TweenLite.from(bd, 0.2, {scaleX: 0.95, scaleY: 0.95});
				bd.parentNode.insertBefore(bd, bd.previousSibling);
			}

		}
		//childNode[4].parentNode.insertBefore(childNode[4], childNode[3]);
	};

	this.scaleEnded = function (/*CanvasItem*/item) {
		var that = this;
		var stl = window.getComputedStyle(item.picture).transform ||
			window.getComputedStyle(item.picture).webkitTransform ||
			window.getComputedStyle(item.picture).mozTransform ||
			window.getComputedStyle(item.picture).msTransform || "none";


		if(stl == "none")
		{

		}
		else
		{
			stl = stl.split("(")[1].split(",")[0];
			var bw = parseInt(window.getComputedStyle(item.body).width);
			//bw = Math.max()
			var bh = parseInt(window.getComputedStyle(item.body).height);
			var scale = parseFloat(stl);
			var newWId = Math.floor(bw * scale);
			var newHei = Math.floor(bh * scale);



			var shiftX = (bw - newWId) / 2;
			var shiftY = (bh - newHei) / 2;
			item.body.style.width = newWId + "px";
			TweenLite.set(item.picture, {scaleX: 1, scaleY: 1});
			var newx = item.body._gsTransform.x + shiftX;
			var newy = item.body._gsTransform.y + shiftY;
			TweenLite.set(item.body, {x: newx, y: newy});
			if (Math.max(newHei, newWId) < 192) {
				var scm = 192/Math.max(newHei, newWId);
				TweenLite.to(item.picture, 0.5, {scaleX:scm, scaleY: scm, ease: Circ.easeOut, onComplete: function () {
					that.scaleEnded(item);
				}});
				return false;
			}
			if( Math.max(newHei, newWId) > 960)
			{
				var sc = 960/Math.max(newHei, newWId);
				//this.removeCanvasItem(item, true);
				TweenLite.to(item.picture, 0.5, {scaleX:sc, scaleY: sc, ease: Circ.easeOut, onComplete: function () {
					that.scaleEnded(item);
				}});
				return false;
			}
			if( isOverlapping(that.ui.canvas, item.picture) == false)
			{
				TweenLite.to(item.body, 0.5, {x:config.canvasWidth/2, y:config.canvasHeight/2});
				//alert("noooooooooooo");
			}
			this.pushStateToHistory();
		}


	};

	this.gatherItemsInfo = function () {
		var len = this.itemsOnCanvas.length;
		for (var i = 0; i < len; i++) {
			var item = this.itemsOnCanvas[i];
			var el = item.body;
			var st = window.getComputedStyle(el, null);
			var tr = st.getPropertyValue("-webkit-transform") ||
				st.getPropertyValue("-moz-transform") ||
				st.getPropertyValue("-ms-transform") ||
				st.getPropertyValue("-o-transform") ||
				st.getPropertyValue("transform") ||
				"FAIL";
			var values = tr.split('(')[1].split(')')[0].split(',');
			var a = values[0];
			var b = values[1];
			var c = values[2];
			var d = values[3];
			var scale = Math.sqrt(a * a + b * b);
			// arc sin, convert from radians to degrees, round
			var sin = b / scale;
// next line works for 30deg but not 130deg (returns 50);
// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
			var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));


		}

// With rotate(30deg)...
// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)

// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

	};

	this.bottomHit = debounce(function () {
		APP.addNewPage();
		APP.waitingForNewPage = true;
	}, 300, true);

	this.loadCategories = function () {
		var categoryRequest = ajax({
			method: 'post',
			url: 'php/get_categories.php'

		});

		categoryRequest.then(function (response) {
			var arr = response["categories"];
			var i = 0;
			while (i < arr.length) {
				var cat = arr[i];
				APP.addCategoryButton(cat);
				i++;
			}
		});
	};

	this.loadItemsFromString = function (req) {

	};

	this.saveItemsToString = function () {
		var raw = this.serializeSet();
		var enc = base32.encode(raw);

		return enc;
	};

	this.serializeSet = function () {
		var arr = [];
		for (var i = 0; i < this.itemsOnCanvas.length; i++) {
			var itm = /*CanvasItem*/this.itemsOnCanvas[i];
			var el = itm.body;
			var st = window.getComputedStyle(el, null);
			var tr = st.getPropertyValue("-webkit-transform") ||
				st.getPropertyValue("-moz-transform") ||
				st.getPropertyValue("-ms-transform") ||
				st.getPropertyValue("-o-transform") ||
				st.getPropertyValue("transform") ||
				"matrix(0,0,0,0,0,0)";

			var matr = roundFloats(tr);
			var wid = window.getComputedStyle(itm.body).width;
			// wid = parseInt(wid);
			// var id = parseInt(itm.productId);

			var id = itm.productId;

			var obj = {
				m: matr,
				w: wid,
				i: id
			};

			arr.push(obj);
		}
		var shareURL = JSON.stringify(arr);
		return shareURL;
	};

	this.addItemById = function (id, makeCurrent, params) {
		if (this.loadedProducts[id]) {
			var prodinfo = this.loadedProducts[id];
			var canvItem = this.createItemFromProduct(prodinfo);
			for (var n in params) {
				canvItem[n] = params[n];
			}
			this.addCanvasItem(canvItem, makeCurrent);
		}
		else {
			console.error("requested ID " + id + " not in local database");
		}
	};

	this.addCanvasItem = function (/*CanvasItem*/item, makeCurrent) {
		var that = this;
		if(this.itemsOnCanvas.length >= config.maxItemsInSet)
		{
			alert(lang.alert1);
			return false;

		}

		for (var i = 0; i < this.itemsOnCanvas.length; i++)
		{
			if(item.productId == this.itemsOnCanvas[i].productId)
			{

				alert(lang.alert2);
				return false;
			}
		}

		var img = document.createElement("img");
		item.picture = img;
		var isCurrent = makeCurrent || false;
		var cont = document.createElement("div");
		var scaler = document.createElement("div");
		var mover = document.createElement("div");
		var preloader = document.createElement("img");
		preloader.src = config.paths.preloader;
		preloader.className = "preloader";
		cont.appendChild(preloader);
		cont.appendChild(scaler);
		cont.appendChild(mover);

		mover.className = "mover";

		img.classList.add(config.classes.canvasItemImage);
		cont.classList.add(config.classes.canvasItem);
		scaler.classList.add(config.classes.scaler);

		img.onload = function () {

			var wToH = img.naturalWidth / img.naturalHeight;
			item.proportion = wToH;
			var wid, hei;

			if (item.proportion < 1) {
				hei = Math.floor(config.canvasWidth * item.relSize);
				wid = Math.floor(hei * wToH);
			}
			else {
				wid = Math.floor(config.canvasWidth * item.relSize);
				hei = Math.floor(wid / wToH);
			}
			cont.style.width = wid + "px";
			//item.scaler.style.width = wid + "px";
			//item.scaler.style.height = hei + "px";
			item.width = wid;
			TweenLite.set(cont, {
				x: (item.left * config.canvasWidth) - wid / 2,
				y: item.top * config.canvasHeight - hei / 2
			});

			if (isCurrent) {
				that.setCurrentItem(item);
			}
			cont.insertBefore(img, mover);

			TweenLite.from(img, 0.5, {alpha: 0});
			cont.removeChild(preloader);
			if (item.m != null) {
			}

			if(that.hashItems.length > 0)
			{
				var l = that.hashItems.length;
				for( var i = 0; i < l; i++)
				{
					if(that.hashItems[i].i == item.productId)
					{
						cont.style.width = that.hashItems[i].w;
						//applyMatrix(item.body, that.hashItems[i].m);
						TweenLite.set(cont, {transform:that.hashItems[i].m});
					}
				}
			}
			that.pushStateToHistory();

		};

		var tl = document.createElement("div");
		tl.classList.add(config.classes.topLeft);
		scaler.appendChild(tl);
		var tr = document.createElement("div");
		tr.classList.add(config.classes.topRight);
		scaler.appendChild(tr);
		var bl = document.createElement("div");
		bl.classList.add(config.classes.bottomLeft);
		scaler.appendChild(bl);
		var br = document.createElement("div");

		TweenLite.set(cont, {
			x: item.left * config.canvasWidth,
			y: item.top * config.canvasHeight
		});
		br.classList.add(config.classes.bottomRight);
		scaler.appendChild(br);

		item.body = cont;
		item.scaler = scaler;
		item.mover = mover;

		var selected = false;

		item.scaler.addEventListener("mousedown", function (e) {
			item.startScale(e);
			// e.stopPropagation();
			// item.draggaRotate.disable();
			// item.draggaScale.enable().startDrag(e);
			// e = e.originalEvent;*/
		});

		item.picture.addEventListener("mousedown", function (e) {
			item.startRotate(e);

			/*			e.stopPropagation();
			 item.draggaScale.disable();
			 item.draggaRotate.enable().startDrag(e);
			 e = e.originalEvent;*/
		});
		item.mover.addEventListener("mousedown", function (e) {
			item.startMove(e);
		});
		item.mover.addEventListener("click", function(e) {
			e.preventDefault();
		});
		item.scaler.addEventListener("touchstart", function (e) {
			item.startScale(e);
		});
		item.scaler.addEventListener("pan pinch panend pinchend", function (e) {
			alert('Pinch');
			item.startScale(e);
		});
		item.picture.addEventListener("touchstart", function (e) {
			item.startRotate(e);
		});
		item.mover.addEventListener("touchstart", function (e) {
			item.startMove(e);
		});

		item.startScale = debounce(function (e) {
			//e.stopPropagation();
			//if (that.currentItem != item) return false;
			item.activateDrag(item.draggaScale);
			item.draggaScale.enable().startDrag(e);
			//e = e.originalEvent;
		}, 20, true);

		item.startRotate = debounce(function (e) {
			//e.stopPropagation();
			//if (that.currentItem != item) return false;
			item.activateDrag(item.draggaRotate);
			item.draggaRotate.enable().startDrag(e);
			//e = e.originalEvent;
		}, 20, true);

		item.startMove = debounce(function (e) {
			item.activateDrag(item.draggaMove);
			item.draggaMove.enable().startDrag(e);
		}, 20, true);

		item.body.addEventListener("click", function (e) {
			if(e.target == item.mover){
				e.preventDefault();
				that.setCurrentItem(item);
			}
			that.setCurrentItem(item);
		});

		that.ui.renderCanvas.appendChild(item.body);

		this.applyDrag(item, this.dragMode);

		img.src = item.src;
		this.itemsOnCanvas.push(item);
		this.updateTotalPrice();
	};

	this.updateTotalPrice = function () {
		var pricetag = document.getElementById(config.ids.totalPrice);
		var price = 0;
		for( var i = 0; i < this.itemsOnCanvas.length; i++)
		{
			var prc = this.itemsOnCanvas[i].price;
			prc = parseInt(prc);
			price += prc;
		}
		pricetag.innerHTML = "<b>"+lang.set+"</b>: "+lang.from+" " + price + " "+lang.money;
	};

	this.setCurrentItem = function (/*CanvasItem*/item) {
		//mitem == item || null;
		if (this.currentItem == item) {

			this.clearCurrentItem();
			return false;
		}
		//if(this.currentItem)
		var currentIndex = 0;
		for (var i = 0; i < this.itemsOnCanvas.length; i++) {
			var dv = this.itemsOnCanvas[i].body;
			dv.classList.remove(config.classes.currentCanvasItem);
			dv.classList.add(config.classes.notCurrentItem);
			this.itemsOnCanvas[i].body.style.zIndex = 9;
		}

		item.body.classList.add(config.classes.currentCanvasItem);
		item.body.classList.remove(config.classes.notCurrentItem);
		item.body.style.zIndex = 10;

		this.currentItem = item;
		this.ui.controlButtons.remove.classList.remove(config.classes.inactive);
		this.ui.controlButtons.scaleDown.classList.remove(config.classes.inactive);
		this.ui.controlButtons.scaleUp.classList.remove(config.classes.inactive);
		this.ui.controlButtons.reflect.classList.remove(config.classes.inactive);
		//this.applyDrag(item, config.ids.rotate);

		this.ui.currentControls.style.display = "";

		this.ui.handlers.style.display = "";



		if(this.display)

		this.ui.curItemDesc.innerHTML = "<b>"+lang.product+"</b>: " + "<a target='_blank' href='"+item.url+"'>"+ item.productName + "</a> "+lang.from+" "+ item.price +" "+lang.money+" |";

		//this.ui.rotateHandle = document.getElementById("rotateHandler");
		//item.body.appendChild(this.ui.rotateHandle);

	};

	this.clearCurrentItem = function () {

		this.currentItem = null;
		for (var i = 0; i < this.itemsOnCanvas.length; i++) {
			var dv = this.itemsOnCanvas[i].body;
			dv.classList.remove(config.classes.currentCanvasItem);
			dv.classList.remove(config.classes.notCurrentItem);
			var itm = this.itemsOnCanvas[i];
			//itm.activateDrag(itm.draggaMove);
			//this.applyDrag(this.itemsOnCanvas[i], config.ids.move);
		}
		this.ui.controlButtons.remove.classList.add(config.classes.inactive);
		this.ui.controlButtons.scaleDown.classList.add(config.classes.inactive);
		this.ui.controlButtons.scaleUp.classList.add(config.classes.inactive);
		this.ui.controlButtons.reflect.classList.add(config.classes.inactive);
		this.ui.currentControls.style.display = "none";
		this.ui.handlers.style.display = "none";
		this.ui.curItemDesc.innerHTML = "";
	};

	this.removeCanvasItem = function (item, tween) {
		var animated = tween || false;
		//item.dragga.kill();
		var ind = this.itemsOnCanvas.indexOf(item);
		if (ind != -1) {
			this.itemsOnCanvas.splice(ind, 1);
		}
		if (animated == true) {
			var that = this;
			TweenLite.to(item.body, 0.4, {
				rotation: 90, scaleX: 0.2, scaleY: 0.2, opacity: 0, onComplete: function () {
					that.removeCanvasItem(item, false);
				}
			});

			return false;
		}
		else {
			if (this.currentItem != null) {
				this.ui.renderCanvas.removeChild(this.currentItem.body);
			}
			this.clearCurrentItem();
			this.updateTotalPrice();
			this.pushStateToHistory();
			return true;
		}
	};

	this.toggleDragMode = function (controlId) {
		/*		this.dragMode = controlId;
		 this.ui.toggleControl(controlId);

		 for (var i = 0; i < this.itemsOnCanvas.length; i++) {
		 var itm = /!*CanvasItem*!/this.itemsOnCanvas[i];
		 this.applyDrag(itm, this.dragMode);
		 }*/
	};

	this.applyDrag = function (/*CanvasItem*/item, mode) {
		//if (item.dragga != null) item.dragga.kill();

		var that = this;
		//return false; //
		//
		// if (mode == config.ids.rotate) {

		item.draggaRotate = Draggable.create(item.body, {
			trigger: item.picture,
			onReleaseScope: item,
			onDragScope: item,
			onRelease: function () {
				if(this.dragged == false)
				{
					that.setCurrentItem(this);
				}
				else
				{
					this.dragged = false;
					that.pushStateToHistory();
				}
			},
			onDrag: function () {
				this.dragged = true;
			},
			type: "rotation"
		})[0].disable();
		item.draggaScale = Draggable.create(item.body, {
			//type: "x,y",
			type: "rotation",
			//bounds: this.ui.canvas,
			trigger: item.scaler,
			edgeResistance: 0.9,
			dragResistance: 0.5,
			zIndexBoost: false,
			onPressScope: item,
			onDragScope: item,
			onDragEndScope: item,
			//minimumMovement: 20,
			onReleaseScope: item,
			onPress: function (e) {
				var crd;
				if (e['touches'] == undefined) {
					crd = e;
				}
				else {
					crd = e['touches'][0];
				}
				var bodyR = this.body.getBoundingClientRect();
				this.sP.cX = bodyR.left + bodyR.width / 2;
				this.sP.cY = bodyR.top + bodyR.height / 2;
				this.sP.pX = crd.clientX;
				this.sP.pY = crd.clientY;
				this.sP.initL = Math.sqrt((this.sP.pX - this.sP.cX) * (this.sP.pX - this.sP.cX) + (this.sP.pY - this.sP.cY) * (this.sP.pY - this.sP.cY));
				//this.sP.initL = Math.max(this.sP.initL, 150);
			},
			onDrag: function (e) {
				var crd;
				if (e['touches'] == undefined) {
					crd = e;
				}
				else {
					crd = e['touches'][0];
				}
				this.sP.newX = crd.clientX;
				this.sP.newY = crd.clientY;
				this.dragged = true;
				var newL = Math.sqrt((this.sP.newX - this.sP.cX) * (this.sP.newX - this.sP.cX) + (this.sP.newY - this.sP.cY) * (this.sP.newY - this.sP.cY));

				var nscale = newL / this.sP.initL;
				nscale = Math.max(nscale, 0.1);
				if (this.picture._gsTransform != undefined) {
					var olds = this.picture._gsTransform.scaleX;
					//nscale = olds + (nscale-olds)*0.09;
				}
				TweenLite.to(this.picture, 0.7 + nscale, {scaleX: nscale, scaleY: nscale, ease: Circ.easeOut});
			},
			onRelease: function () {
				if(this.dragged == false)
				{
					that.setCurrentItem(this);
				}
				else
				{
					this.dragged = false;
				}
			},
			onDragEnd: function (e) {
				that.scaleEnded(this);
			}
		})[0].disable();

		var offset = Math.floor(config.canvasWidth * item.relSize * 0.5);
		var canvas_offset_bounds = {
			top: -offset,
			left: -offset,
			width: config.canvasWidth + offset * 2,
			height: config.canvasHeight + offset * 2
		};

		item.draggaMove = Draggable.create(item.body, {
			type: "x,y",
			trigger: item.mover,
			edgeResistance: 0.9,
			dragResistance: 0.1,
			bounds: canvas_offset_bounds,
			zIndexBoost: false,
			onReleaseScope: item,
			onDragScope: item,
			onRelease: function () {
				if(this.dragged == false)
				{
					that.setCurrentItem(this);
				}
				else
				{
					this.dragged = false;
					if( isOverlapping(that.ui.canvas, this.picture) == false)
					{
						TweenLite.to(item.body, 0.5, {x:config.canvasWidth/2, y:config.canvasHeight/2});
					}
					that.pushStateToHistory();
				}
			},
			onDrag: function () {
				this.dragged = true;
			}
			//onClickScope:item
		})[0].disable();


	};

	this.resized = debounce(function () {
		APP.updateUI();
	}, 300, false);

	this.updateUI = function () {
		this.ui.updateElements();
		this.ui.updateElements();
	};
	this.addCategoryButton = function (category) {
		var sbtn = this.ui.addCategoryButton(category);
		var that = this;
		sbtn.addEventListener("click", function () {
			that.categoryClicked(category);
		});
	};

	this.categoryClicked = function (category) {
		this.ui.itemPage.innerHTML = "";
		this.clearFilters();
		this.browsingItems = true;
		window.location.hash = "category";
		this.loadPage(category, 0);
		this.ui.toggleSearchPage();
	};

	this.clearFilters = function () {
		this.currentFilters = {};
	};

	this.addNewPage = function () {
		if (this.waitingForNewPage == true) {
			return null;
		}

		var page = this.latestPage;
		var skip = page.vars["start"] + config.params.itemsPerPage;
		if (skip < page.info.total) {
			this.loadPage(page.category, skip);
		}
		else {

		}
	};

	this.loadPage = function (category, skip) {

		var that = this;

		var params = {
			limit: config.params.itemsPerPage,
			//color:"red",
			start: skip
		};

		if (category != "") {
			params.category = category;
		}

		for (var n in this.currentFilters) {
			if (this.currentFilters[n] == null) continue;
			params[n] = this.currentFilters[n];
		}
		var request = ajax({
			method: 'post',
			url: 'php/db_out_json.php',
			data: params
		});
		//this.latestCategory = category;

		request.then(function (response) {
			var page = new PageResponse(response, params);
			that.loadResponse(page);
		});
	};

	this.loadIds = function (ids) {

		var that = this;

		var params = {
			ids: ids
		};

		var request = ajax({
			method: 'post',
			url: 'php/db_out_json.php',
			data: params
		});

		request.then(function (response) {
			var page = new PageResponse(response, params);

			that.loadIDResponse(page);
		});
	};

	this.closeSearch = function () {
		this.browsingItems = false;
		this.ui.toggleSearchPage();
		//this.latestCategory = null;
	};

	this.loadIDResponse = function (/*PageResponse*/page) {
		var that = this;
		var products = page.products;
		this.latestPage = page;
		//

		for (var i = 0; i < products.length; i++) {
			var prd = new ProductInfo();
			var pdinfo = products[i];
			for (var k in pdinfo) prd[k] = pdinfo[k]; //
			this.loadedProducts[prd.product_id] = prd;

			this.addItemById(prd.product_id, false);
		}
	};

	this.loadResponse = function (/*PageResponse*/page) {
		var that = this;
		var products = page.products;
		this.latestPage = page;
		//
		if (page.products.length == 0) {
			var message = lang.nothing_found;
			this.ui.itemPage.innerHTML = "<div class='notification'>" + message + "</div>";
		}

		for (var i = 0; i < products.length; i++) {
			var prd = new ProductInfo();
			var pdinfo = products[i];
			for (var k in pdinfo) prd[k] = pdinfo[k]; //

			var thmb = this.ui.makeProductThumb(prd);
			prd.thumBody = thmb;
			this.ui.itemPage.appendChild(thmb);
			prd.thumBody.addEventListener("click", function () {
				var thumb_id = this.getAttribute("id");
				var id = thumb_id.split("_")[0];
				that.showProduct(id);
			});
			this.loadedProducts[prd.product_id] = prd;
		}

		var totalLines = Math.ceil(page.info.total / config.params.itemsPerLine);
		var em = parseInt(window.getComputedStyle(document.body).fontSize);
		config.params.maxPageHeight = totalLines * em * config.params.thumbSize;
		this.waitingForNewPage = false;
		this.ui.loadOptions(page);

	};
	this.createItemFromProduct = function (/*ProductInfo*/prod) {
		var itm = new CanvasItem();
		itm.src = config.paths.large + prod.largeImage;
		itm.productId = prod.product_id;
		itm.productName = prod.name;
		itm.productBrand = prod.brand;
		itm.price = prod.price;
		itm.url = prod.shop_url;
		itm.icon = prod.smallImage;
		return itm;
	};

	this.showSaveWindow = function () {
		var that = this;
		if(this.itemsOnCanvas.length < config.minItemInSet)
		{
			alert(lang.alert3);
			return false;
		}
		var savewind = document.getElementById("saveSetWindow");
		savewind.style.display = "";
		var bg = findClass(savewind, "fullBg");
		var cross = findClass(savewind, "closeCross");
		bg.onclick = function () {
			that.hideSaveWindow();
		};
	};

	this.hideSaveWindow = function () {
		var savewind = document.getElementById("saveSetWindow");
		savewind.style.display = "none";
	};

	this.startSavingCurentSet = function () {
		this.clearCurrentItem();
		var that = this;
		var form = document.getElementById("saveSetWindow");

		var stinfo = new SetInfo();
		stinfo.post.set_name = document.getElementById("set-name")['value'];
		if(stinfo.post.set_name == "")
		{
			alert(lang.alert4);
			return false;
		}
		stinfo.post.set_description = document.getElementById("set-desc")['value'];
		if(stinfo.post.set_description == "")
		{
			alert(lang.alert5);
			return false;
		}
		var ttlprice = 0;
		var xdoc = document.implementation.createDocument("","", null);
		var set = xdoc.createElement("set");
		xdoc.appendChild(set);

		var canvrect = this.ui.canvas.getBoundingClientRect();
		for( var i = 0; i < this.itemsOnCanvas.length; i++)
		{
			var itm = this.itemsOnCanvas[i];
			var prod = xdoc.createElement("prod");
			var prodrect = itm.body.getBoundingClientRect();
			var x = Math.floor(prodrect.left / canvrect.width*1000)/10;
			var y = Math.floor(prodrect.top / canvrect.height*1000)/10;
			var w = Math.floor(prodrect.width / canvrect.width*1000)/10;
			var h = Math.floor(prodrect.height / canvrect.height*1000)/10;


			prod.setAttribute("x", x.toString());
			prod.setAttribute("y", y.toString());
			prod.setAttribute("w", w.toString());
			prod.setAttribute("h", h.toString());
			prod.setAttribute("z", i.toString());
			prod.setAttribute("id", itm.productId);
			prod.setAttribute("brand", itm.productBrand);
			prod.setAttribute("name", itm.productName);
			prod.setAttribute("icon", itm.icon);
			prod.setAttribute("price", itm.price);

			ttlprice += parseFloat(itm.price);

			set.appendChild(prod);
		}

		var serdata = this.saveItemsToString();
		set.setAttribute("hash", serdata);
		var serializer = new XMLSerializer();

		stinfo.post.xml_description = serializer.serializeToString(xdoc);
		stinfo.post.total_price = ttlprice.toString();

		//return false;

		this.ui.loading(form, true);
		var imgToSave = this.renderItems();
		stinfo.userID = 0;



		imgToSave.onload = function (e) {
			stinfo.setImage(this);
			that.saveSet(stinfo);
			that.ui.loading(form, false);
		};

	};

	this.saveSet = function (set/*SetInfo*/) {
		//var req = ajax.send()
		var that = this;
		var request = ajax({
			method: 'post',
			url: 'php/save_set.php',
			data: set.post
		});
		request.then(function (response) {
			that.setSaved(response);
			//var page = new PageResponse(response, params);
			//that.loadResponse(page);
		});
	};

	this.latestHistoryState = function () {
		return this.saveItemsToString();
	};

	this.setSaved = function (resp) {
		//var thumb = new Image();
		var that = this;
		var inf = findClass(that.ui.saveWindow, "savedInfo");
		var form = findClass(that.ui.saveWindow, "ui");
		var link1 = findClass(inf, "linkOne");
		var a1 = findClass(link1, "setLink");
		var link2 = findClass(inf, "linkTwo");
		var a2 = findClass(link2, "setLink");
		var thumb = findClass(inf, "setThumb");

		var id = resp["set"]["setId"];
		a1.href = "?set=" + id;
		a2.href = "?hash=" + this.latestHistoryState();

		thumb.onload = function (e) {
			that.ui.loading(that.ui.saveWindow, true);

			inf.classList.remove(config.classes.totallyHidden);
			form.classList.add(config.classes.totallyHidden);
			//var n = "<h3>"+resp["set"]["set_id"]+"</h3>";
			//inf.appendChild(n);
			//inf.appendChild(this);
		};
		thumb.src = resp["set"]["thumb"];
		localStorage.clear();
	};

}

function SetInfo() {
	this.post = {};
	this.post.set_description = "";//$_POST['set_description'];
	this.post.xml_description = "<xml>";//$_POST['xml_description'];
	this.post.set_name = "";//$_POST['set_name'];
	 this.post.total_price = 0;//$_POST['total_price'];
	this.post.user_id = config.ids.userID;//$_POST['user_id'];
	this.post.img_b64 = null;//base64_decode($_POST['img_b64']);
	this.post.img_name = base32.encode(Date.now() + "" + config.ids.userID);//$_POST['img_name'];
	this.post.contest_id = 0;//$_POST['contest_id'];
	// this.post.category = 0;//$_POST['category'];
	this.post.set_id = null;//$_POST['set_id'];

	this.history_url = null;

	this.setImage = function (/*Image*/img) {
		this.post.img_b64 = img.src;
	};
	return this;
}

function UI() {
	this.canvas = document.getElementById(config.ids.canvas);
	this.renderCanvas = document.getElementById(config.ids.renderCanvas);
	this.canvasContainer = document.getElementById(config.ids.canvasContainer);
	this.controls = document.getElementById(config.ids.controlsContainer);
	this.search = document.getElementById(config.ids.searchContainer);
	this.appConttainer = document.getElementById(config.ids.appContainer);
	this.appConttainer.style.display = "block";
	this.currentControls = document.getElementById(config.ids.currentControls);
	this.handlers = document.getElementById(config.ids.handlers);

	this.searchButtons = document.getElementById(config.ids.searchButtons);
	this.pageContainer = document.getElementById(config.ids.pageContainer);
	this.pageTrimmer = document.getElementById(config.ids.itempageTrimmer);
	this.itemDesc = document.getElementById(config.ids.itemDesc);
	this.itemDescPicture = document.getElementById(config.ids.itemDescPicture);
	this.addItemBtn = document.getElementById(config.ids.addItem);
	this.searchSubmit = document.getElementById(config.ids.searchsubmit);
	this.subcategory = /*HTMLSelectElement*/document.getElementById(config.ids.subcategory);
	this.brand = /*HTMLSelectElement*/document.getElementById(config.ids.brand);
	this.color = /*HTMLSelectElement*/document.getElementById(config.ids.color);
	this.closeSaveWindow = document.getElementById("closeSaveWindow");
	this.totalPrice = /*HTMLSelectElement*/document.getElementById(config.ids.totalPrice);
	this.descContainer = /*HTMLSelectElement*/document.getElementById(config.ids.descContainer);
	this.curItemDesc = /*HTMLSelectElement*/document.getElementById(config.ids.curItemDesc);

	this.price = /*HTMLSelectElement*/document.getElementById(config.ids.price);

	this.canvasScale = 1;
	this.canvasOffset = {x: 0, y: 0};
	this.itemPage = document.getElementById(config.ids.itemPage);
	this.close = document.getElementById(config.ids.close);
	this.categoryButtons = {};
	this.fullscreeen = document.getElementById(config.ids.fullscreeen);
	this.save = document.getElementById(config.ids.save);
	this.saveWindow = document.getElementById(config.ids.saveWindow);
	this.submitSet = document.getElementById(config.ids.submitSet);
	this.undo = document.getElementById(config.ids.undo);
	this.redo = document.getElementById(config.ids.redo);
	this.controlButtons =
	{
		reflect: document.getElementById(config.ids.reflect),
		// rotate: document.getElementById(config.ids.rotate),
		// move: document.getElementById(config.ids.move),
		scaleUp: document.getElementById(config.ids.scaleUp),
		scaleDown: document.getElementById(config.ids.scaleDown),
		remove: document.getElementById(config.ids.remove),
		parent: document.getElementById(config.ids.currentControls)
	};

	//this.cent = document.getElementById("cent");
	this.minItemSize = null;

	this.screenMode = "desktop";

	this.updateElements = function () {

		var hei = window.innerHeight;
		var wid = document.body.clientWidth;
		var em = parseInt(window.getComputedStyle(document.body).fontSize);
		var emsize = Math.floor(wid / em);
		var emhsize = Math.floor(hei / em);

		var itemsW = Math.floor(emsize / config.params.thumbSize);
		var itemsH = Math.floor(emhsize / config.params.thumbSize);

		var appsize = parseInt(window.getComputedStyle(this.appConttainer).width);

		var dxdy = hei / wid; // horizontal < 1, vertical > 1;

		//* this part uses pseudo elements, have to be rewriten
		/*var tracer = document.getElementById("tracer");
		 var st = window.getComputedStyle(tracer, ":after");*/
		var bp = "";

		if (bp == "") {
			if (emsize >= 65) {
				bp = "bp-large";
			}
			else {
				if (emsize >= 45) {
					bp = "bp-medium";
				}
				else {
					if (emsize >= 20) {
						bp = "bp-small";
					}
					else {
						bp = "bp-small-x";
					}
				}
			}
		}
		/**/

		this.loading = function (/*HTMLElement*/elem, force) {
			force = "test";
			//var lscreen = elem.getElementsByClassName(config.classes.loadingScreen)[0];
			var el = findClass(elem, config.classes.loadingScreen);
			var cl = el.classList;
			if (force == true) {
				cl.remove(config.classes.totallyHidden);
				TweenLite.from(el, 0.5, {
					alpha: 0, onComplete: function () {
					}
				});
			}
			else if (force == false) {
				TweenLite.to(el, 0.5, {
					alpha: 0, onComplete: function () {
						cl.add(config.classes.totallyHidden);
					}
				});
			}
			else {
				if (cl.contains(config.classes.totallyHidden)) {
					cl.remove(config.classes.totallyHidden);
					TweenLite.from(el, 0.5, {
						alpha: 0, onComplete: function () {
						}
					});

				}
				else {
					TweenLite.to(el, 0.5, {
						alpha: 0, onComplete: function () {
							cl.add(config.classes.totallyHidden);
						}
					});

				}
			}
		};

		config.params.itemsPerPage = itemsH * itemsW + itemsW;
		config.params.itemsPerLine = itemsW;
		//this.pageTrimmer.style.paddingLeft = (wid / em - itemsW * config.params.thumbSize) / 2 + "em";

		var canvas_size = config.canvasWidth;
		var search_size = 600;
		var controls_size = 0;
		var appMargin = 0;
		this.tooSmall(false);

		if (bp == "bp-large") {
			LOG("UI LARGE:" + emsize);
			canvas_size = 512;
			controls_size = canvas_size * 0.7;
			search_size = appsize - canvas_size - em;
			appMargin = (wid - parseInt(window.getComputedStyle(this.appConttainer).width)) / 2;
			this.screenMode = "desktop";
		}
		else if (bp == "bp-medium") {
			LOG("UI MEDIUM: " + emsize);
			canvas_size = wid * 0.5 - em;
			search_size = wid * 0.5;
			controls_size = wid * 0.5;
			if (dxdy > 63) {
				canvas_size = wid;
				search_size = canvas_size;
			}
			this.screenMode = "tablet";
		}
		else if (bp == "bp-small" || bp == "bp-small-x") {
			LOG("UI SMALL: " + emsize + "  but" + bp);
			canvas_size = wid - em;
			controls_size = canvas_size;
			search_size = wid;
			this.screenMode = "mobile";
		}
		else {
			LOG("breakpoints not supported");
			this.tooSmall(true);
		}
		this.canvasContainer.style.width = this.canvasContainer.style.height = canvas_size + em + "px";
		this.search.style.width = search_size + "px";
		this.controls.style.width = controls_size + "px";
		this.canvasScale = (canvas_size) / (config.canvasWidth);

		this.canvas.style.transform = "scale(" + this.canvasScale + "," + this.canvasScale + ")";
		this.canvas.style.webkitTransform = "scale(" + this.canvasScale + "," + this.canvasScale + ")";
		this.canvas.style.mozTransform = "scale(" + this.canvasScale + "," + this.canvasScale + ")";
		this.canvas.style.msTransform = "scale(" + this.canvasScale + "," + this.canvasScale + ")";
		this.minItemSize = Math.floor(config.minRelItemSize * canvas_size);
		this.appConttainer.style.left = appMargin + "px";
		this.currentControls.style.width = controls_size + "px";

		var elem = this.canvas;

		var rect = elem.getBoundingClientRect();
		//this.cent.style.left = rect.left + "px";
		//this.cent.style.top = rect.top + "px";

		this.canvasOffset.x = rect.left;
		this.canvasOffset.y = rect.top;

		if (this.screenMode == "desktop") {
			var rectS = this.search.getBoundingClientRect();
			var rectA = this.appConttainer.getBoundingClientRect();
			this.pageContainer.style.left = rectS.left + "px";
			this.pageContainer.style.width = rectS.right - rectS.left + "px";
			this.pageContainer.style.top = rectS.top + "px";
			// this.ui.descContainer.style.marginTop = "";
			document.getElementById('descContainer').style.marginTop = "";
			this.pageContainer.style.height = rectA.bottom - rectS.top - (rectS.top - rectA.top) + "px";
		}
		else if (this.screenMode == "mobile") {
			this.controls.style.width = "";
			var r1 = getOffsetRect(this.descContainer);
			var r2 = getOffsetRect(this.currentControls);
			this.descContainer.style.marginTop = r2.bottom + "px";
		}
		else {
			this.pageContainer.style.left = "";
			this.pageContainer.style.width = "";
			this.pageContainer.style.top = "";
			this.pageContainer.style.height = "";
			this.descContainer.style.marginTop = "";
		}
		/**/
	};



	this.showProductInfo = function (/*ProductInfo*/prdinfo) {
		this.itemDesc.style.display = "block";
		TweenLite.from(this.itemDesc, 0.5, {alpha: 0});
		var piccontainer = this.itemDesc.getElementsByClassName(config.classes.productPic)[0];
		var desccontainer = this.itemDesc.getElementsByClassName(config.classes.productDesc)[0];

		piccontainer.innerHTML = "";
		desccontainer.innerHTML = "";
		piccontainer.style.backgroundImage = "";
		var img = document.createElement("img");

		var preloader = document.createElement("img");

		preloader.className = "preloader";
		piccontainer.appendChild(preloader);

		var proddesc = document.createElement("div");
		var prodprice = document.createElement("div");
		var prodlink = document.createElement("div");

		proddesc.textContent = prdinfo.name;
		prodlink.innerHTML = "<a href=\"" + prdinfo.shop_url + "\">" + lang.more_info + "</a>";
		prodprice.textContent = lang.from+" " + prdinfo.price + " "+lang.money;

		prodprice.className = config.classes.pricetag;

		desccontainer.appendChild(proddesc);
		desccontainer.appendChild(prodprice);
		desccontainer.appendChild(prodlink);

		img.onload = function () {
			piccontainer.style.backgroundImage = "url(" + img.src + ")";
			piccontainer.removeChild(preloader);
		};

		preloader.src = config.paths.preloader;
		img.src = config.paths.large + prdinfo.largeImage;
	};
	this.hideProductInfo = function (animated) {
		var that = this;
		if (animated) {
			TweenLite.to(this.itemDesc, 0.5, {
				alpha: 0, onComplete: function () {
					that.itemDesc.style.display = "none";
					that.itemDesc.style.opacity = "1.0";
				}
			});
		}
		else {
			that.itemDesc.style.display = "none";
			that.itemDesc.style.opacity = "1.0";
		}

	};
	this.toggleControl = function (control) {
		/*for (var n in this.controlButtons) {
		 var dv = /!*Element*!/this.controlButtons[n];
		 dv.classList.remove(config.classes.controlToggle);
		 }
		 var dvt = document.getElementById(control);
		 var img = dvt.querySelector("img");
		 dvt.classList.add(config.classes.controlToggle);
		 TweenLite.from(img, 0.2, {scaleX: 0.8, scaleY: 0.8});*/
	};

	this.tooSmall = function (bool) // show a user that screen size is too small
	{
		if (bool == true) {
			this.appConttainer.style.display = "none";
		}
		else {
			this.appConttainer.style.display = "inline-block";
		}
	};

	this.addCategoryButton = function (category) {
		var icon = where(config.iconlist, "category", category);
		if (icon != null) {
			var sbtn = document.createElement("div");
			var sbtn_img = document.createElement("img");
			var sbtn_text = document.createElement("div");
			sbtn_img.src = config.paths.icons + icon.src;
			sbtn.appendChild(sbtn_img);
			sbtn.appendChild(sbtn_text);
			sbtn.classList.add(config.classes.search_button);
			sbtn_text.innerText = category;
			this.searchButtons.appendChild(sbtn);
			this.categoryButtons[category] = {body: sbtn};
		}
		return sbtn;
	};

	this.makeProductThumb = function (/*ProductInfo*/product) {
		var that = this;
		var pdthumb = document.createElement("div");
		pdthumb.classList.add(config.classes.productThumb);
		var pdimg = document.createElement("img");
		var desktop_draggable = document.createElement("div");
		desktop_draggable.classList.add(config.classes["deskDrag"]);
		pdthumb.appendChild(desktop_draggable);
		pdimg.src = config.paths.preloader;
		var realimg = document.createElement("img");
		realimg.src = config.paths.small + product.smallImage;
		pdthumb.ondragstart = function () {
			return false;
		};
		pdthumb.style.width = "80px";
		pdthumb.style.height = "80px";
		//pdthumb.style.display = "none";
		//pdimg.src =
		realimg.onload = function () {
			/*if (pdimg.height > pdimg.width) {
			 pdimg.style.height = "100%";
			 pdimg.style.width = "auto";
			 }
			 else {
			 pdimg.style.width = "100%";
			 pdimg.style.height = "auto";
			 }*/
			//TweenLite.from(pdthumb, 0.5, {scaleX:0, scaleY:0});
			pdthumb.style.display = "";
			pdimg.src = realimg.src;
			pdthumb.style.width = "";
			pdthumb.style.height = "";
		};
		pdthumb.appendChild(pdimg);

		pdthumb.setAttribute("id", product.product_id + "_pdt");

		if (this.screenMode == "desktop") {
			Draggable.create(pdthumb, {
				type: "x,y",
				trigger: desktop_draggable,
				onDragStartScope: pdthumb,
				onDragEndScope: pdthumb,
				onReleaseScope: pdthumb,
				onPressScope: pdthumb,
				//dragResistance: 0.1,
				onPress: function (e) {
					console.log("dragstart");
					var brc = getOffsetRect(this);
					var nn = this.cloneNode(true);
					this.parentNode.insertBefore(nn, this);
					nn.style.opacity = 0.2;
					nn.setAttribute("id", "");
					this.style.position = "absolute";
					this.style.width = brc.width + "px";
					this.style.height = brc.height + "px";
					this.style.top = brc.top + "px";
					this.style.left = brc.left + "px";
					document.body.appendChild(this);
					this["dd"] = nn;
					//nn.setAttribute("id", "currentDrag");
					//nn.classList.remove(config.classes.productThumb);
					//TweenLite.to(this, 1, {scaleX:1.7, scaleY:1.7, ease:Back.easeOut});
					//document.body.appendChild(nn);
				},
				onRelease: function (e) {
					console.log("released");
					var rect = getOffsetRect(this);
					var crect = getOffsetRect(that.canvas);
					var id = this.id.split("_")[0];

					if (crect.top < rect.top) {
						if (crect.left < rect.left) {
							if (crect.left + crect.width > rect.right) {
								var rx = (rect.left - crect.left) / crect.width;
								var ry = (rect.top - crect.top) / crect.height;
								var itm = new CanvasItem();

								var params = {
									top: ry,
									left: rx
								};
								APP.addItemById(id, true, params);
							}
						}
					}

					var double = this["dd"];
					double.parentNode.insertBefore(this, double);
					double.parentNode.removeChild(double);
					double = null;
					TweenLite.set(this, {clearProps: "all"});
				},
				onDragEnd: function () {
					console.log("dragEnd");
				}
			});

		}

		return pdthumb;
	};

	this.loadOptions = function (/*PageResponse*/page) {
		var i = 0;
		var j = 0;
		var opt = null;

		var optionsToScan = ["brand", "subcategory", "color", "price"];

		for (i = 0; i < optionsToScan.length; i++) {
			var filt = optionsToScan[i];
			var optArr = /*HTMLSelectElement*/page.info[filt];
			var sel = this[filt];

			if (optArr.length == 0) {
				//var defop1 = new Option("all", filt, true, true);
				//defop.disabled = true;
				//sel.options.add(defop1);

				continue;
			}
			else {
				while (sel.options.length > 0) {
					var op = sel.options[0];
					sel.options.remove(op);
				}

				var defop = new Option(filt, "none", true, true);
				defop.disabled = true;
				sel.options.add(defop);
				sel.classList.remove(config.classes.selectedItemGray);
			}

			for (j = 0; j < optArr.length; j++) {
				opt = new Option(optArr[j].value, optArr[j].value); //text, value
				//
				sel.options.add(opt);
				//opt.style.backgroundColor = optArr[j].value;
			}
		}

	};

	this.toggleSearchPage = function (force) {
		var that = this;
		//this.updateElements();
		var hei = window.innerHeight;
		var wid = window.innerWidth;

		if (force != undefined) {
			if (force == true) {
				this.pageContainer.style.display = "none";
			}
			else {
				this.pageContainer.style.display = "block";
			}
		}

		if (this.pageContainer.style.display == "none") {
			this.hideProductInfo();
			this.pageContainer.style.display = "block";
			this.appConttainer.style.pointerEvents = "none";
			if (this.screenMode == "desktop") {
				this.appConttainer.style.pointerEvents = "";
				TweenLite.from(this.pageContainer, 0.4, {
					scaleX: 0, scaleY: 0, onComplete: function () {
						TweenLite.set(that.pageContainer, {clearProps: "scale"});
					}
				});
				return false;
			}
			TweenLite.from(this.pageContainer, 0.7, {
				x: -wid, ease: Power1.easeInOut, onComplete: function () {
					that.pageContainer.style.transform = "";
				}
			});
		}
		else {
			that.pageContainer.style.willChange = "transform";
			this.appConttainer.style.pointerEvents = "auto";
			window.location.hash = "";
			if (this.screenMode == "desktop") {

				TweenLite.to(this.pageContainer, 0.3, {
					opacity: 0, onComplete: function () {
						that.pageContainer.style.display = "none";
						TweenLite.set(that.pageContainer, {clearProps: "opacity"});
					}
				});
				return false;
			}
			TweenLite.to(this.pageContainer, 0.3, {
				x: -wid, ease: Power1.easeIn, onComplete: function () {
					that.pageContainer.style.display = "none";
					TweenLite.set(that.pageContainer, {x: 0});
					that.pageContainer.style.willChange = "";
					that.pageContainer.style.transform = "";
				}
			});
			//this.pageContainer.style.display = "none";
		}
	}

}

function HistoryData() {
	this.undoLen = 0;
}

function HistoryState() {
	this.set = [];

}

function CanvasItem() {
	this.src = "";
	this.top = 0.5;
	this.left = 0.5;
	this.relSize = 0.5;
	this.width = 0;
	this.sizeToApply = 0;
	this.rotation = 0;
	this.proportion = 1;
	this.body = /*Element*/{};
	this.picture = /*Image*/{};
	this.scaler = {};
	this.mover = {};
	this.draggaMove = /*Draggable*/null;
	this.draggaRotate = /*Draggable*/null;
	this.draggaScale = /*Draggable*/null;
	this.data =
	{};

	this.sP = {
		cX: 0,
		cY: 0,
		pX: 0,
		pY: 0,
		newX: 0,
		newY: 0,
		initL: 0
	};
	//this.scaleHandle = "";
	this.productId = 0;
	this.productName = "";
	this.productBrand = "";
	this.icon = "";
	this.price = 0;
	this.scalla = null;

	this.m = null;
	this.dragged = false;
	this.activateDrag = function (dragtype) {
		if (this.draggaMove != null) this.draggaMove.disable();
		if (this.draggaRotate != null) this.draggaRotate.disable();
		if (this.draggaScale != null) this.draggaScale.disable();
		dragtype.enable();
	};

	this.startScale = function (e) {

	};
	this.startRotate = function (e) {

	};
	this.startMove = function (e) {
	};

}

function PageResponse(response, vars) {
	if (response.info == undefined) {
		response = JSON.parse(response);
	}
	this.empty = false;
	if (response.products.length == 0) {
		response.empty = true;
	}
	this.info = {};
	this.info.brand = response.info.brand || [];
	this.info.color = response.info.color || [];
	this.info.price = response.info.price || [];
	this.info.subcategory = response.info.subcategory || [];
	this.info.total = parseInt(response.info.total);
	this.products = response.products;
	this.vars = vars;
	this.category = vars.category || "";

	this.info.brand.sort(this.compare);
	this.info.price.sort(this.compare);
	this.info.subcategory.sort(this.compare);
	this.info.color.sort(this.compare);
	this.compare = function (a, b) {
		if (a.value > b.value) {
			return 1;
		}
		if (a.value < b.value) {
			return -1;
		}
		return 0;
	}

}

function ProductInfo() {
	this.brand = null;
	this.brand_url = null;
	this.category = null;
	this.color = null;
	this.description = null;
	this.largeImage = null;
	this.mediumImage = null;
	this.name = null;
	this.price = null;
	this.price_range = null;
	this.product_id = null;
	this.shop = null;
	this.shop_url = null;
	this.smallImage = null;
	this.subcategory1 = null;
	this.thumBody = /*Element*/null;
}

/*utils*---------------------------------------------------------------*/
function LOG(obj) {
}

if (document.getElementsByClassName) {

	getElementsByClass = function (classList, node) {
		return (node || document).getElementsByClassName(classList)
	}

} else {

	getElementsByClass = function (classList, node) {
		var node = node || document,
			list = node.getElementsByTagName('*'),
			length = list.length,
			classArray = classList.split(/\s+/),
			classes = classArray.length,
			result = [], i, j;
		for (i = 0; i < length; i++) {
			for (j = 0; j < classes; j++) {
				if (list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
					result.push(list[i]);
					break;
				}
			}
		}

		return result
	}
}

function $_GET(param) {
	var vars = {};
	window.location.href.replace(location.hash, '').replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function (m, key, value) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

function toggleFullScreen() {
	if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}
// *func* - function to invoke only if at least *wait* milisecons have been passed since previous invoke
// use as
// func = debounce ( func(){}, 250 );
function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function where(objarr, param, value) {
	var l = objarr.length - 1;
	while (l >= 0) {
		if (objarr[l][param] == value) {
			return objarr[l];
		}
		else {
			l--;
		}
	}
	return null;
}

function getOffsetRect(elem) {
	// (1)
	var box = elem.getBoundingClientRect();

	// (2)
	var body = document.body;
	var docElem = document.documentElement;

	// (3)
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

	// (4)
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;

	// (5)
	var top = box.top + scrollTop - clientTop;
	var left = box.left + scrollLeft - clientLeft;

	return {
		top: Math.round(top),
		left: Math.round(left),
		width: box.width,
		height: box.height,
		bottom: Math.round(top) + box.height,
		right: Math.round(left) + box.width
	}
}

function findClass(element, className) {
	var foundElement = null, found;

	function recurse(element, className, found) {
		for (var i = 0; i < element.childNodes.length && !found; i++) {
			var el = element.childNodes[i];
			var classes = el.className != undefined ? el.className.split(" ") : [];
			for (var j = 0, jl = classes.length; j < jl; j++) {
				if (classes[j] == className) {
					found = true;
					foundElement = element.childNodes[i];
					break;
				}
			}
			if (found)
				break;
			recurse(element.childNodes[i], className, found);
		}
	}

	recurse(element, className, false);
	return foundElement;
}

function roundFloats(str) {
	var result = "";
	var snch = str.split("(");
	var parts = snch[1].split(",");
	var l = parts.length;
	for( var i = 0; i < l; i++)
	{
		var part = parts[i];
		var part2 = parseFloat(part);
		if(isNumber(part2))
		{
			if(part2 < 2)
			{
				part2 = part2.toFixed(3);
			}
		}
		else
		{
			part2 = part;
		}

		if(i != l-1)
		{
			result += part2+",";
		}
		else
		{
			result += part2+")";
		}
	}
	result = snch[0] +"(" + result;
	return result;
}

function applyMatrix(obj, matr) {
	obj.style.transform = matr;
	obj.style.webkitTransform = matr;
	obj.style.mozTransform = matr;
	obj.style.msTransform = matr;
}

function isNumber(value) {
	return typeof value === 'number' &&
		isFinite(value);
}

function isOverlapping(container, element) {
	var rect = getOffsetRect(element);
	var crect = getOffsetRect(container);

	if(rect.bottom < crect.top) return false;
	if(rect.right < crect.left) return false;
	if(rect.top > crect.bottom) return false;
	if(rect.left > crect.right) return false;
	return true;
}








