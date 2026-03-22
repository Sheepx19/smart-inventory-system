// document.querySelector("#add-btn").addEventListener("click", function(){
//     const p = document.createElement("p");
//     p.setAttribute("class", "dynamic"); // adding class dynamic to paragraph.
//     // p.className = "try"; // other way of adding class to an element.
//     p.textContent = "This is a new paragraph";
//     // p.innerHTML = "This is a <strong>paragraph</strong>" // If adding an HTML inside HTML
//     document.body.appendChild(p);
// })




const taskInput = document.querySelector("#task");
const inputButton = document.querySelector
("#add-btn");

;
function addTask() {
    let task = taskInput.value.trim(); // trim would remove extra space

    if(task == "") {
        alert("Please enter a task");
    }

    console.log(task);

    //add the item to the unordered List

    const li = document.createElement("li");
    //li.className = "task-item";
    li.textContent = task;


    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = "Remove";
    removeBtn.type = 'button';
    li.appendChild(removeBtn);


    document.querySelector("#task-list").appendChild(li);
    
    //clear the input and set focus

    taskInput.value ="";
    taskInput.focus();
    document.querySelector("#empty-message").style.display="none";
}

inputButton.addEventListener("click", addTask);

document.addEventListener("keydown", function(e) {
    if(e.key == "Enter") {
        e.preventDefault();
        addTask();
    }
});

taskList.addEventListener('click',function(event){
    console.log(event);
    if(event.target.classList.contains){
        event.target.parentElement.remove();
        if(taskList.children.length == 1){
            document.querySelector("#empty_message").style.display="block";
        }
    }
})
