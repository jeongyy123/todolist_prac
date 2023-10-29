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

export default router;