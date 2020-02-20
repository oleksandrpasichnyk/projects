document.addEventListener('DOMContentLoaded', () => {

	const reverseBtn = document.querySelector('#row');
	const inputs = document.querySelector('.count');
	const decimalInput = document.querySelector('#decimal');
	const romanianInput = document.querySelector('#romanian');
	const abc = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1000
	};

	const replace = () => {
		inputs.style.flexDirection == "row-reverse" ? inputs.style.flexDirection = "row" : inputs.style.flexDirection = "row-reverse";
	};

	const isDecimalValid = () => {
		var str = decimalInput.value;
		var decimalvalid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		let valid = true;

		if(str === ''){
			romanianInput.value = '';
		}

		for (let i in str) {
			if (str[0] == '0') {
				decimalInput.value = str.replace(str[0], '');
			}
			if (Number(str) > 4999) {
				valid = false;
				romanianInput.value = '';
				showAlert('decimal', 'decimalAlert2');
			}
			if (!decimalvalid.includes(str[i])) {
				valid = false;
				decimalInput.value = str.replace(str[i], '');
				showAlert('decimal', 'decimalAlert1');
				valid = true;
			}

			if(valid){
				romanianInput.value = decimalToRoman(decimalInput.value);
			}
		}

		if (valid == true) {
			romanianInput.disabled = false;
			decimalInput.style.borderColor = '#777';
			//calculate(Number(str));
		} else {
			romanianInput.disabled = true;
		}
	};

	const isRomanianValid = () => {
		var str = romanianInput.value.toUpperCase();
		var valid = true;

		if(str === ''){
			decimalInput.value = '';
		}

		for (let i in str) {
			str[i].toUpperCase();
			if (!Object.keys(abc).includes(str[i])) {
				romanianInput.value = str.replace(str[i], '');
				showAlert('romanian', 'romanianAlert1');
			}
		}

		if(!isRomanian(str) && str!=""){
			valid = false;
			showAlert('romanian', 'romanianAlert3');
		}

		if (valid == true) {
			decimalInput.disabled = false;
			romanianInput.style.borderColor = '#777';
			//calculate(Number(str));
		} else {
			decimalInput.disabled = true;
			decimalInput.value = '';
			showAlert('romanian', 'romanianAlert2');
		}

		if(valid){
			decimalInput.value = romanToDec(romanianInput.value);
		}
	};

	const isRomanian = (s) => {
		let arr = s.split('')
		let max = 'I';
		for (let i in arr) {

			//найбільший символ має 1 чи 2 індекс
			let c = arr[i];  //символ
			abc[max] > abc[c] ? max = max : max = c;

			//не більше трьох символів підряд, після них менший або кінець, через один символ може повторитись 1 раз, але не далі
			let crange = 0;
			//let s1 = 
			for(let j = i; j < arr.length; j++){
				if(c == arr[j]){
					crange++;
					if(crange>3){
						console.log("3 more " + c);
						return false;
					}
				}
				else{
					let s1 = arr.slice(j);
					let b = s1.find(element => element = c);
					/* if(crange>3 || s[j]>c || !(b!=-1 || b!=1)){
						console.log("false 1");
						return false;		
					} */
					if((crange>1 && c === 'V') || (crange>1 && c === 'L') || (crange>1 && c === 'D')){
						console.log("double " + c);
						return false;
					}
					if(crange>3){
						console.log("crange = " + crange);
						return false;
					}
					if(abc[s[j]]>abc[c] && j!=1 && crange>1){
						console.log(abc[s[j]] + ">" + abc[c] + " (index " + j + ", number " + s[j] + " )");
						return false;
					}
					if(!(b!=-1 || b!=1)){
						console.log(c + "next index = " + b);
						return false;
					}
					crange = 0;
				}
			}

		}
		if(arr.indexOf(max)!==0 && arr.indexOf(max)!==1){
			return false;
		}
		return true;
	};

	const romanToDec = (str) => {
		let total = 0;
		str = str.toUpperCase();
		let arr = str.split('');
		if(str===""){
			return "";
		}
		for(let j=0; j<arr.length; j++){
			let b1 = str[j];
			let b2 = str[j+1];
			if(j==arr.length-1){
				b2 = 'I';
			}
		
			if(arr.length === 1){
				total+=abc[b1];
				//console.log(total);
				return total.toString();
			}
			if(abc[b1]>=abc[b2]){  //йде просто по спаданню
				//console.log(total + '+' + abc[b1]);
				total += abc[b1];
				
			}
			else if(j!=arr.length-1){  //цифра 4 або 9
				//console.log(total + '-' + abc[b1]);
				total -= abc[b1];
				
			}
			else{
				// console.log(total + '+' + abc[b1]);  
				// total += abc[b1];
			}
		}
		//console.log('total:', total);
		return total.toString();
	};

	const decimalToRoman = (str) => {
		let arr = str.split('');
		arr = arr.reverse();
		let total = '';
		for (let i = arr.length-1 ; i>=0; i--) {
			arr[i] = Number(arr[i]);  //2
			let n = arr[i]*Math.pow(10, i);  //2000
			let k = '';  //''
			if(i!=3 && n!=0){
				if(arr[i]==4 || arr[i]==9){
					k+=Object.keys(abc)[i*2];
					arr[i] == 4 ? k+=Object.keys(abc)[i*2+1] : k+=Object.keys(abc)[i*2+2];
					n=0;
				}
				if(n>=Object.values(abc)[i*2+1]){  // 5, 6, 7, 8
					n-=Object.values(abc)[i*2+1];
					k+=Object.keys(abc)[i*2+1];
				}
				if(n<Object.values(abc)[i*2+1] && n!=0){ //1, 2, 3
					while(n!=0){
						n-=Object.values(abc)[i*2];  //  n=1000;  n=0;
						k+=Object.keys(abc)[i*2];    //  k='M';   k='MM';
					}
				}
			}
			else{
				while(n!=0){
					n-=Object.values(abc)[i*2];  //  n=1000;  n=0;
					k+=Object.keys(abc)[i*2];    //  k='M';   k='MM';
				}
			}
			total += k.toString();
			
		}
		return total;
		//console.log(str + " = " + total + " = " + romanToDec(total));
	};



	// const randomRomanian = () => {
	// 	let s = '';
	// 	while(!isRomanian(s)){
	// 		let length = Math.floor(Math.random() * Math.floor(4))+1;
	// 		s = '';
	// 		for(let i = 0; i <= length; i++){
	// 			s+=Object.keys(abc)[Math.floor(Math.random() * Math.floor(5))];
	// 		}
	// 	}
	// 	return s;
	// };

	// const decimalRandom = () => {
	// 	let s = Math.floor(Math.random() * Math.floor(4999));
	// 	return s.toString();
	// };



	// const test = () => {
	// 	let t = 0;

	// 	for (let i = 0; i < 10; i++) {
	// 		let a = randomRomanian();
	// 		//console.log(isRomanian(a));
	// 		let b = romanToDec(a);
	// 		//console.log(a, b);
	// 		if(a === decimalToRoman(b)){
	// 			t++;
	// 		}
	// 		else{
	// 			console.log("ERROR: " + a + " = " + romanToDec(a) + " = " + decimalToRoman(b));
	// 		}
			
	// 	}
	// 	console.log(t*100/10 + "% Roman to Decimal convertation quality");

	// 	t = 0;
	// 	for (let i = 0; i < 10000; i++) {
	// 		let a = decimalRandom();
	// 		let b = decimalToRoman(a);
	// 		//console.log(a, b);
	// 		if(a === romanToDec(b)){
	// 			t++;
	// 		}
	// 		else{
	// 			//console.log("ERROR: " + a + " = " + decimalToRoman(a) + " = " + romanToDec(b));
	// 		}
			
	// 	}
	// 	console.log(t*100/10000 + "% Decimal to Roman convertation quality");
	// };

	// test();

	const showAlert = (ID, alertID) => {
		document.getElementById(alertID).classList.add('alertShow');
		document.getElementById(ID).style.borderColor = 'red';

		function removeAlert() {
			document.getElementById(alertID).classList.remove('alertShow');
			document.getElementById(ID).style.borderColor = '';
		}
		setTimeout(removeAlert, 4000);
	};

	reverseBtn.addEventListener('click', replace);
	decimalInput.addEventListener("input", isDecimalValid);
	romanianInput.addEventListener("input", isRomanianValid);

});


//https://www.rapidtables.com/convert/number/roman-numerals-converter.html?x1=&x2=4999