/**
 * Version: 1.0.0
 * Web: https://fe-jw.github.io/SmartAni
 * Github: https://github.com/FE-jw/SmartAni
 * Released: ####-##-##
*/

class SmartAni{
	constructor(selector, options){
		this.obj = document.querySelector(selector);
		this.triggerElement = document.querySelector(options.triggerElement);
		this.triggerRange = options?.triggerRange ?? 100;
		this.start = null;
		this.end = null;
		this.keyframe = options.keyframe;
		this.indicator = options?.indicator ?? false;
		this.cssVar = '--smart-ani-percentage';
		this.init();
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
		
		triggerStart.innerHTML = 'START(Refresh when window resize)';
		triggerStart.style.borderTop = '4px solid #f00';
		triggerStart.style.top = this.start + 'px';
		triggerEnd.innerHTML = 'END(Refresh when window resize)';
		triggerEnd.style.borderBottom = '4px solid #00f';
		triggerEnd.style.top = this.end + 'px';
		triggerEnd.style.transform = 'translateY(-100%)';

		document.body.append(triggerStart, triggerEnd);
	}

	/**
	 * 범위 설정
	 */
	setTrigger(){
		this.start = window.scrollY + this.triggerElement.getBoundingClientRect().top;
		this.end = this.start + (this.triggerElement.offsetHeight * this.triggerRange / 100);
	}

	/**
	 * 스크롤 % 설정
	 */
	setScrollPercent(){
		const thisHeight = this.end - this.start;
		const trigger = window.scrollY + window.innerHeight;
		const triggerY = trigger - this.start;
		const currentPercent = triggerY * 100 / thisHeight;

		if(trigger <= this.start){
			this.obj.style.setProperty(this.cssVar, 0);
		}else if(trigger > this.start && trigger < this.end){
			this.obj.style.setProperty(this.cssVar, currentPercent);
		}else if(trigger >= this.end){
			this.obj.style.setProperty(this.cssVar, 100);
		}
	}

	/**
	 * 결과값 설정
	 */
	setEffect(){
		this.setScrollPercent();

		const effect = Object.keys(this.keyframe);
		const referValue = {
			transform: ''
		};

		for(let idx = 0;idx < effect.length;idx++){
			const formula = `calc(var(--smart-ani-${effect[idx]}-from) + var(--smart-ani-${effect[idx]}-change) * var(${this.cssVar}) / 100)`;
			let unit = '';

			if(effect[idx].startsWith('translate')){
				unit = this.keyframe[effect[idx]].unit ?? 'px';
			}else if(effect[idx].startsWith('skew') || effect[idx].startsWith('rotate')){
				unit = 'deg';
			}

			this.obj.style.setProperty(`--smart-ani-${effect[idx]}-from`, this.keyframe[effect[idx]].from + unit);
			this.obj.style.setProperty(`--smart-ani-${effect[idx]}-to`, this.keyframe[effect[idx]].to + unit);
			this.obj.style.setProperty(`--smart-ani-${effect[idx]}-change`, this.keyframe[effect[idx]].to - this.keyframe[effect[idx]].from + unit);

			if(!effect[idx].startsWith('opacity')){
				referValue.transform += `${effect[idx]}(${formula}) `;
			}else if(effect[idx].startsWith('opacity')){
				referValue.opacity = formula;
				this.obj.style.opacity = referValue.opacity;
			}
		}
		
		this.obj.style.transform = referValue.transform;
	}

	/**
	 * 초기화 함수
	 */
	init(){
		this.setTrigger();
		this.setEffect();
		
		window.addEventListener('load', () => {
			if(this.indicator) this.showIndicator();
		});

		['load', 'scroll', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {
				this.setEffect();
			});
		});

		['load', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {
				this.setTrigger();
			});
		});
	}
}