//arr varable is to store the generated array, state variable stores all the changes to the array that are recorded during the soring process and highlight variable stores the index of the elements in the array whose positions are modified during sorting.
const MAX_VALUE = 100
const MIN_VALUE = 1
const BAR_WIDTH = 10
const BAR_MARGIN = 2
const BAR_HEIGHT_SCALE = 4 


var arr = []
var state = []
var highlight = []

var isSorting = 0

function sortOrStop () {
	if (isSorting==0) {
		isSorting=1
		sort()
	} else {
		isSorting=0
	}
}

//Function that calls the required sorting algorithm based on the user input and calls the iterateState function after sorting for visualization.
function sort() {
	var sortAlg = document.getElementById("sortalg").value
	var sortSpeed = 1000-(20*document.getElementById("sortspeed").value)
	if (sortAlg=="merge") {
		mergeSrt()
	} else if (sortAlg=="bubble") {
		bubbleSort()
	} else if (sortAlg=="quick") {
		
	} else if (sortAlg=="insertion") {
		insertionSort()
	}
	// document.getElementById("sort").disabled = true
	// document.getElementById("sort").style.cursor = "progress"
	document.getElementById("sort").innerText = "Stop"
	document.getElementById("sort").style.background = "#f33232"
	document.getElementById("generate").disabled = true
	document.getElementById("generate").style.cursor = "not-allowed"
	iterateState(0,sortSpeed)
}

//Function that iterates the state changes of the array recorded during the sorting process. At each iteration, the function plots the array state and applies some delay.
function iterateState(i,sortSpeed) {
	if(i<state.length && isSorting==1) {
		arr=state[i]
		plotBar()
		var visArea = document.getElementById("vis_board")
		visArea.children[highlight[i][0]].style.background="green"
		visArea.children[highlight[i][1]].style.background="green"
		setTimeout(iterateState,sortSpeed,i+1,sortSpeed)
	} else {
		plotBar()
		// document.getElementById("sort").disabled = false
		// document.getElementById("sort").style.cursor = "pointer"
		isSorting=0
		document.getElementById("sort").innerText = "Sort"
		document.getElementById("sort").style.background = "grey"
		document.getElementById("generate").disabled = false
		document.getElementById("generate").style.cursor = "pointer"
	}
}


//Function to generate array data depending on the selection (random, nearly sorted, reversed, few unique)
function generateData() {
	var visArea = document.getElementById("vis_board")
	visArea.style.width = document.getElementById("arrsize").value*(BAR_MARGIN+BAR_MARGIN+BAR_WIDTH) + 'px';
	tempArr = []
	var arrType = document.getElementById("arrtype").value
	var arrSize = document.getElementById("arrsize").value

	if (arrType=='rand') {
		while(tempArr.length!=arrSize) {
			//Random : Generating a random value between 1 and 100
			tempArr.push(Math.floor(Math.random() * (101 - 1) ) + 1)
		}
	} else if(arrType=='nasc') {
		var temp = 1
		var step = Math.floor(Math.sqrt(arrSize))
		while(tempArr.length!=arrSize) {
			//Nearly sorted : The logic here is to generate array in ascending order but whenever this condition is satisfied (When a element in array is divisible by sqrt(array size), then it is modified)
			if (temp%step==0) {
				tempArr.push(arrSize-temp)
			} else {
				tempArr.push(temp)
			}
			temp = temp+1
		}
	} else if(arrType=='rev') {
		//Reveresed : This is straight foword logic. Generating an array in which the elements are in descending order
		var temp = arrSize
		while(tempArr.length!=arrSize) {
			tempArr.push(temp)
			temp = temp-1
		}
	} else {
		//Few Unique : Here, a random value is generated and pushed into the array multiple times (sqrt(array size) times exactly unless the array is full). This is done repeated til the array is full.
		var step = Math.floor(Math.sqrt(arrSize))
		while(tempArr.length!=arrSize) {
			var temp = Math.floor(Math.random() * (101 - 1) ) + 1
			for(i=0;i<step && tempArr.length!=arrSize;i++) {
				tempArr.push(temp)
			}
		}
		tempArr.sort(() => Math.random() - 0.5);
	}
	arr = tempArr
	plotBar()
}

//Function to plot the inverted barchart

function plotBar() {

	//Clearing the visualization area i.e the existing barplot
	var visArea = document.getElementById("vis_board")
	visArea.innerHTML = "";

	//Plotting the array as barchart
	for (i=0;i<arr.length;i++) {
		var div = document.createElement("div");
		div.style.width = BAR_WIDTH + 'px';
		div.style.height = arr[i]*BAR_HEIGHT_SCALE + 'px';
		div.className = "bar";
		div.style.margin  = "0 "+ BAR_MARGIN + 'px';
		visArea.appendChild(div);
	}
}

//Sorting Algorithms

function bubbleSort() {
	state=[]
	highlight=[]
	for (i=0;i<arr.length;i++) {
		for (j=i+1;j<arr.length;j++) {
			if (arr[i]>arr[j]) {
				var temp = arr[j]
				arr[j] = arr[i]
				arr[i] = temp
				highlight.push([i,j])
				state.push([...arr])
			}
		}
	}
}

function insertionSort() {
	state=[]
	highlight=[]
	for (i=1;i<arr.length;i++) {
		key = arr[i]
		j = i-1
		while (j>=0 && arr[j]>key) {
			arr[j+1] = arr[j]
			highlight.push([j+1,j])
			state.push([...arr])
			j=j-1
		}
		arr[j+1] = key
		highlight.push([j+1,j+1])
		state.push([...arr])
	}
}

function merge(arr,l, m, r) {
	var leftArr = arr.slice(l,m+1)
	var rightArr = arr.slice(m+1,r+1)
	
	var i=0
	var j=0
	var k=l

	while(i<leftArr.length && j<rightArr.length) {
		if(leftArr[i]>rightArr[j]) {
			arr[k] = rightArr[j]
			highlight.push([k,m+1+j])
			state.push([...arr])
			j=j+1
		} else {
			arr[k] = leftArr[i]
			highlight.push([k,l+i])
			state.push([...arr])
			i=i+1
		}
		k=k+1
	}

	while(i<leftArr.length) {
		arr[k] = leftArr[i]
		highlight.push([k,l+i])
		state.push([...arr])
		i=i+1
		k=k+1
	}

	while(j<rightArr.length) {
		arr[k] = rightArr[j]
		highlight.push([k,m+1+j])
		state.push([...arr])
		j=j+1
		k=k+1
	}
}

function mergeSort(arr,l, r) {
	if (l<r) {
		var m = Math.floor((l+r)/2) 
		mergeSort(arr, l, m);
		mergeSort(arr, m+1, r);
		merge(arr,l,m,r)
	}
}

function mergeSrt() {
	state=[]
	highlight=[]
	mergeSort(arr,0,arr.length-1)
}