function test(){
    const testDiv = document.createElement('div');
    testDiv.textContent = " Working!"
    return testDiv;
}

document.body.appendChild(test());