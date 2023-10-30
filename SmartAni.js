

class SmartAni{
	constructor(selector, options){
		this.obj = document.querySelector(selector);
		this.start = options.start;
		this.end = options.end;
		this.css = options.css;
		this.trigger = options?.trigger ?? false;
		this.init();

		['load', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {
				this.resetPosition(options);
			});
		});
	}

	triggerPoint(){
		const triggerStart = document.createElement('div');
		triggerStart.dataset.smartAniTrigger = '';
		triggerStart.style.padding = '0.2em 0.5em';
		triggerStart.style.position = 'absolute';
		triggerStart.style.right = 0;
		triggerStart.style.fontSize = '16px';
		triggerStart.style.color = '#fff';
		triggerStart.style.backgroundColor = '#000';
		triggerStart.style.zIndex = 100;
		
		const triggerEnd = triggerStart.cloneNode();
		
		triggerStart.innerHTML = `#${this.obj.id} START`;
		triggerStart.style.borderTop = '2px solid #f00';
		triggerStart.style.top = this.start + 'px';
		triggerEnd.innerHTML = `#${this.obj.id} END`;
		triggerEnd.style.borderBottom = '2px solid #f00';
		triggerEnd.style.top = this.end + 'px';
		triggerEnd.style.transform = 'translateY(-100%)';

		document.body.append(triggerStart, triggerEnd);
	}

	resetPosition(options){
		this.start = options.start;
		this.end = options.end;
	}

	setTransform(){
		const thisHeight = this.end - this.start;
		const trigger = window.scrollY + window.innerHeight;
		const triggerY = trigger - this.start;
		const currentPercent = triggerY * 100 / thisHeight;
		const effect = {};
		effect.from = {
			scaleX: this.css.scaleX?.from ?? 1,
			scaleY: this.css.scaleY?.from ?? 1,
			skewX: this.css.skewX?.from ?? 0,
			skewY: this.css.skewY?.from ?? 0,
			translateX: this.css.translateX?.from ?? 0,
			translateY: this.css.translateY?.from ?? 0
		};
		effect.to = {
			scaleX: this.css.scaleX?.to ?? 1,
			skewY: this.css.skewY?.to ?? 0,
			skewX: this.css.skewX?.to ?? 0,
			scaleY: this.css.scaleY?.to ?? 1,
			translateX: this.css.translateX?.to ?? 0,
			translateY: this.css.translateY?.to ?? 0
		};
		effect.value = {
			scaleX: (effect.to.scaleX != effect.from.scaleX) ? (effect.to.scaleX - effect.from.scaleX) * currentPercent / 100 : 0,
			scaleY: (effect.to.scaleY != effect.from.scaleY) ? (effect.to.scaleY - effect.from.scaleY) * currentPercent / 100 : 0,
			skewX: (effect.to.skewX != effect.from.skewX) ? (effect.to.skewX - effect.from.skewX) * currentPercent / 100 : 0,
			skewY: (effect.to.skewY != effect.from.skewY) ? (effect.to.skewY - effect.from.skewY) * currentPercent / 100 : 0,
			translateX: (effect.to.translateX != effect.from.translateX) ? (effect.to.translateX - effect.from.translateX) * currentPercent / 100 : 0,
			translateY: (effect.to.translateY != effect.from.translateY) ? (effect.to.translateY - effect.from.translateY) * currentPercent / 100 : 0
		};

		if(trigger >= this.end){
			this.obj.style.setProperty('--smart-ani-scaleX', effect.to.scaleX);
			this.obj.style.setProperty('--smart-ani-scaleY', effect.to.scaleY);
			this.obj.style.setProperty('--smart-ani-skewX', effect.to.skewX);
			this.obj.style.setProperty('--smart-ani-skewY', effect.to.skewY);
			this.obj.style.setProperty('--smart-ani-translateX', effect.to.translateX);
			this.obj.style.setProperty('--smart-ani-translateY', effect.to.translateY);
		}else if(trigger <= this.start){
			this.obj.style.setProperty('--smart-ani-scaleX', effect.from.scaleX);
			this.obj.style.setProperty('--smart-ani-scaleY', effect.from.scaleY);
			this.obj.style.setProperty('--smart-ani-skewX', effect.from.skewX);
			this.obj.style.setProperty('--smart-ani-skewY', effect.from.skewY);
			this.obj.style.setProperty('--smart-ani-translateX', effect.from.translateX);
			this.obj.style.setProperty('--smart-ani-translateY', effect.from.translateY);
		}else if(trigger > this.start && trigger < this.end){
			this.obj.style.setProperty('--smart-ani-scaleX', effect.from.scaleX + effect.value.scaleX);
			this.obj.style.setProperty('--smart-ani-scaleY', effect.from.scaleY + effect.value.scaleY);
			this.obj.style.setProperty('--smart-ani-skewX', effect.from.skewX + effect.value.skewX);
			this.obj.style.setProperty('--smart-ani-skewY', effect.from.skewY + effect.value.skewY);
			this.obj.style.setProperty('--smart-ani-translateX', effect.from.translateX + effect.value.translateX);
			this.obj.style.setProperty('--smart-ani-translateY', effect.from.translateY + effect.value.translateY);
		}
	}

	init(options){
		/**
		 * transform:matrix(a, b, c, d, e, f);
		 * a: scaleX
		 * b: skewY
		 * c: skewX
		 * d: scaleY
		 * e: translateX
		 * f: translateY
		 */
		this.setTransform();
		this.obj.style.transform = 'matrix(var(--smart-ani-scaleX), var(--smart-ani-skewY), var(--smart-ani-skewX), var(--smart-ani-scaleY), var(--smart-ani-translateX), var(--smart-ani-translateY)';
		
		window.addEventListener('load', () => {
			if(this.trigger){
				this.triggerPoint();
			}
		});

		['load', 'scroll', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {
				this.setTransform();
			});
		});
	}
}