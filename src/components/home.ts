import { state } from '../state';
import './home.css';
const usuarioExistente = 'marcosjuako@hotmail.com';
class Home extends HTMLElement {
	shadow = this.attachShadow({ mode: 'open' });
	constructor() {
		super();
		this.render();
	}
	async userLoginExist(email: string) {
		const warningEl = this.shadow.querySelector('.form-room__warning') as any;
		const inputEmailEl = this.shadow.querySelector(
			'.form-room__email__input'
		) as any;
		const emailPromise = await state.login(email);
		if (emailPromise == 'Error: Este usuario no existe') {
			warningEl.className = 'form-room__warning';
			inputEmailEl.className = 'form-room__email__input warning';
		}
		if (!(emailPromise == 'Error: Este usuario no existe')) {
			state.getNameFromApi(email);
		}
	}
	userExist(email: string, name: string) {
		const warningEl = this.shadow.querySelector(
			'.form-registrarse__warning'
		) as any;
		const inputEmailEl = this.shadow.querySelector(
			'.form-resgistrarse__email__input'
		) as any;
		const existRecordEl = this.shadow.querySelector(
			'.form-registrarse__existing-record'
		) as any;
		state.signup(name, email).then((res) => {
			if (res == 'Error: Este usuario ya esta registrado') {
				warningEl.className = 'form-registrarse__warning';
				inputEmailEl.className = 'form-resgistrarse__email__input warning';
			} else {
				warningEl.className = 'form-registrarse__warning none';
				inputEmailEl.className = 'form-resgistrarse__email__input';
				existRecordEl.className = 'form-registrarse__existing-record';
			}
		});
	}
	listener() {
		const formSignUp = this.shadow.querySelector('.form-registrarse') as any;
		const formSignIn = this.shadow.querySelector('.form-room') as any;
		const formSelect = this.shadow.querySelector('.form-room__select') as any;
		const inputRoomId = this.shadow.querySelector(
			'.form-room__input-id-room'
		) as any;

		formSignUp.addEventListener('submit', (e) => {
			// FORMULARIO PARA REGISTRARSE MANDA EL NOMBRE Y EL MAIL
			e.preventDefault();
			const date = e.target as any;
			const name = date['name-signup'].value;
			const email = date['email-signup'].value;
			this.userExist(email, name);
			date['name-signup'].value = '';
			date['email-signup'].value = '';
		});
		formSignIn.addEventListener('submit', (e) => {
			// FORMULARIO PARA INGRESAR EN UNA ROOM(NUEVA O EXISTENTE) CON UN EMAIL EXISTENTE
			e.preventDefault();
			const date = e.target as any;
			const email = date['email-singin'].value;
			const typeRoom = date['room'].value;
			if (typeRoom == 'nueva') {
				state.existRoom = false;
				state.newRoom();
			} else {
				state.existRoom = true;
				const roomId = inputRoomId.value;
				state.roomId = roomId;
			}
			this.userLoginExist(email);
			date['email-singin'].value = '';
			inputRoomId.value = '';
		});
		formSelect.addEventListener('change', (e) => {
			const roomValue = e.target.value;
			if (roomValue == 'nueva') {
				inputRoomId.className = 'form-room__input-id-room none';
			}
			if (roomValue == 'existente') {
				inputRoomId.className = 'form-room__input-id-room';
			}
		});
	}
	render() {
		const div = document.createElement('div');
		const style = document.createElement('style');
		div.innerHTML = `
			<header class='header' >Chat Rooms App</header>
			<main class='container'>
				<h2 class='title'>Bienvenidx</h2>
				<form class='form-registrarse'>
					<p class='form-registrarse__warning none'>Advertencia: Este usuario ya esta registrado</p>
					<p class='form-registrarse__existing-record none'>Registro Existoso!</p>
					<div class='form-resgistrarse__nombre'>
						<label class='form-resgistrarse__nombre__label' >Nombre</label>
						<input class='form-resgistrarse__nombre__input' name='name-signup' type='text'/>
					</div>
					<div class='form-resgistrarse__email'>
						<label class='form-resgistrarse__email__label' >Email</label>
						<input class='form-resgistrarse__email__input' name='email-signup' type='text'/>
					</div>
					<button class='form-resgistrarse__button'>Registrarme</button>
				</form>
				<h2 class='room-title'>Room</h2>
				<form class='form-room'>
					<p class='form-room__warning none'>Error: Este usuario no existe</p>
					<div class='form-room__email' >
						<label class='form-room__email__label'>Email</label>
						<input class='form-room__email__input' type='text' name='email-singin'/>
					</div>
					<select class='form-room__select' name='room' >
						<option class='form-room__select__option' value='nueva'>Nueva room</option>
						<option class='form-room__select__option' value='existente'>Room existente</option>
					</select>
					<input  class='form-room__input-id-room none' placeholder='Ingresar tu ID' type='text' name='room-id'/>
					<button class='form-room__button' >Comenzar</button>
				</form>
			</main>
			`;
		style.innerHTML = `
		.container{
			max-width: 500px;
			margin: 0 auto;
			display: flex;
			flex-direction:column;
			gap:20px;
			justify-content:center;
			align-items: center;
		}
		.header{
			width: 100%;
			height: 60px;
			background-color:#FF8282;
			padding:10px;
		}
		.title,
		.room-title{
			margin: 15px 0 ;
			align-self: start;
		}
		.form-registrarse__warning,
		.form-room__warning{
			color: red;
			font-size: 15px;
			margin: 0;
		}
		.form-registrarse__existing-record{
			color: green;
			font-size: 15px;
			margin: 0;
		}
		.form-registrarse,
		.form-room{
			width: 100%;
			display:flex;
			flex-direction:column;
			gap:10px;
			border-radius: 4px;
			background-color: #A99BFF;
			padding: 10px;
		}
		.form-resgistrarse__nombre,
		.form-resgistrarse__email,
		.form-room__email{
			display:flex;
			flex-direction:column;
			gap:5px;
		}
		.form-resgistrarse__nombre__label,
		.form-resgistrarse__email__label{
			font-size:15px;
		}
		.form-resgistrarse__nombre__input,
		.form-resgistrarse__email__input,
		.form-room__email__input,
		.form-room__input-id-room{
			border-radius:4px;
			border:solid 1px;
			font-size:24px;
			background-color: #A99BFF;
		}
		.form-resgistrarse__button,
		.form-room__button{
			border:none;
			border-radius: 4px;
			background-color: #89DEF1;
			height:55px;
			padding: 10px;
			font-size:24px;
			color: #2C2C2C;
			font-family: 'Anton', sans-serif;
		}
		.form-room__email__label{}
		.form-room__select{
			border:none;
			border-radius: 4px;
			background-color: #89DEF1;
			height:45px;
			padding: 5px;
			font-size:18px;
			color: #2C2C2C;
			font-family: 'Anton', sans-serif;
		}
		.form-room__select__option{
			font-size:12px;
		}
		.none{
			display:none;
		}
		.warning{
			border:solid 1px red;
		}
		`;
		this.shadow.appendChild(style);
		this.shadow.appendChild(div);
		this.listener();
	}
}
customElements.define('x-home', Home);
