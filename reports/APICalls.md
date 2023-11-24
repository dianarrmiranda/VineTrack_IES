## User
    
| Tarefa | Método | Endpoint                              | Parâmetros                                                                           |
|------------------|--------|-----------------------------------------|--------------------------------------------------------------------------------------------------|
| Registar user | POST  | `/user/register?username="test"&name="test"&email="test@gmail.com"&password="Test1."&role="user"` | `username`, `name`, `email`, `password`, `role` |
| Ver user  | GET  | `/user/view?id="1"&token="0VtC90-MfB3WtMzIY8myoSofzCjd9gyWZvOjJ1tZji18WifS-EQboqeT8GLRgDpHcd9vDvTtSsNpqReqeTbuIA"` | `id`, `token` |
| Procurar um username  | GET  | `/user/username?username="test"` | `username` |
| Procurar um email  | GET  | `/user/email?email="test@gmail.com"` | `email` |
| Fazer Login  | GET  | `/user/login?email="test@gmail.com"&password="Test1."` | `email`, `password` |