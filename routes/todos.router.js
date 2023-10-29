// /routes/todos.router.js
import express from 'express';
import mongoose from 'mongoose';
import Todo from '../schemas/todo.schema.js';

const router = express.Router();

/**  할 일 등록 **/
//localhost:3000/api/todos POST
router.post('/todos', async(req, res) => {
  const { value } = req.body;
  if (!value) {
    return res.status(400).json({ errorMessage: "입력 값이 없어요!"});
  };

  const todoMaxOrder = await Todo.findOne().sort('-order').exec();
  const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

  const todo = new Todo({ value, order });
  await todo.save();

  return res.status(201).json({ todo : todo });
});

/**  할 일 목록 조회 **/
//localhost:3000/api/todos GET
router.get('/todos', async(req, res) => {
  const todos = await Todo.find().sort('-order').exec();
  return res.status(200).json({ todos });
});

//---------------------------------------------------
/**  할 일 내용 변경 **/
//localhost:3000/api/todos/:todoId PATCH
//:todoId : 경로매개변수. 어떤 해야할 일을 수정할지 알아야해서 넣은거임
router.patch('/todos/:todoId', async(req, res) => {
  //변경 '해야하는 일'의 id값 갖고오기 (경로매개변수에서 갖고오기)
  //그냥 order를 경로매개변수로 찾으면 안되는건가..? 안되나..? body에 들어있으니까인가?
  const { todoId } = req.params;
  //'해야하는 일'을 몇번째 순서로 설정할지 order값 요청에서 받기
  const { order, done } = req.body;

  //현재 나의 order가 뭔지 알아야한다.
  //변경하려는 '해야하는 일'에 대한 내용 모델에서 찾아 갖고오기.
  const currentTodo = await Todo.findById(todoId).exec();
  //'해야하는 일'이 없다면 에러메시지로 응답
  if(!currentTodo){
    return res.status(404).json({ errorMessage: "존재하지않는 todo 데이터입니다."});
  };

  //❗'해야하는 일'의 순서 변경
  if(order) {
    const targetTodo = await Todo.findOne({ order : order }).exec();
    if(targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save(); //이건 어디에 저장이 되는거야?
      // 이건 어떤가?!
      // targetTodo.order = currnetTodo.order;
      // currentTodo.order = order;
      // await tagetTodo.save(); 
    }
    currentTodo.order = order;
  }

  //변경된 '해야하는 일'을 저장
  await currentTodo.save(); //이건 어디에 저장이 되는거야?
  
  //❗❗'해야하는 일' 완료 / 해제
  if(done !== undefined) {
    //변경하려는 '해야하는 일'의 doneAt값을 변경
    currentTodo.doneAt = done ? new Date() : null;
  }

  return res.status(200).json({})
});

/** 할 일 삭제 **/
//localhost:3000/api/todos/:todoId DELETE
router.delete('/todos/:todoId', async(req, res) => {
  //삭제할 '해야하는 일'의 id값 가져오기
  const { todoId } = req.params;

  //삭제하려는'해야하는 일' 가져오기. 만약 해당아이디를 가진 일이 없으면 에러처리
  const todo = await Todo.findById(todoId).exec();
  if(!todo) {
    return res.status(400).json({ errorMessage: "해당 내용이 없어요!"});
  };

  //조회된 todo를 삭제
  await Todo.deleteOne({ _id : todoId }).exec();

  return res.status(200).json({});
})

export default router;