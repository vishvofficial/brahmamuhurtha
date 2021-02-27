function getIP() {
	return fetch("https://api64.ipify.org?format=json").then(data => data.json());
}

function getUserLocation(ip) {
	return fetch("https://ipapi.co/"+ip+"/json/").then(data => data.json());
}

function getSunriseTime(lat, lng) {
	return fetch("https://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lng+"&formatted=0").then(data => data.json());
}

function addTime(time, addH, addM) {
	let newTime = new Date(time.getTime());
	let hours = time.getHours();
	let minutes = time.getMinutes();
	hours += addH;
	minutes += addM;
	if(minutes >= 60) {
		minutes -= 60;
		hours += 1;
	}
	newTime.setHours(hours);
	newTime.setMinutes(minutes);
	return newTime;
}

function subtractTime(time, subH, subM) {
	let newTime = new Date(time.getTime());
	let hours = time.getHours();
	let minutes = time.getMinutes();
	hours -= subH;
	minutes -= subM;
	if(minutes < 0) {
		minutes += 60;
		hours -= 1;
	}
	newTime.setHours(hours);
	newTime.setMinutes(minutes);
	return newTime;
}

function getBHMT(sunrise) {
	let bhmtStarts = subtractTime(sunrise, 1, 36);
	let bhmtEnds = addTime(bhmtStarts, 0, 48);
	setBHMT(sunrise, bhmtStarts, bhmtEnds);
}

function getFormattedTime(time) {
	return time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
}

function setBHMT(sunrise, bhmtStarts, bhmtEnds) {
	const bhmt = document.getElementById('time');
	const sr = document.getElementById('sunrise');
	sr.innerText = sunrise.toLocaleTimeString();
	bhmt.innerText = getFormattedTime(bhmtStarts) + "-" + getFormattedTime(bhmtEnds); 
}

function setUserInfo(user) {
	const loc = document.getElementById('location');
	const timezone = document.getElementById('timezone');
	loc.innerText = user.city+ ", " + user.country_name;
	timezone.innerText = user.timezone + " (" + user.utc_offset + ")";
}


async function fetchData() {
	const ip = await getIP().then((data) => data.ip);
	const user = await getUserLocation(ip).then(data => data);
	setUserInfo(user);
	const srt = await getSunriseTime(user.latitude, user.longitude);
	getBHMT(new Date(srt.results.sunrise));	
}