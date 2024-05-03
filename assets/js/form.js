(function() {

	"use strict";
  
	const app = {
		
		init: () => {

			app.setUpListeners();

			app.textarea.init();

		},

		DEFAULT_CONFIG: {
			classTo: 'form-field',
			errorClass: 'error',
			successClass: 'success',
			errorTextParent: 'form-field',
			errorTextTag: 'div',
			errorTextClass: 'error'
		},
		AJAX_URL: './assets/form/handle.php',
 
		setUpListeners: () => {

			const forms = document.querySelectorAll("form");
			if(forms.length) {
				forms.forEach(item => { 

					item.addEventListener('focus', app.formFields.focus, true);
					item.addEventListener("blur", app.formFields.blur, true);

					item.addEventListener('submit', app.form, false);

				});
			}

		},

		form: e => {

			e.preventDefault();

			const form = e.currentTarget;
			const formOuter = form.closest(".form-outer");
			const formSuccessVisible = formOuter.querySelectorAll(".form-success-visible");
			const formSuccessHidden = formOuter.querySelectorAll(".form-success-hidden");

			let ajaxLoader = form.querySelector(".ajax-loader");
			let ajaxLoaderIsActive = false;

			if(ajaxLoader === null) {
				ajaxLoader = document.createElement("div");
				let ajaxLoaderInner = document.createElement("div");
				ajaxLoader.classList.add("ajax-loader");
				form.appendChild(ajaxLoader);
				ajaxLoader.appendChild(ajaxLoaderInner);
			}

			const pristine = new Pristine(form, app.DEFAULT_CONFIG),
				  valid = pristine.validate();

			if(valid && !ajaxLoaderIsActive) {

				ajaxLoader.classList.add("active");
				ajaxLoaderIsActive = true;

				const xhr = new XMLHttpRequest();
				//xhr.responseType = 'json';
				xhr.open('POST', app.AJAX_URL, true);
				let data = new FormData();

				form.querySelectorAll('.form-control').forEach(field => {

					const key = field.getAttribute('name')

					if (field.type === 'file') {

						for (const file of field.files) {

							data.append(key + '[]', file);

						}

					} else {

						data.append(key, field.value);

					}

				});
			
				xhr.send(data)
			
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {

						formSuccessVisible.forEach(item => { item.classList.add("hidden"); });
						formSuccessHidden.forEach(item => { item.classList.add("visible"); });

						ajaxLoader.classList.remove("active");
						ajaxLoaderIsActive = false;

					}

				}

			}

		},

		formFields: {

			focus: e => {

				let _this = e.target,
					tag = _this.tagName.toLowerCase();

				if(tag === "input" || tag === "textarea") {
					_this.closest('.form-field').classList.add("focus");
				}

			},

			blur: e => {

				let _this = e.target,
					tag = _this.tagName.toLowerCase();

				if(tag === "input" || tag === "textarea") {
					if(_this.classList.contains("form-control") && _this.value === "") {
						_this.closest('.form-field').classList.remove("focus");
					}
				}

			},

		},

		textarea: {

			target: document.querySelectorAll("textarea"),

			observe: (element, event, handler) => {

				element.addEventListener(event, handler);

			},

			resize: () => {

				app.textarea.target.forEach(item => {
					item.style.height = 'auto';
					item.style.height = item.scrollHeight+1+'px';
				});

			},

			delayedResize: () => {

				window.setTimeout(app.textarea.resize, 0);

			},

			init: () => {

				const el = app.textarea;

				app.textarea.target.forEach(item => {

					item.style.overflow = 'hidden';
					item.style.height = 'hidden';

					el.observe(item, 'change',  el.resize);
					el.observe(item, 'cut',     el.delayedResize);
					el.observe(item, 'paste',   el.delayedResize);
					el.observe(item, 'drop',    el.delayedResize);
					el.observe(item, 'keydown', el.delayedResize);

				});

			}

        },
		
	}
 
	app.init();
 
}());