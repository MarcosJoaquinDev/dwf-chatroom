import { state } from '../state';
class Chat extends HTMLElement {
	shadow = this.attachShadow({ mode: 'open' });
	name: string;
	messages: any[] = [];
	constructor() {
		super();
		this.render();
		this.name = state.getName();
		this.messages = state.data;
	}
	connectedCallback() {
		state.subscribe(() => {
			this.messages = state.data;
			this.render();
		});
	}
	listener() {
		const formEl = this.shadow.querySelector('.form-send') as any;
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			const target = e.target as any;
			const msj = target['message-send'].value;
			state.setMessagesFromRtdb(msj);
			target.value = '';
		});
	}
	render() {
		let content = document.createElement('div');
		let style = document.createElement('style');
		let flag = 0;
		this.shadow.innerHTML = '';
		content.innerHTML = `
		<h1 class='title'>Chat</h1>
		<p class='name'>${this.name}</p>
		<p class='room-id-title'>Room ID: ${state.roomId}</p>
		<section class='container-chat'>
			<div class='messages'>
			${this.messages
				.map((msj) => {
					if (flag != 0) {
						return `<p class='message ${msj.from == this.name ? 'right' : ''}'>
						<i class='message__from'>${msj.from}</i>
						<i class='message__msj'>${msj.message}</i> 
						<i class='message__date'>${('' + msj.date).substr(11, 5)}</i>
						</p>`;
					} else {
						flag = 1;
						return '';
					}
				})
				.join('')}
			</div>
		</section>
		<form class='form-send'>
			<input name='message-send' class='input-send'/>
			<button class='button-send'>Eniviar</button>
		</form>
		`;
		style.innerHTML = `
		.title{
			margin:0;
			margin-left:20px;
		}
		.name{
			margin:10px;
			text-align:center;
		}
		.room-id-title{
			margin:0;
			font-size:24px;
			text-align:center;
		}
		.container-chat{
			background-color:#A99BFF;
			max-width: 600px; 
			margin: 0 auto;
			display:flex;
			justify-content:center;
			border-radius:4px;
		}
		.messages{
			width:100%;
			max-height:400px;
			display:flex;
			flex-direction:column;
			gap:5px;
			padding:10px;
			overflow-y: auto;
		}
		.message{
			margin:0;
			width: 150px;
			height: 50px;
			background-color:#8FBC8F;
			display:flex;
			flex-direction:column;
			gap:3px;
			border-radius:4px;
			padding:5px;
		}
		.right{
			align-self: end;
			background-color:#90EE90;
		}
		.message__from{
			font-size: 8px;
		}
		.message__msj{
			font-size:12px;
		}
		.message__date{
			font-size:5px;
		}
		.form-send{
			display:flex;
			flex-direction:column;
			gap:5px;
			margin: 0 auto;
			max-width:500px;
		}
		.input-send{
			border:none;
			border-radius:4px;
			background-color:#534bed;
			height:45px;
			font-size:18px;
			font-family: 'Anton', sans-serif;
		}
		.button-send{
			border:none;
			border-radius:4px;
			background-color:#664bed;
			height:55px;
			font-size:24px;
			font-family: 'Anton', sans-serif;
		}
		`;
		this.shadow.appendChild(style);
		this.shadow.appendChild(content);
		this.listener();
	}
}
customElements.define('x-chatroom', Chat);
/*

*/
