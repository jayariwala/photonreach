(function() {

	"use strict";
  
	const app = {
		
		init: () => {

			//=== Start page ===\\
			app.startPage();

			//=== Lazy loading ===\\
			app.lazyLoading();

			app.setUpListeners();

			//=== Elements wide fixed ===\\
			app.elWideFixed.init();

			//=== Article ===\\
			app.article.init();

			app.customLog();

		},
 
		setUpListeners: () => {

			//=== Tabs ===\\
			const tabsNav = document.querySelectorAll(".tabs-nav li");
			if(tabsNav.length) {
				tabsNav.forEach(item => { item.addEventListener("click", app.tabs); });
			}

			//=== Accordion ===\\
			const accordionBtn = document.querySelectorAll(".accordion-btn");
			if(accordionBtn.length) {
				accordionBtn.forEach(item => { item.addEventListener("click", app.accordion); });
			}

			//=== Menu ===\\
			const menuBtn = document.querySelector(".mnu-btn");
			if(menuBtn !== null) { menuBtn.addEventListener("click", app.menu.init); }

		},

		//=== Start page ===\\
		startPage: () => {

			const preloader = document.querySelector(".preloader");

			if(preloader !== null) {

				preloader.classList.remove("active");

			}

		},

		//=== Lazy loading ===\\
		lazyLoading: () => {

			const observer = lozad(".lazy", {
				loaded: el => {

					if(el.tagName.toLowerCase() === 'picture') {

						const sources = el.querySelectorAll("source");
		
						if(sources.length) {
		
							sources.forEach( (item) => {
		
								const srcset = item.getAttribute('data-srcset');
		
								if(srcset !== null) {
									
									item.setAttribute("srcset", srcset);
									item.removeAttribute("data-srcset");
		
								}
		
							});
		
						}
		
					}

				}
			});
			observer.observe();

		},

		//=== Tabs ===\\
		tabs: e => {

			let _this = e.currentTarget,
				index = [..._this.parentNode.children].indexOf(_this),
				tabs = _this.closest(".tabs"),
				items = tabs.querySelectorAll(".tabs-item");

			if (!_this.classList.contains("active")) {

				_this.classList.add("active");
				items[index].classList.add("active");

				[..._this.parentNode.children].filter((child) => {
                    if( child !== _this ) { child.classList.remove("active"); }
                });
                [...items[index].parentNode.children].filter((child) => {
                    if( child !== items[index] ) { child.classList.remove("active"); }
                });
			
			}

		},

		//=== Accordion ===\\
		ACCORDION_FLAG: true,
		accordion: e => {

			e.preventDefault();

			const duration = 400;

			if(app.ACCORDION_FLAG === true) {

				app.ACCORDION_FLAG = false;

				const _this = e.currentTarget,
					  item = _this.closest(".accordion-item"),
					  container = _this.closest(".accordion"),
					  items = container.querySelectorAll(".accordion-item"),
					  content = item.querySelector(".accordion-content"),
					  activeContent = container.querySelector(".accordion-item.active .accordion-content");
			
				if (!item.classList.contains("active")) {
					items.forEach(function(item) { item.classList.remove("active"); });
					item.classList.add("active");
					if(activeContent !== null) { app.slideUp(activeContent, duration); }
					app.slideDown(content, duration);
				} else {
					item.classList.remove("active");
					app.slideUp(content, duration);
				}

			}

			window.setTimeout(function() { app.ACCORDION_FLAG = true }, duration);

		},

		//=== Menu ===\\
		menu: {

			BODY: document.getElementsByTagName("body")[0],
			HEADER: document.querySelector(".header"),
			TARGET: document.querySelector(".main-menu"),

			init: () => {

				if(!app.menu.TARGET.classList.contains("main-menu-transition")) {
					app.menu.TARGET.classList.add("main-menu-transition");	
				}
	
				app.menu.BODY.classList.toggle("mm-open");

				if(window.pageYOffset === 0) { app.menu.HEADER.classList.toggle("header-min"); }

				if(app.menu.BODY.classList.contains("mm-open")) {

					app.menu.animIn();
					
				} else {

					app.menu.animOut();

				}
	
			},

			animIn: () => {

				setTimeout(function() { app.menu.BODY.classList.add("overflow-hidden"); }, 300);
				
			},

			animOut: () => {

				app.menu.BODY.classList.remove("overflow-hidden");

			},
 
		},

		//=== Elements wide fixed ===\\
		elWideFixed: {

			init: () => {

				app.elWideFixed.body();
				window.addEventListener("resize", function() { app.elWideFixed.body(); });

			},

			body: () => {

				const widht = document.querySelector('body').offsetWidth;
				const container = document.querySelector(".container");
				const containerWidth = container.offsetWidth;
				const containerPadding = Number.parseInt( getComputedStyle(container, null).getPropertyValue('padding-right') );

				const footerFixed = document.querySelector(".footer-fixed");
				if(footerFixed !== null) {

					const footerFixedWidth = footerFixed.offsetWidth;

					if(widht > containerWidth) {

						footerFixed.style.right = ( ( ( widht - containerWidth ) / 2 ) + ( containerPadding - footerFixedWidth ) / 2 ) + "px";
						footerFixed.classList.add("footer-wide");

					} else {

						if(footerFixed.classList.contains('footer-wide')) {
							footerFixed.removeAttribute('style');
							footerFixed.classList.remove("footer-wide");
						}

					}

				}

			},

		},

		//=== Article ===\\
		article: {

			init: () => {

				app.article.table.responsive();

			},

			table: {

				responsive: () => {

					const articles = document.querySelectorAll(".article");
					if(articles.length) { articles.forEach(article => {
							const tables = article.querySelectorAll("table");
							if(tables.length) { tables.forEach(table => {
								app.article.table.wrap(table);
							}); }
					}); }

				},

				wrap: (table) => {

					const wrapper = document.createElement('div');
					wrapper.classList.add("table-responsive");
					table.replaceWith(wrapper);
					wrapper.appendChild(table);

					const wrapper2 = document.createElement('div');
					wrapper2.classList.add("table-responsive-outer");
					wrapper.replaceWith(wrapper2);
					wrapper2.appendChild(wrapper);

				}

			},

		},

		slideDown: target => {

			const duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

			target.style.removeProperty('display');
			let display = window.getComputedStyle(target).display;
			if (display === 'none') display = 'block';
			target.style.display = display;
			const height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.boxSizing = 'border-box';
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(function() {
				  target.style.removeProperty('height');
				  target.style.removeProperty('overflow');
				  target.style.removeProperty('transition-duration');
				  target.style.removeProperty('transition-property');
			}, duration);

		},
		slideUp: target => {

			const duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.boxSizing = 'border-box';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(function() {
				  target.style.display = 'none';
				  target.style.removeProperty('height');
				  target.style.removeProperty('padding-top');
				  target.style.removeProperty('padding-bottom');
				  target.style.removeProperty('margin-top');
				  target.style.removeProperty('margin-bottom');
				  target.style.removeProperty('overflow');
				  target.style.removeProperty('transition-duration');
				  target.style.removeProperty('transition-property');
			}, duration);

		},
		slideToggle: target => {

			const duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

			if (window.getComputedStyle(target).display === 'none') {

			  return app.slideDown(target, duration);

			} else {

			  return app.slideUp(target, duration);

			}

		},

		customLog: () => {

			const styles = [
					//'font-size: 14px',
					//'color: #ffffff',
					//'background-color: #000000',
					//'padding: 4px 0 4px 8px'
				].join(';'),
				brandStyles = [
					//'font-size: 14px',
					//'color: #ffffff',
					//'background-color: #000000',
					//'padding: 4px 8px 4px 0',
					'font-weight: bold'
				].join(';'),
				text = '%cby %cSpecia1ne';

			console.log(text, styles, brandStyles);

		},
		
	}
 
	app.init();
 
}());
