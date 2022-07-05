import {
	createUser,
	loginUser,
	createNewRoom,
	enterAnExistingRoom,
	sendMessage,
	getNameFromUsers,
} from './rooms-api';
import map from 'lodash/map';
import { RTDB } from './firebase';
import { ref, onValue } from 'firebase/database';
import { Router } from '@vaadin/router';
type Message = {
	from: string;
	message: string;
	date: Date;
};
const state = {
	data: [],
	name: String,
	userId: String,
	roomId: Number,
	rtdbRoomId: String,
	existRoom: false,
	render: ([] = []),
	getMessagesFromRtdb() {
		const chatroom = ref(RTDB, `/rooms/${this.rtdbRoomId}/messages`);
		onValue(chatroom, (snapshot) => {
			const data = snapshot.val();
			this.data = map(data);

			for (let cllb of this.render) {
				cllb();
			}
		});
	},
	setName(name: string) {
		this.name = name;
	},
	getName() {
		return this.name;
	},
	setMessagesFromRtdb(message: string) {
		const newMessage = { from: this.name, message: message, date: new Date() };
		sendMessage(newMessage, this.rtdbRoomId).then((res) => {
			console.log(res);
		});
	},
	async login(email: string) {
		const promise = await loginUser(email);
		if (!(promise == 'Error: Este usuario no existe')) {
			this.userId = promise.id;
		}
		return promise;
	},
	async getNameFromApi(email: string) {
		const promise = await getNameFromUsers(email);
		promise.json().then((resName) => {
			this.setName(resName);
			if (this.existRoom) {
				this.existingRoom();
			} else {
				this.newRoom();
			}
		});
	},
	async signup(name: string, email: string) {
		const promise = await createUser(email, name);
		if (!(promise == 'Error: Este usuario ya esta registrado')) {
			this.userId = promise.id;
			this.name = name;
		}
		return promise;
	},
	newRoom() {
		createNewRoom(this.userId).then((res) => {
			if (!(res == 'Error: Este usuario no existe')) {
				this.roomId = res.id;
				this.existingRoom();
				Router.go('/chatroom');
			}
		});
	},
	existingRoom() {
		enterAnExistingRoom(this.userId, this.roomId).then((res) => {
			if (!(res == 'Error: Este usuario no existe')) {
				this.rtdbRoomId = res.rtdbRoomId;
				this.getMessagesFromRtdb();
				Router.go('/chatroom');
			}
		});
	},
	subscribe(calback: (any: any) => any) {
		this.render.push(calback);
	},
};
export { state };
