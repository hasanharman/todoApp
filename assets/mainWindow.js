const electron = require("electron");
const {ipcRenderer} = electron;

checkTodoCount();

const todoValue = document.querySelector('#todoValue')
todoValue.addEventListener('keypress', e => {
  if (e.keyCode == 13) {
    ipcRenderer.send('newTodo:save', {
      ref: 'main',
      todoValue: e.target.value
    });
    e.target.value = '';
  }
});

const addBtn = document.querySelector('#addBtn')
addBtn.addEventListener('click', () => {
  ipcRenderer.send('newTodo:save', {
    ref: 'main',
    todoValue: todoValue.value
  });
  todoValue.value = '';
});

const closeBtn = document.querySelector('#closeBtn')
closeBtn.addEventListener('click', () => {
  if (confirm('Çıkmak istiyor musunuz?')) {
    ipcRenderer.send('todo:close')
  }
});

ipcRenderer.on('todo:addItem', (e, todo) => {
  // Container
  const container = document.querySelector('.todo-container')
  //row
  const row = document.createElement('div')
  row.className = 'row'
  //col
  const col = document.createElement('div')
  col.className = 'p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center'
  // kullanmak istemedim col.style.backgroundColor = '#12345'
  //p
  const p = document.createElement('div')
  p.className = 'm-0 w-100'
  p.innerText = todo.text
  // Del Btn
  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'btn btn-sm btn-outline-danger flex-shrink-1'
  deleteBtn.innerText = 'Sil'

  deleteBtn.addEventListener('click', (e) => {
    if (confirm('Silmek istediğinize emin misiniz?')) {
      e.target.parentNode.parentNode.remove()
      checkTodoCount()
    }
  });

  col.appendChild(p);
  col.appendChild(deleteBtn);
  row.appendChild(col);
  container.appendChild(row);

  checkTodoCount();
})

function checkTodoCount() {
  const container = document.querySelector('.todo-container')
  const alertContainer = document.querySelector('.alert-container')

  document.querySelector('.total-count-container').innerText = container.children.length;

  if (container.children.length !== 0) {
    alertContainer.style.display = 'none';
  } else {
    alertContainer.style.display = 'block';
  }
}