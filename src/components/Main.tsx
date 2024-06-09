import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import MyError from "../interfaces/MyError";
import SavedTask from "../interfaces/SavecTask";

const Main = () => {
  const [taskList, setTaskList] = useState<Array<SavedTask>>([]);
  const [task, setTask] = useState("");

  if (taskList.length === 0) {
    axios
      .get("https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task")
      .then((response) => {
        setTaskList(
          response.data.message.map(
            (value: { _id: string; task: string; __v: number }) => {
              return { id: value._id, task: value.task };
            }
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (task.length > 0) {
      try {
        const response = await axios.post(
          "https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task",
          {
            task: task,
          }
        );
        const { responseTask = task, _id } = response.data.message;
        setTaskList([...taskList, { task: responseTask, id: _id }]);
      } catch (error) {
        console.log((error as MyError).message);
      }
    }
  };

  const handleDeleteClick = async (
    _event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => {
    try {
      const response = await axios.delete(
        "https://site--react-todo-list-backend--x7c7hl9cnzx6.code.run/task/" +
          id
      );
      const newTaskList = [...taskList].filter((taskList) => {
        return taskList.id !== id;
      });
      setTaskList(newTaskList);
    } catch (error) {
      console.log((error as MyError).message);
    }
  };

  return (
    <main>
      <div>
        {taskList.map((task) => {
          return (
            <article className="task" key={task.id}>
              <div className="check-box"></div>
              <p className="task-description">{task.task}</p>
              <FontAwesomeIcon
                icon={"trash"}
                onClick={(event) => {
                  handleDeleteClick(event, task.id);
                }}
              />
            </article>
          );
        })}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="task"
            placeholder="new task"
            onChange={(event) => {
              setTask(event.target.value);
            }}
            value={task}
          />
          <input type="submit" placeholder="Add task" />
        </form>
      </div>
    </main>
  );
};

export default Main;
