import express from 'express';
import connect from './schemas/index.js';
import TodosRouter from './routes/todos.router.js'

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// static Middleware, express.static()을 사용하여 정적 파일을 제공합니다.
app.use(express.static('./assets'));

const router = express.Router();

router.get('/', (req, res) => { //라우터 테스터
  return res.json({ message: '메인 화면이야!어때 멋지지!' });
});

app.use('/api', [router, TodosRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});