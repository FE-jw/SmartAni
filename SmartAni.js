

class SmartAni{
	constructor(selector, options){
		this.obj = document.querySelector(selector);
		this.triggerElement = document.querySelector(options.triggerElement);
		this.triggerHeight = options?.triggerHeight ?? 100;
		this.start = null;
		this.end = null;
		this.css = options.css;
		this.indicator = options?.indicator ?? false;
		this.init();
	}
	
	/**
	 * trigger 활성화 지점 reset
	 */
	setTrigger(){
		this.start = window.scrollY + this.triggerElement.getBoundingClientRect().top;
		this.end = this.start + (this.triggerElement.offsetHeight * this.triggerHeight / 100);
	}

	/**
	 * trigger start, end 표시(테스트용)
	 */
	showIndicator(){
		const triggerStart = document.createElement('div');
		triggerStart.dataset.smartAniTrigger = '';
		triggerStart.style.padding = '0.2em 1.0em';
		triggerStart.style.position = 'absolute';
		triggerStart.style.left = 0;
		triggerStart.style.fontSize = '16px';
		triggerStart.style.color = '#fff';
		triggerStart.style.backgroundColor = '#000';
		triggerStart.style.zIndex = 10000;
		
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

	/**
	 * 결과값 설정
	 */
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
			scaleY: this.css.scaleY?.to ?? 1,
			skewX: this.css.skewX?.to ?? 0,
			skewY: this.css.skewY?.to ?? 0,
			translateX: this.css.translateX?.to ?? 0,
			translateY: this.css.translateY?.to ?? 0
		};
		effect.change = {
			scaleX: effect.to.scaleX - effect.from.scaleX,
			scaleY: effect.to.scaleY - effect.from.scaleY,
			skewX: effect.to.skewX - effect.from.skewX,
			skewY: effect.to.skewY - effect.from.skewY,
			translateX: effect.to.translateX - effect.from.translateX,
			translateY: effect.to.translateY - effect.from.translateY
		};
		effect.result = {
			scaleX: null,
			scaleY: null,
			skewX: null,
			skewY: null,
			translateX: null,
			translateY: null
		};

		// opacity 있는 경우
		if(this.css.opacity){
			effect.from.opacity = this.css.opacity?.from ?? 1;
			effect.to.opacity = this.css.opacity?.to ?? 1;
			effect.change.opacity = effect.to.opacity - effect.from.opacity;
			effect.result.opacity = null;
		}
		
		// 결과값 저장
		for(let prop in effect.result){
			if(effect.to[prop] != effect.result[prop]){
				effect.result[prop] = effect.from[prop] + (effect.change[prop] * currentPercent / 100);
			}else{
				effect.result[prop] = effect.from[prop] + effect.change[prop];
			}
		}

		if(trigger >= this.end){
			for(let key of Object.keys(effect.to)){
				this.obj.style.setProperty(`--smart-ani-${key}`, effect.to[key]);
			}
		}else if(trigger <= this.start){
			for(let key of Object.keys(effect.from)){
				this.obj.style.setProperty(`--smart-ani-${key}`, effect.from[key]);
			}
		}else if(trigger > this.start && trigger < this.end){
			for(let key of Object.keys(effect.result)){
				this.obj.style.setProperty(`--smart-ani-${key}`, effect.result[key]);
			}
		}
	}

	/**
	 * 초기화 함수
	 */
	init(){
		/**
		 * transform:matrix(a, b, c, d, tx, ty);
		 * a: scaleX
		 * b: skewY
		 * c: skewX
		 * d: scaleY
		 * tx: translateX
		 * ty: translateY
		 */

		this.setTrigger();
		this.setTransform();
		this.obj.style.transform = 'matrix(var(--smart-ani-scaleX), var(--smart-ani-skewY), var(--smart-ani-skewX), var(--smart-ani-scaleY), var(--smart-ani-translateX), var(--smart-ani-translateY)';
		if(this.css.opacity) this.obj.style.opacity = 'var(--smart-ani-opacity)';
		
		window.addEventListener('load', () => {
			if(this.indicator) this.showIndicator();
		});

		['load', 'scroll', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {
				this.setTransform();
			});
		});

		['load', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {
				this.setTrigger();
			});
		});
	}
}