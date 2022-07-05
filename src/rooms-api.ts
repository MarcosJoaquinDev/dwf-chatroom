type Message = {
	from: string;
	message: string;
	date: Date;
};
async function createUser(email: string, name: string) {
	const user = {
		email: email,
		name: name,
	};
	const promise = await fetch('/signup', {
		method: 'post',
		body: JSON.stringify(user),
		headers: { 'Content-Type': 'application/json' },
	});
	if (promise.status == 400) {
		return 'Error: Este usuario ya esta registrado';
	} else {
		return promise.json();
	}
}
async function loginUser(email: string) {
	const promise = await fetch('/signin', {
		method: 'post',
		body: JSON.stringify({ email }),
		headers: { 'Content-Type': 'application/json' },
	});
	if (promise.status == 404) {
		return 'Error: Este usuario no existe';
	} else {
		return promise.json();
	}
}
async function createNewRoom(userId: string) {
	const promise = await fetch('/rooms', {
		method: 'post',
		body: JSON.stringify({ userId: userId }),
		headers: { 'Content-Type': 'application/json' },
	});
	if (promise.status == 404) {
		return 'Error: Este usuario no existe';
	} else {
		return promise.json();
	}
}
async function enterAnExistingRoom(userId: string, roomId: number) {
	const promise = await fetch(
		'/rooms/' + roomId.toString() + '?userId=' + userId,
		{ method: 'get' }
	);
	if (promise.status == 404) {
		return 'Error: Este usuario no existe';
	} else {
		return promise.json();
	}
}
async function sendMessage(message: Message, rtdbRoomId: string) {
	const promise = await fetch('/messages', {
		method: 'post',
		body: JSON.stringify({ message: message, rtdb_Id: rtdbRoomId }),
		headers: { 'Content-Type': 'application/json' },
	});

	return promise.json();
}
async function getNameFromUsers(email: string) {
	const promise = await fetch('/name' + '?email=' + email, {
		method: 'get',
	});
	return promise;
}
export {
	createUser,
	loginUser,
	createNewRoom,
	enterAnExistingRoom,
	sendMessage,
	getNameFromUsers,
};
